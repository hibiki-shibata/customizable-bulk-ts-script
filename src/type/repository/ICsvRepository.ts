export interface ICsvRepository {
    columnOf(columnName: string): ICsvTargetSelector
    rowOf(indexOfLine: number): ICsvTargetSelector
}

export interface ICsvTargetSelector {
    columnOf(columnName: string): ICsvTargetSelector
    rowOf(indexOfLine: number): ICsvTargetSelector
    getCellValue(): string
    getLine(): string[]
}