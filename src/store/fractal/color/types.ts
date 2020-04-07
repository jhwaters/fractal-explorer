import { ColorScheme as CS } from '../../../fractals/color/types';

export const UPDATE_COLOR = 'COLOR_UPDATE';

export type ColorScheme = CS

export interface ColorState {
  schemeName: string
  scheme: ColorScheme
  reverse: boolean
  skew: number
  count: 'iter' | number
}

export type UpdateColor = {
  type: typeof UPDATE_COLOR,
  payload: Partial<ColorState>,
}

export type ColorAction = UpdateColor