import { ColorScheme as CS } from '../../../fractals/color/types';

export const UPDATE_COLOR = 'COLOR_UPDATE';

export type ColorScheme = CS

export interface ColorState {
  schemeName: string
  scheme: ColorScheme
  mirror: boolean
  reverse: boolean
  skew: number
  count: number
}

export type UpdateColor = {
  type: typeof UPDATE_COLOR,
  payload: Partial<ColorState>,
}

export type ColorAction = UpdateColor