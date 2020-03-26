import {
  State,
  Action,
  Nav,
  Modal,
  CanvasAction,
  StretchMode,
  SET_NAV,
  SET_MODAL,
  SET_STRETCH,
  SET_CANVAS_ACTION,
  UPDATE,
} from './types';


const initialState = {
  canvasStretch: StretchMode.Contain,
  modal: Modal.None,
  nav: Nav.Navigate,
  canvasAction: CanvasAction.None,
}

export default function(state: State=initialState, action: Action) {
  switch(action.type) {
    case UPDATE:
      return {...state, ...action.payload}
    case SET_NAV:
      return {...state, nav: action.payload}
    case SET_MODAL:
      return {...state, modal: action.payload}
    case SET_STRETCH:
      return {...state, canvasStretch: action.payload}
    case SET_CANVAS_ACTION:
      return {...state, canvasAction: action.payload}
    default:
      return state
  }
}