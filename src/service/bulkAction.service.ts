import { config } from '../../resource/config.js'
import { sendAPIRequest } from '../api/sendAPIRequest.js'
import { CsvRepository } from '../repository/csvRepository.js'
import { JsonRepository } from '../repository/jsonRepository.js'
import { ICsvRepository } from '../type/repository/ICsvRepository.js'
import { IJsonRepository } from '../type/repository/IJsonRepository.js'
import { get_list_of_csv_column_names } from '../util/getListOfCsvColumnNames.js'
import { getFileContent } from '../util/fileReader.js'
import { PlaceHolderReplacer } from '../util/placeHolderReplacer.js'

export class BulkActionService {
    private readonly accessToken: string
    private readonly resource_csv_repository: ICsvRepository
    private readonly resource_json_repository?: IJsonRepository

    public constructor() {
        this.accessToken = getFileContent('./resource/access-token.txt');
        this.resource_csv_repository = CsvRepository.useCsvFileOf(`./resource/${config.csv_file_name}`) // Load CSV file
        this.resource_json_repository = config.json_file_name ? JsonRepository.useJsonFileOf(`./resource/${config.json_file_name}`) : undefined // Load JSON file if specified
    }

    public async executeBulkAction(): Promise<void> {
        const failed_csv_lines: string[] = []
        let request_uri: string = config.request_uri
        let json_request_body = this.resource_json_repository?.getJsonAll()
        const lengthOfCSV: number = this.resource_csv_repository.columnOf(config.csv_column_name_1).getLine().length

        for (let i = 0; i < lengthOfCSV; i++) {
            // Replace the name of columns as placeholders in the request URI and JSON body with the value of the optional column for the current row.
            //  e.g. column_name = "Venue Address" request_uri = "https://example.com/[Venue Address]/example" --replace--> https://example.com/Tokyo/example.
            get_list_of_csv_column_names().forEach(csv_column_name => {
                const placeHolderReplacer = this.placeHolderReplacerForColumnInRow(i, csv_column_name)
                request_uri = placeHolderReplacer.applyToUri(request_uri)
                json_request_body = json_request_body ? placeHolderReplacer.applyToJson(json_request_body) : undefined
            })

            const res: Response = await sendAPIRequest({
                URI: request_uri,
                methodType: config.request_method,
                securityHeaderName: config.security_header_name,
                accessToken: this.accessToken,
                bodyJson: json_request_body
            })

            // Logging failed lines
            if (!res.ok) failed_csv_lines.push((i + 1).toString())
            this.traceLogger(i, request_uri, res, json_request_body)
        }
        console.log("=====🎉All REQUESTS WERE PROCESSED🎉=====\n" + `Failed lines:\n${failed_csv_lines ? failed_csv_lines : 'None'} `)
    }

    private placeHolderReplacerForColumnInRow(rowIndex: number, columnName: string): PlaceHolderReplacer {
        const cellValue: string = this.resource_csv_repository.columnOf(columnName).rowOf(rowIndex).getCellValue()
        if (!cellValue) throw Error(`❌ Column "${columnName}" in row ${rowIndex + 1} is empty or does not exist.`)
        return PlaceHolderReplacer.placeHolderIs(`[${columnName}]`).replaceWith(cellValue)
    }

    private async traceLogger(rowIndex: number, request_uri: string, apiResponse: Response, json_request_body?: Object): Promise<void> {
        console.log(`Sending request for CSV row ${rowIndex + 1}...\nReq URI: ${request_uri}\nReq Body: ${JSON.stringify(json_request_body, null, 2)}`)
        if (!apiResponse.ok) {
            console.warn(`❌Line ${rowIndex + 1} failed: ${apiResponse.status} ${apiResponse.statusText}`)
        } else if (config.getVenueIDList) {
            const venueID = await apiResponse.json().then(data => data.results[0].id.$oid).catch(() => console.log("❌Failed to retrieve Venue ID from succeeded response."))
            console.log(venueID)
        } else {
            console.log(`✅ Line ${rowIndex + 1} Succeeed`)
        }
    }
}