import {
  GalleryState,
  GalleryAction,
  ADD_TO_GALLERY,
  DELETE_IMAGE,
  MASS_ADD_TO_GALLERY,
} from './types'

const initialState: GalleryState = [];

export default function(state: GalleryState=initialState, action: GalleryAction) {
  switch(action.type) {
    case ADD_TO_GALLERY:
      return [...state, action.payload];
    case DELETE_IMAGE:
      URL.revokeObjectURL(action.payload)
      return state.filter(v => v.url !== action.payload);
    case MASS_ADD_TO_GALLERY:
      console.log(action);
      return [...state, ...action.payload];
    default:
      return state
  }
}