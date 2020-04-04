import {
  UIState,
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
  AddColorScheme,
  ADD_COLOR_SCHEME,
  ColorScheme,
  UpdateUI,
  UPDATE_UI,
} from './types'

export const update = (x: Partial<UIState>): UpdateUI => ({
  type: UPDATE_UI,
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

export const redraw = (): SetCanvasAction => ({
  type: SET_CANVAS_ACTION,
  payload: CanvasAction.Draw
})

export const recolor = (): SetCanvasAction => ({
  type: SET_CANVAS_ACTION,
  payload: CanvasAction.Color
})

export const capture = (): SetCanvasAction => ({
  type: SET_CANVAS_ACTION,
  payload: CanvasAction.Capture
})

export const wait = (): UpdateUI => ({
  type: UPDATE_UI,
  payload: ({waiting: true}),
})

export const finish = (): UpdateUI => ({
  type: UPDATE_UI,
  payload: {
    canvasAction: CanvasAction.None,
    waiting: false,
  }
})

export const addColorScheme = (name: string, scheme: ColorScheme): AddColorScheme => ({
  type: ADD_COLOR_SCHEME,
  payload: {name, scheme}
})




