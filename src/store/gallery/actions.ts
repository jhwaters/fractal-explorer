import {
  AddToGallery,
  ADD_TO_GALLERY,
  DeleteImage,
  DELETE_IMAGE,
} from './types';


export const addToGallery = (url: string, title: string): AddToGallery => ({
  type: ADD_TO_GALLERY,
  payload: {title, url}
})

export const deleteImage = (url: string): DeleteImage => ({
  type: DELETE_IMAGE,
  payload: url,
})
