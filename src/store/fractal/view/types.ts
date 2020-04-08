export interface ViewState {
  cx: number
  cy: number
  w: number
  h: number
  ppu: number // units per pixel
  pixelCount: number
  t: [number,number,number,number] // transform matrix [a, b, c, d]
}

export const UPDATE_VIEW = 'VIEW_UPDATE';
export const ZOOM_IN = 'VIEW_ZOOM_IN';
export const ZOOM_OUT = 'VIEW_ZOOM_OUT';
export const RECENTER = 'VIEW_RECENTER';
export const TRANSFORM = 'VIEW_TRANSFORM';

export type UpdateView = {
  type: typeof UPDATE_VIEW,
  payload: Partial<ViewState>,
}

export type Recenter = {
  type: typeof RECENTER,
}

export type Transform = {
  type: typeof TRANSFORM,
  payload: [number, number, number, number]
}

export type ZoomIn = {
  type: typeof ZOOM_IN,
  payload: number,
}

export type ZoomOut = {
  type: typeof ZOOM_OUT,
  payload: number,
}

export type ViewAction = UpdateView | ZoomIn | ZoomOut | Recenter | Transform;