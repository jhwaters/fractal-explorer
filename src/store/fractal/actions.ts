import {
  jsonToState, urlToJson,
  AppState, JsonState
} from '../../fractals/json';
import {
  UPDATE_FRACTAL,
  UpdateFractal,
} from './types';

export {
  updateAlgorithm,
  setAlgorithm,
  updateParams,
} from './algorithm/actions'

export {
  updateColor,
} from './color/actions';

export {
  updateView,
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