import { config } from '../../resource/config.js'
import { sendAPIRequest } from '../api/sendAPIRequest.js'
import { CsvRepository } from '../repository/csvRepository.js'
import { JsonRepository } from '../repository/jsonRepository.js'
import { ICsvRepository } from '../type/repository/ICsvRepository.js'
import { IJsonRepository } from '../type/repository/IJsonRepository.js'
import { IBulkActionService } from '../type/service/IBulkAction.service.js'
import { readFileContent } from '../util/fileReader.js'
import { PlaceholderReplacer } from '../util/placeholderReplacer.js'
import { Logger } from '../util/logger.js'

export class BulkActionService implements IBulkActionService {
    private readonly accessToken: string
    private readonly resource_csv_repository: ICsvRepository
    private readonly resource_json_repository?: IJsonRepository

    public constructor() {
        this.accessToken = readFileContent('./resource/access-token.txt')
        this.resource_csv_repository = CsvRepository.useFileOf(`./resource/${config.csv_file_name}`) // Load CSV file
        this.resource_json_repository = config.json_file_name ? JsonRepository.useJsonFileOf(`./resource/${config.json_file_name}`) : undefined // Load JSON file if specified
    }

    public async executeBulkAction(): Promise<void> {
        const failed_csv_lines: string[] = []
        const lengthOfCSV: number = this.resource_csv_repository.columnOf(config.csv_column_name_1).getLine().length

        for (let currentRow = 0; currentRow < lengthOfCSV; currentRow++) {
            let request_uri: string = config.request_uri
            let json_request_body: Object | undefined = this.resource_json_repository?.getJsonAll()
            // Replace the name of columns as placeholders in the request URI and JSON body with the value of the optional column for the current row.
            //  e.g. column_name = "Venue Address" request_uri = "https://example.com/[Venue Address]/example" --replace--> https://example.com/Tokyo/example.
            this.resource_csv_repository.get_list_of_csv_column_names().forEach(csv_column_name => {
                const currentCellValue: string = this.resource_csv_repository.columnOf(csv_column_name).rowOf(currentRow).getCellValue()
                if (!currentCellValue) throw Error(`❌ Column "${csv_column_name}" in row ${currentRow + 1} is empty or does not exist.`)
                const placeholderReplacerForCurrentCell: PlaceholderReplacer = PlaceholderReplacer.placeholderIs(`[${csv_column_name}]`).replaceWith(currentCellValue)

                request_uri = placeholderReplacerForCurrentCell.applyTo(request_uri).toString()
                json_request_body = json_request_body ? placeholderReplacerForCurrentCell.applyTo(json_request_body) : undefined
            })

            const res: Response = await sendAPIRequest({
                URI: request_uri,
                methodType: config.request_method,
                securityHeaderName: config.security_header_name,
                accessToken: this.accessToken,
                bodyJson: json_request_body
            })

            // Logging failed lines
            if (!res.ok) failed_csv_lines.push((currentRow + 1).toString())
            Logger.log(currentRow, res, request_uri, json_request_body)
        }
        console.log("=====🎉All REQUESTS WERE PROCESSED🎉=====\n" + `Failed lines:\n${failed_csv_lines ? failed_csv_lines : 'None'} `)
    }
}