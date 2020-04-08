import {
  ViewState,
  ViewAction,
  UPDATE_VIEW,
  RECENTER,
  TRANSFORM,
  ZOOM_IN,
  ZOOM_OUT,
} from './types';
import { pixelCount, canvasSize } from '../../../defaults';
import { multiply } from '../../../fractals/drawer/transform';

const initialState: ViewState = {
  ...canvasSize,
  cx: 0, 
  cy: 0,
  ppu: 256,
  pixelCount,
  t: [1, 0, 0, -1],
}

export function recenterPPU({w, h}: {w: number, h: number}) {
  return Math.round(Math.min(h,w)/5);
}

export default function(state: ViewState={...initialState, ppu: recenterPPU(initialState)}, action: ViewAction) {
  switch(action.type) {
    case UPDATE_VIEW:
      return {...state, ...action.payload};
    case RECENTER:
      return {...state, cx: 0, cy: 0, t: [1,0,0,-1], ppu: recenterPPU(state)} as ViewState
    case TRANSFORM:
      return {...state, t: multiply(action.payload, state.t)};
    case ZOOM_IN:
      return {...state, ppu: state.ppu * action.payload};
    case ZOOM_OUT:
      return {...state, ppu: Math.round(state.ppu / action.payload)};
    default:
      return state;
  }
}