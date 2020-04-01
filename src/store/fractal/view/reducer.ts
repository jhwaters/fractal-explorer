import {
  State,
  Action,
  UPDATE,
  RECENTER,
  ZOOM_IN,
  ZOOM_OUT,
} from './types';
import { pixelCount, canvasSize } from '../../../defaults';

const initialState: State = {
  ...canvasSize,
  cx: 0, 
  cy: 0,
  ppu: 256,
  pixelCount,
}

function recenter({w, h}: {w: number, h: number}) {
  return {cx: 0, cy: 0, ppu: Math.round(Math.min(h,w)/5)}
}

export default function(state: State={...initialState, ...recenter(initialState)}, action: Action) {
  switch(action.type) {
    case UPDATE:
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