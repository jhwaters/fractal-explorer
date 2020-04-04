import * as store from './store';
import { animate, rotate } from './animate';
import { repeat } from './util';
import FractalDrawer from '../fractals/FractalDrawer';



export default {
  ...store,
  
  animate,
  rotate,

  set logDrawTime(x: boolean) {
    FractalDrawer.logDrawTime = x;
  }
}