export interface IPlaceHolderReplacer {
  applyToUri(uri: string): string
  applyToJson(jsonData: Object): Object
}