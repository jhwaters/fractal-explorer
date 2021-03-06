import {
  UIState,
  Nav,
  Modal,
  StretchMode,
  SET_NAV,
  SET_MODAL,
  SET_STRETCH,
  UPDATE_UI,
  ADD_COLOR_SCHEME,
} from './types';
import { Action } from '../types';
import { ADD_TO_GALLERY } from '../gallery/types';
import { ALLFRACTALS } from '../../fractals/algorithm';
import { COLORSCHEMES } from '../../fractals/color';
import { UPDATE_FRACTAL } from '../fractal/types';
import { FINISH_DRAWING } from '../fractal/drawState';


const initialState: UIState = ({
  nav: Nav.Explore,
  modal: Modal.None,
  canvasStretch: StretchMode.Contain,
  galleryBadge: 0,
  methodList: ALLFRACTALS,
  colorSchemeList: {...COLORSCHEMES},
  waiting: false,
});


export default function(state: UIState=initialState, action: Action) {
  switch(action.type) {
    case UPDATE_UI:
      return {...state, ...action.payload};
    case SET_NAV:
      if (action.payload === Nav.Gallery) {
        return {...state, nav: action.payload, galleryBadge: 0};
      } else {
        return {...state, nav: action.payload};
      }
    case SET_MODAL:
      return {...state, modal: action.payload};
    case SET_STRETCH:
      return {...state, canvasStretch: action.payload};
    case ADD_COLOR_SCHEME:
      return {
        ...state, 
        colorSchemeList: {
          ...state.colorSchemeList,
          [action.payload.name]: action.payload.scheme,
        },
      };
    case ADD_TO_GALLERY:
      return {...state, galleryBadge: state.galleryBadge+1};
    case UPDATE_FRACTAL:
      if (action.payload
        && action.payload.color
        && action.payload.color.schemeName 
        && !(state.colorSchemeList[action.payload!.color!.schemeName])) {
        return {
          ...state, 
          colorSchemeList: {
            ...state.colorSchemeList,
            [action.payload.color.schemeName]: action.payload.color.scheme,
          },
        };
      }
      return state;
    case FINISH_DRAWING:
      return {...state, waiting: false}
    default:
      return state;
  }
}