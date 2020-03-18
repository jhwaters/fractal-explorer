import {
  State,
  Update,
  Recenter,
  SetCenter,
  SetDims,
  ZoomIn,
  ZoomOut,
  UPDATE,
  RECENTER,
  SET_CENTER,
  SET_DIMS,
  ZOOM_IN,
  ZOOM_OUT,
} from './types';


export const update = (update: Partial<State>): Update => ({
  type: UPDATE,
  payload: update,
})

export const recenter = (): Recenter => ({
  type: RECENTER,
})

export const setCenter = (cx: number, cy: number): SetCenter => ({
  type: SET_CENTER,
  payload: {cx, cy},
})

export const setDims = (w: number, h: number): SetDims => ({
  type: SET_DIMS,
  payload: {w, h}
})

export const zoomIn = (factor: number): ZoomIn => ({
  type: ZOOM_IN,
  payload: factor,
})

export const zoomOut = (factor: number): ZoomOut => ({
  type: ZOOM_OUT,
  payload: factor,
})