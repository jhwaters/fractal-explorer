import {
  UPDATE,
  State,
  Update,
} from './types';


export const update = (color: Partial<State>): Update => ({
  type: UPDATE,
  payload: color,
})

