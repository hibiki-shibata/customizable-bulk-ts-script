export interface IPlaceholderReplacer {
  replaceWith(newValue: string): this
  applyTo(dataToBeReplaced: string | Object): string | Object
}