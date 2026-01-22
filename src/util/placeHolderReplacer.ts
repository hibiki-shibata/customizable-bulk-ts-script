import { IPlaceHolderReplacer } from "../type/util/IPlaceHolderReplacer.js";



export class PlaceHolderReplacer implements IPlaceHolderReplacer {
    private placeholderName: string
    private newValue!: string;



    public static placeHolderIs(placeholder: string): PlaceHolderReplacer {
        if (!placeholder) throw new Error("❌Placeholder name is not provided.")
        return new PlaceHolderReplacer(placeholder)
    }


    public replaceWith(newValue: string): PlaceHolderReplacer {
        if (!newValue) throw new Error("❌Placeholder name is not set. Please call placeHolder first.")
        this.newValue = newValue
        return this
    }


    private constructor(placeholder: string) {
        this.placeholderName = placeholder
        if (!this.placeholderName) throw new Error("Placeholder name is not set. Please call placeHolder first.")
    }


    // Replace [PLACE_HOLDER] in the URI with the actual target value.
    applyToUri(request_uri_from_globalConfig: string): string {
        if (!this.newValue) throw new Error("❌Provide the replacing value first. Please call replaceWith first.")
        return request_uri_from_globalConfig.replaceAll(this.placeholderName, this.newValue)
    }


    // Replace [PLACE_HOLDER] in the JSON data with the actual target value.
    applyToJson(jsonData: Object): Object {
        if (!this.newValue) throw new Error("❌Provide the replacing value first. Please call replaceWith first.")
        return JSON.parse(JSON.stringify(jsonData).replaceAll(this.placeholderName, this.newValue))
    }

}