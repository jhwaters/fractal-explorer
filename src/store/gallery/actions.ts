import { JSONState } from '../../fractals/json';
import {
  AddToGallery,
  ADD_TO_GALLERY,
  DeleteImage,
  DELETE_IMAGE,
} from './types';


export const addToGallery = (url: string, data: JSONState, title: string): AddToGallery => ({
  type: ADD_TO_GALLERY,
  payload: {url, data, title}
})

export const deleteImage = (url: string): DeleteImage => ({
  type: DELETE_IMAGE,
  payload: url,
})
