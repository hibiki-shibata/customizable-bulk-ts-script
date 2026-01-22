export interface IPlaceHolderReplacer {
  replaceWith(newValue: string): IPlaceHolderReplacer
  applyToUri(uri: string): string
  applyToJson(jsonData: Object): Object
}