import { ColorScheme as CS } from '../../../fractals/color/types';

export const UPDATE = 'COLOR_UPDATE';

export type ColorScheme = CS

export type State = {
  schemeName: string
  scheme: ColorScheme
  reverse: boolean
  skew: number
}

export type Update = {
  type: typeof UPDATE,
  payload: Partial<State>,
}

export type Action = Update