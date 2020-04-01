export type State = {
  cx: number
  cy: number
  w: number
  h: number
  ppu: number // units per pixel
  pixelCount: number
}

export const UPDATE = 'VIEW_UPDATE';
export const ZOOM_IN = 'VIEW_ZOOM_IN';
export const ZOOM_OUT = 'VIEW_ZOOM_OUT';
export const RECENTER = 'VIEW_RECENTER';

export type Update = {
  type: typeof UPDATE,
  payload: Partial<State>,
}

export type Recenter = {
  type: typeof RECENTER,
}

export type ZoomIn = {
  type: typeof ZOOM_IN,
  payload: number,
}

export type ZoomOut = {
  type: typeof ZOOM_OUT,
  payload: number,
}

export type Action = Update | ZoomIn | ZoomOut | Recenter;