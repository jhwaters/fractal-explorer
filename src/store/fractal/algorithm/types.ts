import {
  FractalInterface,
} from '../../../fractals/algorithm/types';

export const UPDATE_ALGORITHM = 'ALGORITHM_UPDATE';
export const SET_ALGORITHM = 'ALGORITHM_SET';
export const UPDATE_PARAMS = 'ALGORITHM_UPDATE_PARAMS';

export type Method<T> = FractalInterface<T>

export interface AlgorithmState<T> {
  methodName: string
  method: Method<T>
  params: T
}

export type UpdateAlgorithm<T> = {
  type: typeof UPDATE_ALGORITHM
  payload: Partial<AlgorithmState<T>>
}

export type SetAlgorithm<T> = {
  type: typeof SET_ALGORITHM,
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

export type AlgorithmAction<T> = UpdateAlgorithm<T> | SetAlgorithm<T> | UpdateParams<T>