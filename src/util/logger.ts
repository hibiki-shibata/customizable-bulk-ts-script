import { config } from "../../resource/config.js"

export class Logger {
    public static async log(rowIndex: number, apiResponse: Response, request_uri: string, json_request_body?: Object): Promise<void> {
        const defaultLogMessage = `Sent request of CSV row: ${rowIndex + 2}...\nReq URI: ${request_uri}\nReq Body: ${JSON.stringify(json_request_body, null, 2)}`
        if (!apiResponse.ok) return console.log(`❌Line ${rowIndex + 2} failed: ${apiResponse.status} ${apiResponse.statusText}`)

        if (config.showVenueID) {
            apiResponse.json().then(data => {
                const venueID: string = data.results[0].id.$oid
                console.log(venueID)
            }).catch(() => console.log("🚨Failed to retrieve Venue ID from success response."))
        } else if (config.showCpPaymentBalance) {
            apiResponse.json().then(data => {
                const cpPaymentBalance: number = data.JPY.total
                console.log(cpPaymentBalance)

            }).catch(() => console.log("No Payment balance data"))
        } else {
            console.log(`${defaultLogMessage}\n✅Line: ${rowIndex + 2} Succeeed`)
        }
    }
}