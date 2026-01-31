import { config } from "../../resource/config.js"

export class Logger {
    public static async log(rowIndex: number, apiResponse: Response, request_uri: string, json_request_body?: Object): Promise<void> {
        const defaultLogMessage = `Sent request of CSV row: ${rowIndex + 1}...\nReq URI: ${request_uri}\nReq Body: ${JSON.stringify(json_request_body, null, 2)}`
        if (!apiResponse.ok) return console.warn(`${defaultLogMessage}\n❌Line ${rowIndex + 1} failed: ${apiResponse.status} ${apiResponse.statusText}`)

        if (config.showOnlyVenueID) {
            apiResponse.json().then(data => {
                const venueID: string = data.results[0].id.$oid
                console.log(venueID)
            }).catch(() => console.log("🚨Failed to retrieve Venue ID from succeeded response."))
        } else {
            console.log(`${defaultLogMessage}\n✅Line: ${rowIndex + 1} Succeeed`)
        }
    }
}