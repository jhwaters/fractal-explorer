import {
  MethodName,
  MethodParams,
  SetMethod,
  Update,
  UPDATE,
  SET_METHOD,
} from './types';


export const setMethod = (method: MethodName): SetMethod => ({
  type: SET_METHOD,
  payload: method,
})

export const update = (
  method: MethodName,
  params: Partial<MethodParams>,
): Update => ({
  type: UPDATE,
  payload: {method, params}
})