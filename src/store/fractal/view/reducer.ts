import {
  ViewState,
  ViewAction,
  UPDATE_VIEW,
  RECENTER,
  ZOOM_IN,
  ZOOM_OUT,
} from './types';
import { pixelCount, canvasSize } from '../../../defaults';

const initialState: ViewState = {
  ...canvasSize,
  cx: 0, 
  cy: 0,
  ppu: 256,
  pixelCount,
}

function recenter({w, h}: {w: number, h: number}) {
  return {cx: 0, cy: 0, ppu: Math.round(Math.min(h,w)/5)}
}

export default function(state: ViewState={...initialState, ...recenter(initialState)}, action: ViewAction) {
  switch(action.type) {
    case UPDATE_VIEW:
      return {...state, ...action.payload}
    case RECENTER:
      return {...state, ...recenter(state)}
    case ZOOM_IN:
      return {...state, ppu: state.ppu * action.payload}
    case ZOOM_OUT:
      return {...state, ppu: Math.round(state.ppu / action.payload)}
    default:
      return state;
  }
}