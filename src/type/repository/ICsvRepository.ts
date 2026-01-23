export interface ICsvRepository {
    columnOf(columnName: string): ICsvTargetValueFetcher
    rowOf(indexOfLine: number): ICsvTargetValueFetcher
    get_list_of_csv_column_names(): string[]
}

export interface ICsvTargetValueFetcher {
    columnOf(columnName: string): ICsvTargetValueFetcher
    rowOf(indexOfLine: number): ICsvTargetValueFetcher
    getCellValue(): string
    getLine(): string[]
}