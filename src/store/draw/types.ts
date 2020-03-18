export const SET_DRAWING = 'SET_DRAWING'
export const SET_RECOLOR = 'SET_RECOLOR'

export type State = {
  drawing: boolean
  recolor: boolean
  fullResolution: boolean
}

export type SetDrawing = {
  type: typeof SET_DRAWING,
  payload: {
    drawing: boolean,
    fullResolution?: boolean,
  }
}

export type SetRecolor = {
  type: typeof SET_RECOLOR,
  payload: boolean
}

export type Action = SetDrawing | SetRecolor