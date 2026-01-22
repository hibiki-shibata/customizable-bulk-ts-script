export interface ICsvRepository {
    columnOf(columnName: string): ICsvTargetSelector
    rowOf(indexOfLine: number): ICsvTargetSelector
}


// lineOf(<Line of row>).columnOf(<Column name>).getValue()


export interface ICsvTargetSelector {
    columnOf(columnName: string): ICsvTargetSelector
    rowOf(indexOfLine: number): ICsvTargetSelector
    getCellValue(): string
    getLine(): string[]
}