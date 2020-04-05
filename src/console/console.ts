import {
  Connected,
  Disconnected,
} from './drawer';
import { magic } from './magic';
import FractalDrawer from '../fractals/FractalDrawer';


export default {
  controller: (autoredraw=true) => {
    return Connected.new(autoredraw);
  },

  hidden: () => Disconnected.new(),
  
  get logDrawTime() {
    return FractalDrawer.logDrawTime;
  },

  set logDrawTime(x: boolean) {
    FractalDrawer.logDrawTime = x;
  },

  magic,
}