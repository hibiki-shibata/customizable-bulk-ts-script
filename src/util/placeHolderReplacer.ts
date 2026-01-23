import { IPlaceholderReplacer } from "../type/util/IPlaceholderReplacer.js";

export class PlaceholderReplacer implements IPlaceholderReplacer {
    private static newValueToReplace: string
    private placeholderName: string

    public static placeholderIs(placeholder: string): PlaceholderReplacer {
        if (!placeholder) throw new Error("❌Placeholder name is not provided.")
        return new PlaceholderReplacer(placeholder)
    }

    public replaceWith(newValue: string): this {
        if (!newValue) throw new Error("❌New value to replace is not provided.")
        PlaceholderReplacer.newValueToReplace = newValue
        return this
    }

    private constructor(placeholder: string) {
        if (!placeholder) throw new Error("❌Placeholder name is not provided.")
        this.placeholderName = placeholder
    }

    public applyTo(dataToBeReplaced: string | Object): string | Object {
        if (!PlaceholderReplacer.newValueToReplace) throw new Error("❌Provide the replacing value first. Please call replaceWith first.")
        switch (typeof dataToBeReplaced) {
            case "string":
                return dataToBeReplaced.replaceAll(this.placeholderName, PlaceholderReplacer.newValueToReplace)
            case "object":
                return JSON.parse(JSON.stringify(dataToBeReplaced).replaceAll(this.placeholderName, PlaceholderReplacer.newValueToReplace))
            default:
                throw new Error("❌Unsupported data type for replacement. Only string and Object are supported.")
        }
    }

}