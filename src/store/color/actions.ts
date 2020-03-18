import {
  UPDATE,
  ADD_SCHEME,
  State,
  Update,
  AddScheme,
} from './types';


export const update = (color: Partial<State>): Update => ({
  type: UPDATE,
  payload: color,
})

export const addScheme = (name: string, colors: string[]): AddScheme => ({
  type: ADD_SCHEME,
  payload: {name, colors}
})
