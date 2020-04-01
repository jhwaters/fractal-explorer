import {
  State,
  Action,
  ADD_TO_GALLERY,
  DELETE_IMAGE,
} from './types'

const initialState: State = [];

export default function(state: State=initialState, action: Action) {
  switch(action.type) {
    case ADD_TO_GALLERY:
      return [...state, action.payload];
    case DELETE_IMAGE:
      URL.revokeObjectURL(action.payload)
      return state.filter(v => v.url !== action.payload);
    default:
      return state
  }
}