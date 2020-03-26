import {
  State,
  SetStretch,
  StretchMode,
  SET_STRETCH,
  SetModal,
  SET_MODAL,
  SetNav,
  SET_NAV,
  Modal,
  Nav,
  CanvasAction,
  SetCanvasAction,
  SET_CANVAS_ACTION,
  Update,
  UPDATE,
} from './types'

export const update = (x: Partial<State>): Update => ({
  type: UPDATE,
  payload: x
})

export const setStretch = (stretch: StretchMode): SetStretch => ({
  type: SET_STRETCH,
  payload: stretch
})

export const setModal = (modal: Modal): SetModal => ({
  type: SET_MODAL,
  payload: modal
})

export const setNav = (nav: Nav): SetNav => ({
  type: SET_NAV,
  payload: nav
})

export const setCanvasAction = (x: CanvasAction): SetCanvasAction => ({
  type: SET_CANVAS_ACTION,
  payload: x,
})

export const startDrawing = (fullResolution: boolean=false): SetCanvasAction => {
  if (fullResolution) {
    return ({
      type: SET_CANVAS_ACTION,
      payload: CanvasAction.DrawFullResolution
    })
  } else {
    return ({
      type: SET_CANVAS_ACTION,
      payload: CanvasAction.Draw
    })
  }
}

export const startIterating = (): SetCanvasAction => ({
  type: SET_CANVAS_ACTION,
  payload: CanvasAction.Iterate,
})

export const startColoring = (): SetCanvasAction => ({
  type: SET_CANVAS_ACTION,
  payload: CanvasAction.Color
})
