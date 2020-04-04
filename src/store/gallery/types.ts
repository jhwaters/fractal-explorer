import { JsonState } from '../../fractals/json'
export const ADD_TO_GALLERY = 'GALLERY_ADD'
export const MASS_ADD_TO_GALLERY = 'MASS_ADD_TO_GALLERY'
export const DELETE_IMAGE = 'GALLERY_DELETE'

export interface GalleryImage {
  url: string
  data: JsonState
  title: string
}

export type GalleryState = GalleryImage[]

export type AddToGallery = {
  type: typeof ADD_TO_GALLERY
  payload: GalleryImage
}

export type MassAddToGallery = {
  type: typeof MASS_ADD_TO_GALLERY
  payload: GalleryImage[]
}

export type DeleteImage = {
  type: typeof DELETE_IMAGE
  payload: string
}

export type GalleryAction = AddToGallery | DeleteImage | MassAddToGallery


