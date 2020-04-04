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
  AddColorScheme,
  ADD_COLOR_SCHEME,
  ColorScheme,
  UpdateUI,
  UPDATE_UI,
} from './types'

export const updateUI = (x: Partial<UIState>): UpdateUI => ({
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

export const startWaiting = (): UpdateUI => ({
  type: UPDATE_UI,
  payload: {waiting: true},
})

export const stopWaiting = (): UpdateUI => ({
  type: UPDATE_UI,
  payload: {waiting: false}
})

export const addColorScheme = (name: string, scheme: ColorScheme): AddColorScheme => ({
  type: ADD_COLOR_SCHEME,
  payload: {name, scheme}
})




