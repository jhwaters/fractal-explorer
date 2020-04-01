import algorithm from './algorithm/reducer';
import color from './color/reducer';
import view from './view/reducer';
import { combineReducers } from 'redux';

export default combineReducers({
  algorithm,
  color,
  view,
})