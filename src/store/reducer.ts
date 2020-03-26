import { combineReducers } from 'redux';
import color from './color/reducer';
import view from './view/reducer';
import algorithm from './algorithm/reducer';
import ui from './ui/reducer';

export default combineReducers({
  algorithm,
  color,
  view,
  ui,
});