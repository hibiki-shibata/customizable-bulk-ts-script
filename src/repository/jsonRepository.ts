import { getFileContent } from '../util/fileReader.js'
import { IJsonRepository } from '../type/repository/IJsonRepository.js'



export class JsonRepository implements IJsonRepository {
    private static JsonDataALl: Object

    public static useJsonFileOf(jsonPath: string): JsonRepository {
        if (!jsonPath) throw new Error("❌JSON file path is not provided.")

        const JsonDataAllInString: string = getFileContent(jsonPath)
        this.JsonDataALl = JSON.parse(JsonDataAllInString.trim())

        if (!this.JsonDataALl) throw Error("The JSON file is empty or does not contain valid data.")
        return new JsonRepository()
    }

    private constructor() {
        if (!JsonRepository.JsonDataALl) throw new Error("JSON data is not loaded. Please call getInstanceAndLoadJsonFrom first.")
    }

    public getJsonAll(): Object {
        return JsonRepository.JsonDataALl
    }

}