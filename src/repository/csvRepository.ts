import { readFileContent } from '../util/fileReader.js'
import { ICsvTargetValueFetcher, ICsvRepository } from '../type/repository/ICsvRepository.js'

export class CsvRepository implements ICsvRepository {
    private static csvAllTargetDataMetrix: string[][] // [rows][columnss]
    private static columnNames: string[]

    private constructor() {
        if (!CsvRepository.csvAllTargetDataMetrix || !CsvRepository.columnNames) {
            throw new Error("❌CSV data is not loaded. Please call useCsvFileOf first.")
        }
    }

    public static useFileOf(csvPath: string): CsvRepository {
        if (!csvPath) throw new Error("❌CSV file path is not provided.")

        const csvRawData: string = readFileContent(csvPath).trim()

        // Convert the CSV raw data into a 2D array (matrix)
        const csvRawDataMetrix: string[][] = csvRawData.split('\n').map(line => line.split(',').map(cell => cell.trim()))

        // Extract the first row as column names and remove it from the data matrix
        this.columnNames = csvRawDataMetrix.shift() || []

        // Assign content Metrix after removing the Column name row
        this.csvAllTargetDataMetrix = csvRawDataMetrix

        if (this.csvAllTargetDataMetrix.length === 0) throw Error("❌The CSV file is empty or does not contain valid data.")
        if (this.columnNames.length === 0) throw Error("❌No column names found in the CSV file.")
        return new CsvRepository()
    }

    columnOf(columnName: string): CsvTargetValueFetcher {
        if (!columnName) throw Error("❌Column name is not provided.")

        // Get the Index of the target column name.
        const indexOftargetColumn: number = CsvRepository.columnNames.indexOf(columnName)
        // Get all data in the specified column
        const allRowsInTargetColumn: string[] = CsvRepository.csvAllTargetDataMetrix.map(row => row[indexOftargetColumn] || "")

        const expect_ColumnOf_asNext: boolean = false

        if (indexOftargetColumn < 0 || allRowsInTargetColumn.length <= 0) throw Error(`❌Column "${columnName}" not found in the CSV file.`)
        return new CsvTargetValueFetcher(allRowsInTargetColumn, expect_ColumnOf_asNext, CsvRepository.columnNames)
    }

    rowOf(LineIndex: number): CsvTargetValueFetcher {
        if (LineIndex < 0) throw Error("❌Line index cannot be negative.")
        // Get all data in the specified row
        const allColumnsInTargetRow: string[] = CsvRepository.csvAllTargetDataMetrix[LineIndex] || []
        // Prevent the next call to columnOf() method
        const expect_ColumnOf_asNext: boolean = true
        if (LineIndex < 0 || allColumnsInTargetRow.length <= 0) throw Error(`❌Row "${LineIndex}" not found in the CSV file.`)
        return new CsvTargetValueFetcher(allColumnsInTargetRow, expect_ColumnOf_asNext, CsvRepository.columnNames)
    }

    get_list_of_csv_column_names(): string[] {
        return CsvRepository.columnNames
    }
    get_length_of_csv(): number {
        return CsvRepository.csvAllTargetDataMetrix.length
    }
}


class CsvTargetValueFetcher implements ICsvTargetValueFetcher {
    private columnNames: string[]
    private targetRowsOrColumns: string[]
    private expect_ColumnOf_asNext: boolean
    private static targetCellValue: string

    constructor(targetRowsOrColumns: string[], expect_ColumnOf_asNext: boolean, columnNames: string[]) {
        this.targetRowsOrColumns = targetRowsOrColumns
        this.expect_ColumnOf_asNext = expect_ColumnOf_asNext
        this.columnNames = columnNames
    }


    // Need [Column Names], [target rows]
    columnOf(targetColumnName: string): this {
        if (!this.expect_ColumnOf_asNext) throw Error("❌You've already selected a column. Please use rowOf() for selecting a row.")
        if (!targetColumnName) throw Error("❌Column name is not provided.")

        // Get the Index of the target column name.
        const indexOftargetColumn: number = this.columnNames.indexOf(targetColumnName)

        // Return the value in the specified column at the given index
        const targetCellData: string = this.targetRowsOrColumns[indexOftargetColumn]?.trim() || ""

        // Check if the selected cell data is empty
        if (!targetCellData || indexOftargetColumn < 0) throw Error(`❌Column "${targetColumnName}" not found in the CSV file.`)
        CsvTargetValueFetcher.targetCellValue = targetCellData
        return this
    }

    // Need [target target colums]
    rowOf(indexOfTargetLine: number): this {
        if (this.expect_ColumnOf_asNext) throw Error("❌You've already selected a row. Please use columnOf() for selecting a column.")
        if (indexOfTargetLine < 0) throw Error("❌Row index cannot be negative.")

        const targetCellData = this.targetRowsOrColumns[indexOfTargetLine]?.trim() || ""

        // Check if the selected cell data is empty
        if (!targetCellData || indexOfTargetLine < 0) throw Error(`❌Row "${indexOfTargetLine}" not found in the CSV file.`)
        CsvTargetValueFetcher.targetCellValue = targetCellData
        return this
    }

    getCellValue(): string {
        if (!CsvTargetValueFetcher.targetCellValue) throw Error("❌No value has been selected. Please use columnOf() or rowOf() to select a value first.")
        // Return the value of the selected cell
        return CsvTargetValueFetcher.targetCellValue
    }

    getDataInLine(): string[] {
        if (CsvTargetValueFetcher.targetCellValue) throw Error("❌You have already selected a cell value. Please use columnOf() or rowOf() to select a value first.")
        // Return the entire row or column as an array
        return this.targetRowsOrColumns
    }
}