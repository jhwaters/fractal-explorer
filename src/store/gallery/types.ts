import { JSONState } from '../../fractals/json'
export const ADD_TO_GALLERY = 'GALLERY_ADD'
export const DELETE_IMAGE = 'GALLERY_DELETE'

export interface GalleryImage {
  url: string
  data: JSONState
  title: string
}

export type State = GalleryImage[]

export type AddToGallery = {
  type: typeof ADD_TO_GALLERY
  payload: GalleryImage
}

export type DeleteImage = {
  type: typeof DELETE_IMAGE
  payload: string
}

export type Action = AddToGallery | DeleteImage


