import { COLORSCHEMES } from '../../../fractals/color';
import {
  State,
  Action,
  UPDATE,
} from './types';
import { colorSchemeName } from '../../../defaults';

const initialState: State = {
  schemeName: colorSchemeName,
  scheme: COLORSCHEMES[colorSchemeName],
  reverse: false,
  skew: 0,
}

export default function(state: State=initialState, action: Action) {
  switch(action.type) {
    case UPDATE:
      return {...state, ...action.payload}
    default:
      return state;
  }
}