export const SET_MODAL = 'UI_SET_MODAL'
export const SET_NAV = 'UI_SET_NAV'
export const SET_STRETCH = 'UI_SET_STRETCH'
export const SET_CANVAS_ACTION = 'UI_SET_ACTION'
export const UPDATE = 'UI_UPDATE'



export enum Nav {
  None,
  Params,
  Navigate,
  Help,
}

export enum Modal {
  None,
  Menu,
  Info,
  FullResolution,
}

export enum StretchMode {
  None,
  Contain,
  Cover,
}

export enum CanvasAction {
  None,
  Draw,
  DrawFullResolution,
  Color,
  Iterate,
}

export type ParamControl = {
  label: string
  param: string
}

export interface State {
  canvasStretch: StretchMode
  nav: Nav
  modal: Modal
  canvasAction: CanvasAction
}

export type Update = {
  type: typeof UPDATE
  payload: Partial<State>
}

export type SetModal = {
  type: typeof SET_MODAL
  payload: Modal
}

export type SetNav = {
  type: typeof SET_NAV
  payload: Nav
}

export type SetStretch = {
  type: typeof SET_STRETCH
  payload: StretchMode
}

export type SetCanvasAction = {
  type: typeof SET_CANVAS_ACTION
  payload: CanvasAction
}

export type Action = Update | SetModal | SetNav | SetStretch | SetCanvasAction