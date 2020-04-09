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

  magic: ({
    hidden=false,
    frames=30,
    delay=0,
  }: {
    hidden?: boolean
    frames?: number | [number, number]
    delay?: number
  }={}) => {
    const alex = hidden ? Disconnected.new() : Connected.new(true);
    const anim = new Animator(frames);
    const {c, p} = alex.getParams();
    const randomInt = (n: number) => Math.floor(Math.random() * n)
    if (c !== undefined) {
      const [x, y] = c;
      const ang = Math.atan2(y, x);
      const rad = Math.sqrt(x*x + y*y);
      const minRad = Math.min(0.1, rad / 2);
      const maxRad = Math.max(0.8 + Math.random(), rad*1.5);
      const a1 = Math.PI*2*(1+randomInt(4));
      const a2 = Math.PI*2*(1+randomInt(4));
      anim.params.c = {
        angle: {
          range: Math.random() < 0.5 ? [0,a1] : [a1,0],
          map: (a: number) => ang + a,
        },
        radius: {
          range: Math.random() < 0.5 ? [0,a2] : [a2,0],
          map: (r: number) => {
            const s = Math.sin(r);
            if (s < 0) {
              return rad + Math.abs(rad - minRad) * s
            } else if (s > 0) {
              return rad + Math.abs(maxRad - rad) * s
            } else {
              return rad;
            }
          }
        }
      }
    }
    if (p !== undefined) {
      const [x, y] = p;
      const ang = Math.atan2(y, x);
      const rad = Math.sqrt(x*x + y*y);
      const minRad = Math.max(0.01, rad / 4);
      const maxRad = Math.max(0.5 + Math.random(), rad*1.5);
      const a1 = Math.PI*2*(1+randomInt(4));
      const a2 = Math.PI*2*(1+randomInt(4));
      anim.params.p = {
        angle: {
          range: Math.random() < 0.5 ? [0,a1] : [a1,0],
          map: (a: number) => ang + a,
        },
        radius: {
          range: Math.random() < 0.5 ? [0,a2] : [a2,0],
          map: (r: number) => {
            const s = Math.sin(r);
            if (s < 0) {
              return rad + Math.abs(rad - minRad) * s
            } else if (s > 0) {
              return rad + Math.abs(maxRad - rad) * s
            } else {
              return rad;
            }
          }
        }
      }
    }
    return anim.apply(alex, {delay})
  },

}