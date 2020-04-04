import { ALLFRACTALS, COLORSCHEMES } from '../../fractals';
import { ColorScheme as CS } from '../../fractals/color/types';

export type ColorScheme = CS

export const SET_MODAL = 'UI_SET_MODAL'
export const SET_NAV = 'UI_SET_NAV'
export const SET_STRETCH = 'UI_SET_STRETCH'
export const UPDATE_UI = 'UI_UPDATE'
export const ADD_COLOR_SCHEME = 'UI_ADD_COLOR_SCHEME'

export enum Nav {
  Params,
  Explore,
  Capture,
  Gallery,
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

export interface UIState {
  nav: Nav
  modal: Modal
  canvasStretch: StretchMode
  galleryBadge: number
  methodList: typeof ALLFRACTALS
  colorSchemeList: typeof COLORSCHEMES
  waiting: boolean
}

export type UpdateUI = {
  type: typeof UPDATE_UI
  payload: Partial<UIState>
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

export type AddColorScheme = {
  type: typeof ADD_COLOR_SCHEME
  payload: {
    name: string
    scheme: ColorScheme
  }
}

export type UIAction = UpdateUI | SetModal | SetNav | SetStretch | AddColorScheme