//import Big from 'big.js';

export type State = {
  [k: string]: number | boolean
  cx: number
  cy: number
  w: number
  h: number
  ppu: number // pixels per unit
  previewPixels: number
  stretch: boolean
}

export const UPDATE = 'VIEW_UPDATE';
export const ZOOM_IN = 'VIEW_ZOOM_IN';
export const ZOOM_OUT = 'VIEW_ZOOM_OUT';
export const RECENTER = 'VIEW_RECENTER';
export const SET_DIMS = 'VIEW_SET_DIMS';
export const SET_CENTER = 'VIEW_SET_CENTER';

export type Update = {
  type: typeof UPDATE,
  payload: Partial<State>,
}

export type Recenter = {
  type: typeof RECENTER,
}

export type SetDims = {
  type: typeof SET_DIMS,
  payload: {w: number, h: number},
}

export type SetCenter = {
  type: typeof SET_CENTER,
  payload: {cx: number, cy: number},
}

export type ZoomIn = {
  type: typeof ZOOM_IN,
  payload: number,
}

export type ZoomOut = {
  type: typeof ZOOM_OUT,
  payload: number,
}

export type Action = Update | ZoomIn | ZoomOut | Recenter | SetDims | SetCenter;