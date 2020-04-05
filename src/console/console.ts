import {
  Connected,
  Disconnected,
} from './drawer';
import { magic } from './magic';
import FractalDrawer from '../fractals/FractalDrawer';


export default {
  controller: Connected.new(true),

  hidden: () => Disconnected.new(),
  
  get logDrawTime() {
    return FractalDrawer.logDrawTime;
  },

  set logDrawTime(x: boolean) {
    FractalDrawer.logDrawTime = x;
  },

  magic: function(...args: any[]) {
    if (args.length) {
      if ('getParam' in args[0] && 'setParam' in args[0] && 'rotateParam' in args[0]) {
        return magic(...args);
      }
    }
    return magic(this.controller, ...args);
  },
}