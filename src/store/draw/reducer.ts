import {
  State,
  Action,
  SET_DRAWING,
  SET_RECOLOR,
} from './types';


const initialState = {
  drawing: false,
  recolor: false,
  fullResolution: false,
}

export default function(state: State=initialState, action: Action) {
  switch (action.type) {
    case SET_DRAWING:
      return {
        ...state,
        ...action.payload,
        recolor: false,
      }
    case SET_RECOLOR:
      return {...state, recolor: action.payload}
    default:
      return state;
  }
}