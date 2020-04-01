import {
  Update,
  UPDATE,
  State,
  UpdateParams,
  UPDATE_PARAMS,
  SetFractal,
  SET_FRACTAL,
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

export const setFractal = <T>(methodName: string, method: Method<T>, params?: T): SetFractal<T> => ({
  type: SET_FRACTAL,
  payload: {
    methodName,
    method,
    params
  }
})