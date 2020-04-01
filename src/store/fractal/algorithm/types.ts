import {
  FractalInterface,
} from '../../../fractals/algorithm/types';

export const UPDATE = 'ALGORITHM_UPDATE';
export const SET_FRACTAL = 'ALGORITHM_SET_FRACTAL';
export const UPDATE_PARAMS = 'ALGORITHM_UPDATE_PARAMS';

export type Method<T> = FractalInterface<T>

export interface State<T> {
  methodName: string
  method: Method<T>
  params: T
}

export type Update<T> = {
  type: typeof UPDATE
  payload: Partial<State<T>>
}

export type SetFractal<T> = {
  type: typeof SET_FRACTAL,
  payload: {
    methodName: string
    method: Method<T>
    params?: T
  }
}

export type UpdateParams<T> = {
  type: typeof UPDATE_PARAMS,
  payload: T
}

export type Action<T> = Update<T> | SetFractal<T> | UpdateParams<T>