import {
  ViewState,
  UpdateView,
  Recenter,
  ZoomIn,
  ZoomOut,
  UPDATE_VIEW,
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

export const zoomIn = (factor: number): ZoomIn => ({
  type: ZOOM_IN,
  payload: factor,
})

export const zoomOut = (factor: number): ZoomOut => ({
  type: ZOOM_OUT,
  payload: factor,
})