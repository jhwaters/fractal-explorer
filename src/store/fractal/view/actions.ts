import {
  ViewState,
  UpdateView,
  Recenter,
  Transform,
  ZoomIn,
  ZoomOut,
  UPDATE_VIEW,
  TRANSFORM,
  RECENTER,
  ZOOM_IN,
  ZOOM_OUT,
} from './types';


export const updateView = (update: Partial<ViewState>): UpdateView => ({
  type: UPDATE_VIEW,
  payload: update,
})

export const recenter = (): Recenter => ({
  type: RECENTER,
})

export const setCenter = (cx: number, cy: number): UpdateView => ({
  type: UPDATE_VIEW,
  payload: {cx, cy},
})

export const rotateDeg = (deg: number): Transform => {
  const rad = deg * Math.PI / 180;
  const co = Math.cos(rad);
  const si = Math.sin(rad);
  return ({
    type: TRANSFORM,
    payload: [co, -si, si, co],
  })
};

export const zoomIn = (factor: number): ZoomIn => ({
  type: ZOOM_IN,
  payload: factor,
})

export const zoomOut = (factor: number): ZoomOut => ({
  type: ZOOM_OUT,
  payload: factor,
})