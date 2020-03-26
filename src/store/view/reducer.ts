import {
  State,
  Action,
  UPDATE,
  RECENTER,
  SET_CENTER,
  SET_DIMS,
  ZOOM_IN,
  ZOOM_OUT,
} from './types';

const initialState: State = {
  //cx: -1.74, cy: 0.04, ppu: 17000, // burning ship
  cx: 0, cy: 0, ppu: 512,
  w: 2560, h: 1600,
  previewPixels: 90000,
}

function recenter({w, h}: {w: number, h: number}) {
  return {cx: 0, cy: 0, ppu: Math.round(Math.min(h,w)/3)}
}

export default function(state: State={...initialState, ...recenter(initialState)}, action: Action) {
  switch(action.type) {
    case UPDATE:
      return {...state, ...action.payload}
    case RECENTER:
      return {...state, ...recenter(state)}
    case SET_CENTER:
      return {...state, cx: action.payload.cx, cy: action.payload.cy}
    case SET_DIMS:
      return {...state, w: action.payload.w, h: action.payload.h}
    case ZOOM_IN:
      return {...state, ppu: state.ppu * action.payload}
    case ZOOM_OUT:
      return {...state, ppu: Math.round(state.ppu / action.payload)}
    default:
      return state;
  }
}