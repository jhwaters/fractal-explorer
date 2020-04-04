import {
  UPDATE_COLOR,
  ColorState,
  UpdateColor,
} from './types';


export const updateColor = (color: Partial<ColorState>): UpdateColor => ({
  type: UPDATE_COLOR,
  payload: color,
})

