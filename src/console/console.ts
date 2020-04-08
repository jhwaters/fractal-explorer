import {
  Connected,
  Disconnected,
  Animator,
} from './drawer';
import { OPTS } from '../fractals/drawer/drawer';

export default {
  controller: Connected.new(true),

  hidden: () => Disconnected.new(),

  animator: (frames: number | [number, number]) => new Animator(frames),
  
  get logDrawTime() {
    return OPTS.logDrawTime;
  },

  set logDrawTime(x: boolean) {
    OPTS.logDrawTime = x;
  },
}