export type ColorScheme = ((n: number) => string) | string[]

export interface Color {
  scheme: ColorScheme
  reverse: boolean
  skew: number
}