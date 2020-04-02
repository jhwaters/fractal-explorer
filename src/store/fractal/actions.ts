import {
  jsonToState, urlToJson,
  AppState, JsonState
} from '../../fractals/json';
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

export const uploadData = (data: AppState): UpdateFractal => ({
  type: UPDATE_FRACTAL,
  payload: data
})

export const uploadJson = (data: JsonState): UpdateFractal => ({
  type: UPDATE_FRACTAL,
  payload: jsonToState(data)
})

export const uploadUrl = (url: string): UpdateFractal => {
  const data = urlToJson(url);
  if (data) {
    return ({
      type: UPDATE_FRACTAL,
      payload: jsonToState(data)
    })
  } else {
    return ({
      type: UPDATE_FRACTAL,
      payload: undefined
    })
  }
}