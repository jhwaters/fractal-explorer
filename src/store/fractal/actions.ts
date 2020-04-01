import { UploadState, JSONState, jsonToState } from '../../fractals/json';
import {
  UPDATE_FRACTAL,
  UpdateFractal,
} from './types';

export {
  update as updateAlgorithm,
  setAlgorithm,
  updateParams,
} from './algorithm/actions'

export {
  update as updateColor,
} from './color/actions';

export {
  update as updateView,
  recenter,
  setCenter,
  zoomIn,
  zoomOut,
} from './view/actions';

export const uploadData = (data: UploadState): UpdateFractal => ({
  type: UPDATE_FRACTAL,
  payload: data
})

export const uploadJson = (data: JSONState): UpdateFractal => ({
  type: UPDATE_FRACTAL,
  payload: jsonToState(data)
})