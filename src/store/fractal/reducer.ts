import algorithm from './algorithm/reducer';
import color from './color/reducer';
import view from './view/reducer';
import { reducer as drawState } from './drawState';
import {
  FractalState,
  FractalAction,
  UPDATE_FRACTAL,
} from './types';
import { combineReducers } from 'redux';

const reducer1 = combineReducers({
  algorithm,
  color,
  view,
  drawState,
});

export default function(state: FractalState, action: FractalAction): FractalState {
  if (action.type === UPDATE_FRACTAL) {
    if (action.payload !== undefined) {
      // fit without changing w:h ratio
      const rw = action.payload.view.w / state.view.w;
      const rh = action.payload.view.h / state.view.h;
      if (rw > rh) {
        action.payload.view.h = state.view.h * rw;
      } else {
        action.payload.view.w = state.view.w * rh;
      }
      return {
        algorithm: {...state.algorithm, ...action.payload.algorithm},
        color: {...state.color, ...action.payload.color},
        view: {...state.view, ...action.payload.view},
        drawState: state.drawState,
      };
    } else {
      return state;
    }
  } else {
    return reducer1(state, action);
  }
}
