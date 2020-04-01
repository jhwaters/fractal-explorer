import {
  Update,
  UPDATE,
  State,
  UpdateParams,
  UPDATE_PARAMS,
  SetAlgorithm,
  SET_ALGORITHM,
  Method,
} from './types';

export const update = <T>(f: Partial<State<T>>): Update<T> => ({
  type: UPDATE,
  payload: f
})

export const updateParams = <T>(params: T): UpdateParams<T> => ({
  type: UPDATE_PARAMS,
  payload: params
})

export const setAlgorithm = <T>(methodName: string, method: Method<T>, params?: T): SetAlgorithm<T> => ({
  type: SET_ALGORITHM,
  payload: {
    methodName,
    method,
    params
  }
})