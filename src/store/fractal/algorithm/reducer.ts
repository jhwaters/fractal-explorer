import {
  State,
  Action,
  SET_FRACTAL,
  UPDATE,
  UPDATE_PARAMS,
} from './types';
import { method, methodName } from '../../../defaults';

const initialState = {
  methodName,
  method,
  params: method.newParams()
}

export default function<T>(state: State<any>=initialState, action: Action<T>) {
  switch (action.type) {
    case UPDATE:
      return {...state, ...action.payload}
    case SET_FRACTAL:
      return {
        methodName: action.payload.methodName,
        method: action.payload.method, 
        params: action.payload.params ? action.payload.params : action.payload.method.newParams(),
      } as State<T>
    case UPDATE_PARAMS:
      return {...state, params: {...state.params, ...action.payload}} as typeof state
    default:
      return state
  }
}