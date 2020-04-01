import { combineReducers } from 'redux';
import fractal from './fractal/reducer';
import ui from './ui/reducer';
import gallery from './gallery/reducer';

export default combineReducers({
  fractal,
  ui,
  gallery,
});