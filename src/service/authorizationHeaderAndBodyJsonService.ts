// ================= 　Welcome　to customization!　⚠️ Scroll Down for customization　↓ ==============================================================================================================
import { config } from '../../resource/config.js'
import { sendJsonBodyRequest } from '../api/sendRequest.js'
import { ICsvRepository } from '../type/repository/ICsvRepository.js'
import { IPlaceHolderReplacer } from '../type/util/IPlaceHolderReplacer.js'
import { IBulkActionService } from '../type/service/IBulkActionService.js'
import { PlaceHolderReplacer } from '../util/placeHolderReplacer.js'
import { get_list_of_optional_csv_column_names } from '../util/getListOfOptionalCsvColumnNames.js'
import { CsvRepository } from '../repository/csvRepository.js'
import { JsonRepository } from '../repository/jsonRepository.js'


export class AuthorizationHeaderAndBodyJsonService implements IBulkActionService {
    private static accessToken: string
    private resource_csv_Repository: ICsvRepository
    private resource_request_body_json: Object

    private length_of_csv_rows: number
    private list_of_optional_csv_column_names: string[]

    public static setAccessToken(accessToken: string): AuthorizationHeaderAndBodyJsonService {
        if (!accessToken) throw new Error("❌Access token is not provided.")
        this.accessToken = accessToken
        return new AuthorizationHeaderAndBodyJsonService()
    }

    private constructor() {
        // Load the CSV and JSON resource files, using specified path.
        this.resource_csv_Repository = CsvRepository.useCsvFileOf(config.csv_file_path)

        this.resource_request_body_json = JsonRepository.useJsonFileOf(config.json_file_path).getJsonAll()

        //Prep for Iteration: Get all rows of the Base column specified in the globalConfig. 
        this.length_of_csv_rows = this.resource_csv_Repository.columnOf(config.base_csv_column_name).getLine().length
        // Prep for Iteration: Get all names of Optional columns specified in the globalConfig.
        this.list_of_optional_csv_column_names = get_list_of_optional_csv_column_names()
    }

    public async executeBulkAction(): Promise<void> {
        let failed_csv_lines: string[] = []
        let request_uri: string = config.request_uri
        let request_json_body: Object = this.resource_request_body_json
        // ~~~~~~~~~~~~~~~~~~ Useful Methods/Variables For Customization. ⚠️ Scroll Down for customization ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //   1. Get arbitrary data from your CSV file.
        //         e.g.
        //            this.resource_json_Repository.columnOf("Venue Address").getLine() // returns all data in the "Venue Address" column as an array
        //            this.resource_json_Repository.columnOf("Venue Address").rowOf(2).getValue()  // returns the value of the "Venue Address" column in the 2nd row
        //            this.resource_json_Repository.rowOf(2).columnOf("Venue Address").getValue() //  returns the value of the "Venue Address" column in the 2nd row


        //   2. Get all Data from your JSON file.
        //          e.g.
        //             console.log(this.resource_request_body_json) // returns all your JSON data as an Object


        //   3. Replace place specified values in the URI or JSON.
        //          e.g.
        //              PlaceHolderReplacer.for_placeHolder("[PLACE-HOLDER]").replaceWith("Tokyo").applyToUri("https://example.com/[PLACE-HOLDER]/example")         // returns "https://example.com/Tokyo/example"
        //              PlaceHolderReplacer.for_placeHolder("[PLACE-HOLDER]").replaceWith("Tokyo").applyToJson({ "location": "[PLACE-HOLDER}" })  ï


        // ✅ For further customization, you can also use the `CsvRepository` and `JsonRepository` as below to access your CSV and JSON data, respectively.

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // =============================================⚠️ WRITE YOUR CODE BELOW ⚠️=================================================================================================






        // <<<<<<<<<<< START REQUEST ITERATION, based on base CSV Column. <<<<<<<<<<<
        for (let i = 0; i < this.length_of_csv_rows; i++) {
            // >>>>>>>>>>>> LOGIC FOR EACH ROW BELOW >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>        





            // Replace the name of BASE column as placeholders in the request URI and JSON body with the value of the base column for the current row.
            //  e.g. base_column_name = "Venue ID" request_uri = "https://example.com/[Venue ID]/example" --replace--> https://example.com/12345/example.
            const row_of_base_column = this.resource_csv_Repository.columnOf(config.base_csv_column_name).rowOf(i).getCellValue()
            if (!row_of_base_column) throw Error(`❌ Line of [${i + 1}] doesnt exist or is empty. Please check your CSV file.`)
            const placeHolderReplacer: IPlaceHolderReplacer = PlaceHolderReplacer.for_placeHolder(`[${config.base_csv_column_name}]`).replaceWith(row_of_base_column)
            request_uri = placeHolderReplacer.applyToUri(config.request_uri)
            request_json_body = placeHolderReplacer.applyToJson(this.resource_request_body_json)





            // Replace the name of OPTIONAL columns as placeholders in the request URI and JSON body with the value of the optional column for the current row.
            //  e.g. optional_column_name = "Venue Address" request_uri = "https://example.com/[Venue Address]/example" --replace--> https://example.com/Tokyo/example.
            this.list_of_optional_csv_column_names.forEach(optional_csv_column_name => {
                const row_of_optional_column: string = this.resource_csv_Repository.columnOf(optional_csv_column_name).rowOf(i).getCellValue()
                if (!row_of_optional_column) throw Error(`❌ Column "${optional_csv_column_name}" in row ${i + 1} is empty or does not exist.`)
                const optionalPlaceHolderReplacer = PlaceHolderReplacer.for_placeHolder(`[${optional_csv_column_name}]`).replaceWith(row_of_optional_column)
                request_uri = optionalPlaceHolderReplacer.applyToUri(request_uri)
                request_json_body = optionalPlaceHolderReplacer.applyToJson(request_json_body)
            })






            console.log(`Sending request for row: ${row_of_base_column}`)
            console.log(`Request URI: ${request_uri}`)
            console.log(`Request Body: ${JSON.stringify(request_json_body, null, 2)}`)




            // Send request without waiting the result of previous request.
            if (config.async_process) {
                sendJsonBodyRequest({
                    URI: request_uri,
                    methodType: config.request_method,
                    securityHeaderName: config.security_header_name,
                    accessToken: AuthorizationHeaderAndBodyJsonService.accessToken,
                    bodyJson: request_json_body
                }).then(isSuccess => { if (isSuccess) { console.log(`✅ Successfully: [${row_of_base_column}]`) } else { console.warn(`❌ Failed: [${row_of_base_column}]`) } }
                )
                continue
            }





            // Send request and wait for the result of previous request.
            const isSuccess: boolean = await sendJsonBodyRequest({
                URI: request_uri,
                methodType: config.request_method,
                securityHeaderName: config.security_header_name,
                accessToken: AuthorizationHeaderAndBodyJsonService.accessToken,
                bodyJson: request_json_body
            })







            // ============================================⚠️ WRITE YOUR CODE ABOVE ⚠️=====================================================================================================
            //                                           Above codes are Default logic.
            // ===========================================================================================================================================================================
            if (isSuccess) { console.log(`✅ Successfully: [${row_of_base_column}]`) } else {
                failed_csv_lines.push(`${i + 1}\n`)
                console.warn(`❌ Failed: [${row_of_base_column}]`)
            }
        }
        console.log("=====🎉All REQUESTS WERE PROCESSED🎉=====")
        console.log(`Failed lines:\n ${failed_csv_lines}`)
    }
}