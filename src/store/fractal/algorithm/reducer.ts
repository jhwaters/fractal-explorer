import {
  AlgorithmState,
  AlgorithmAction,
  SET_ALGORITHM,
  UPDATE_ALGORITHM,
  UPDATE_PARAMS,
} from './types';
import { method, methodName } from '../../../defaults';

const initialState = {
  methodName,
  method,
  params: method.newParams()
}

export default function<T>(state: AlgorithmState<any>=initialState, action: AlgorithmAction<T>) {
  switch (action.type) {
    case UPDATE_ALGORITHM:
      return {...state, ...action.payload}
    case SET_ALGORITHM:
      return {
        methodName: action.payload.methodName,
        method: action.payload.method, 
        params: action.payload.params ? action.payload.params : action.payload.method.newParams(),
      } as AlgorithmState<T>
    case UPDATE_PARAMS:
      return {...state, params: {...state.params, ...action.payload}} as typeof state
    default:
      return state
  }
}