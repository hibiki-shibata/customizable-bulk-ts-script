import { config } from '../../resource/config.js'
import { sendAPIRequest } from '../api/sendAPIRequest.js'
import { CsvRepository } from '../repository/csvRepository.js'
import { JsonRepository } from '../repository/jsonRepository.js'
import { ICsvRepository } from '../type/repository/ICsvRepository.js'
import { IBulkActionService } from '../type/service/IBulkAction.service.js'
import { readFileContent } from '../util/fileReader.js'
import { PlaceholderReplacer } from '../util/placeholderReplacer.js'
import { Logger, LogObj } from '../util/logger.js'

export class BulkActionService implements IBulkActionService {
    private readonly resource_csv_repository: ICsvRepository
    private readonly accessToken: string
    private readonly templaceRequestURI: string // = config.request_uri
    private readonly templateRequestBodyJson?: Object
    private readonly requestMethod: string
    private readonly securityHeaderName: string

    public constructor() {
        const resource_json_repository = config.json_file_name ? JsonRepository.useJsonFileOf(`./resource/http-request-body/${config.json_file_name}`) : undefined // Load JSON file if specified
        this.resource_csv_repository = CsvRepository.useFileOf(`./resource/${config.csv_file_name}`) // Load CSV file
        this.accessToken = readFileContent('./resource/access-token.txt')
        this.templaceRequestURI = config.request_uri
        this.templateRequestBodyJson = config.json_file_name ? resource_json_repository?.getJsonAll() : undefined
        this.requestMethod = config.request_method
        this.securityHeaderName = config.security_header_name
    }

    public async executeBulkAction(): Promise<void> {
        const failed_csv_lines: string[] = []
        const lengthOfCSV: number = this.resource_csv_repository.get_length_of_csv()
        let request_uri: string
        let json_request_body: Object | undefined
        for (let currentRow = 0; currentRow < lengthOfCSV; currentRow++) {
            const builtRequest = this.requestBuilder(this.templaceRequestURI, this.templateRequestBodyJson, currentRow)
            request_uri = builtRequest.builtURI
            json_request_body = builtRequest.builtBodyJson
            const res: Response = await sendAPIRequest({
                URI: request_uri,
                methodType: this.requestMethod,
                securityHeaderName: this.securityHeaderName,
                accessToken: this.accessToken,
                bodyJson: json_request_body
            })
            if (!res.ok) failed_csv_lines.push((currentRow + 2).toString()) // Recording failed lines

            await Logger.log({ rowIndex: currentRow, apiResponse: res, request_uri, json_request_body } as LogObj)


        }
        setTimeout(() => {
            console.log("=====🎉All REQUESTS WERE PROCESSED🎉=====\n" + `Failed lines:\n${failed_csv_lines ? failed_csv_lines : 'None'} `)
        }, 500)

    }

    private requestBuilder(templateURI: string, templateBodyJson: Object | undefined, csvRowIndex: number): { builtURI: string, builtBodyJson: Object | undefined } {
        let builtURI: string = templateURI
        let builtBodyJson: Object | undefined = templateBodyJson
        // Replace the name of columns as placeholders in the request URI and JSON body with the value of the optional column for the current row.
        //  e.g. column_name = "Venue Address" request_uri = "https://example.com/[Venue Address]/example" --replace--> https://example.com/Tokyo/example.
        this.resource_csv_repository.get_list_of_csv_column_names().forEach(csv_column_name => {
            const currentCellValue: string = this.resource_csv_repository.columnOf(csv_column_name).rowOf(csvRowIndex).getCellValue()
            if (!currentCellValue) throw Error(`❌ Column "${csv_column_name}" in row ${csvRowIndex + 1} is empty or does not exist.`)
            const placeholderReplacerForCurrentCell: PlaceholderReplacer = PlaceholderReplacer.placeholderIs(`[${csv_column_name}]`).replaceWith(currentCellValue)
            builtURI = placeholderReplacerForCurrentCell.applyTo(builtURI).toString()
            builtBodyJson = builtBodyJson ? placeholderReplacerForCurrentCell.applyTo(builtBodyJson) : undefined
        })
        return { builtURI, builtBodyJson }
    }
}