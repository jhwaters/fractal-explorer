import { combineReducers } from 'redux';
import color from './color/reducer';
import view from './view/reducer';
import algorithm from './algorithm/reducer';
import draw from './draw/reducer';

export default combineReducers({
  algorithm,
  color,
  draw,
  view,
});