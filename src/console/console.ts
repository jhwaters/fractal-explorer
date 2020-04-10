import {
  Connected,
  THE_CONNECTED,
  Disconnected,
  Animator,
} from './drawer';
import { OPTS } from '../fractals/drawer/drawer';

const fractalex = {
  controller: (autodraw=true) => {
    THE_CONNECTED.autodraw = autodraw;
    return THE_CONNECTED;
  },

  disconnected: () => Disconnected.new(),

  animator: (frames: number | [number, number]) => new Animator(frames),
  
  get logDrawTime() {
    return OPTS.logDrawTime;
  },

  set logDrawTime(x: boolean) {
    OPTS.logDrawTime = x;
  },

  animateZoom({frames=60, delay=0, rotate=0, target='screen'}: {
    frames?: number, 
    delay?: number,
    rotate?: number | [number,number], 
    target?: 'screen' | 'download' | Connected | Disconnected
  }={}) {
    const anim = new Animator(frames);
    const {w, h, ppu} = THE_CONNECTED.getView();
    const {iter} = THE_CONNECTED.getParams();
    const startPPU = Math.round(Math.min(w, h)/5);
    anim.view.ppu = {
      scale: 'zoom',
      range: [startPPU, ppu],
    }
    anim.params.iter = [20, iter]
    if (rotate) {
      anim.view.t = {
        range: typeof rotate === 'number' ? [-rotate, 0] : rotate,
        map: (deg: number) => {
          const {a, b, c, d} = new DOMMatrix([1,0,0,-1,0,0]).rotateSelf(deg);
          return [a, b, c, d] as [number,number,number,number];
        }
      }
    }
    return anim.run(target, {delay});
  },

  magic: ({
    frames=30,
    delay=0,
    target='screen',
  }: {
    frames?: number | [number, number]
    delay?: number
    target?: 'screen' | 'download' | Connected | Disconnected
  }={}) => {
    const anim = new Animator(frames);
    const {c, p} = THE_CONNECTED.getParams();
    const randomInt = (n: number) => Math.floor(Math.random() * n)
    let shouldAnimate = false;
    if (c !== undefined) {
      shouldAnimate = true;
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
      shouldAnimate = true;
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
    if (shouldAnimate) {
      return anim.run(target, {delay});
    } else {
      console.log("This fractal cannot be magically animated. Choose a fractal with 'c' or 'p' parameters.")
    }
  },

}

export default fractalex;