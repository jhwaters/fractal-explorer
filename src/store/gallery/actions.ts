import { JsonState } from '../../fractals/json';
import {
  AddToGallery,
  ADD_TO_GALLERY,
  DeleteImage,
  DELETE_IMAGE,
  MassAddToGallery,
  MASS_ADD_TO_GALLERY,
} from './types';


export const addToGallery = (url: string, data: JsonState, title: string): AddToGallery => ({
  type: ADD_TO_GALLERY,
  payload: {url, data, title}
})

export const massAddToGallery = (imgs: {url: string, data: JsonState, title: string}[]): MassAddToGallery => ({
  type: MASS_ADD_TO_GALLERY,
  payload: imgs
})

export const deleteImage = (url: string): DeleteImage => ({
  type: DELETE_IMAGE,
  payload: url,
})
