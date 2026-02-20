import { config } from "../../resource/config.js"

export type LogObj = {
    rowIndex: number,
    apiResponse: Response,
    request_uri: string,
    json_request_body?: Object
}

export class Logger {
    public static async log({ rowIndex, apiResponse, request_uri, json_request_body }: LogObj) {
        const defaultLogMessage = `Sent request of CSV row: ${rowIndex + 2}...\nReq URI: ${request_uri}\nReq Body: ${JSON.stringify(json_request_body, null, 2)}`
        // All failed responses will be logged here
        if (!apiResponse.ok) {
            console.error(`${defaultLogMessage}`)
            console.log(`❌Line ${rowIndex + 2} failed: ${apiResponse.status} ${apiResponse.statusText} - ${await apiResponse.text()}`)
            return
        }

        if (config.showVenueID) {
            apiResponse.json().then(data => {
                // const venueID: string = data.results[0].id.$oid
                const venueID: string = data.results[0]?.venue_reference?.storefront?.id ? data.results[0].venue_reference.storefront.id : data.results[0].id.$oid
                console.log(venueID)
            }).catch(() => console.log("🚨Failed to retrieve Venue ID from success response."))
        } else if (config.showCpPaymentBalance) {
            apiResponse.json().then(data => {
                const cpPaymentBalance: number = data.JPY.total
                console.log(cpPaymentBalance)
            }).catch((e) => console.log("No Payment balance data"))
        } else if (apiResponse.ok) {
            console.log(`${defaultLogMessage}\n✅Line: ${rowIndex + 2} Succeeed`)
        }
    }
}