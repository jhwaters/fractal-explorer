import { COLORSCHEMES } from '../../../fractals/color';
import {
  ColorState,
  ColorAction,
  UPDATE_COLOR,
} from './types';
import { colorSchemeName } from '../../../defaults';

const initialState: ColorState = {
  schemeName: colorSchemeName,
  scheme: COLORSCHEMES[colorSchemeName],
  reverse: false,
  skew: 0,
}

export default function(state: ColorState=initialState, action: ColorAction) {
  switch(action.type) {
    case UPDATE_COLOR:
      return {...state, ...action.payload}
    default:
      return state;
  }
}