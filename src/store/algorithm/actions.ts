import {
  UpdateParams,
  UPDATE_PARAMS,
  SetFractal,
  SET_FRACTAL,
  Params,
  FractalKey,
} from './types';

export const updateParams = (params: Params): UpdateParams => ({
  type: UPDATE_PARAMS,
  payload: params
})

export const setFractal = (current: FractalKey, params?: Params): SetFractal => ({
  type: SET_FRACTAL,
  payload: {current, params}
})