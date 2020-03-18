import COLORSCHEMES from '../../fractal/color/schemes';
import {
  State,
  Action,
  UPDATE,
  ADD_SCHEME,
} from './types';

const initialState: State = {
  scheme: 'Rainbow',
  reverse: false,
  skew: 0,
  schemeList: Object.keys(COLORSCHEMES),
  customSchemes: {
    //Hello: ["#3db5ec", "#73c2b0", "#b9e375", "#f4bb44", "#eb591b"],
    'Ink': ['#000000', '#FFDD8C'],
  },
}

export default function(state: State=initialState, action: Action) {
  switch(action.type) {
    case UPDATE:
      return {...state, ...action.payload}
    case ADD_SCHEME:
      return {
        ...state,
        customSchemes: {
          ...state.customSchemes,
          [action.payload.name]: action.payload.colors,
        }
      }
    default:
      return state;
  }
}