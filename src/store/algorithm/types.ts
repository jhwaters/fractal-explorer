import {
  FractalInterface,
  Params as FractalParams,
  ControlProps,
  ControlType
} from '../../fractals/types';

export type Fractal = FractalInterface<FractalParams>
export type Params = FractalParams

export const SET_FRACTAL = 'ALGORITHM_SET_FRACTAL';
export const UPDATE_PARAMS = 'ALGORITHM_UPDATE_PARAMS';


export type FractalList = {[k: string]: Fractal}

export type FractalKey = keyof FractalList

export type ParamControl = ControlProps

export { ControlType }

export interface State{
  current: FractalKey
  fractals: FractalList
  params: Params
  defaultParams: {bound: number, iterations: number}
  paramControls: ParamControl[]
}

export type SetFractal = {
  type: typeof SET_FRACTAL,
  payload: {current: FractalKey, params?: Params},
}

export type UpdateParams = {
  type: typeof UPDATE_PARAMS,
  payload: Params
}

export type Action = SetFractal | UpdateParams