export interface ICsvRepository {
    columnOf(columnName: string): ICsvTargetValueFetcher
    rowOf(indexOfLine: number): ICsvTargetValueFetcher
    get_list_of_csv_column_names(): string[]
    get_length_of_csv(): number
}

export interface ICsvTargetValueFetcher {
    columnOf(columnName: string): ICsvTargetValueFetcher
    rowOf(indexOfLine: number): ICsvTargetValueFetcher
    getCellValue(): string
    getDataInLine(): string[]
}