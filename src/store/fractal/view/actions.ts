import {
  State,
  Update,
  Recenter,
  ZoomIn,
  ZoomOut,
  UPDATE,
  RECENTER,
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

export const setCenter = (cx: number, cy: number): Update => ({
  type: UPDATE,
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