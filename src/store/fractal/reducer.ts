import algorithm from './algorithm/reducer';
import color from './color/reducer';
import view from './view/reducer';
import { State, Action } from './types';
import { combineReducers } from 'redux';
import {
  UPDATE_FRACTAL,
} from './types';

const reducer1 = combineReducers({
  algorithm,
  color,
  view,
});

export default function(state: State, action: Action): State {
  if (action.type === UPDATE_FRACTAL) {
    if (action.payload !== undefined) {
      return {
        algorithm: {...state.algorithm, ...action.payload.algorithm},
        color: {...state.color, ...action.payload.color},
        view: {...state.view, ...action.payload.view},
      };
    } else {
      return state;
    }
  } else {
    return reducer1(state, action);
  }
}
