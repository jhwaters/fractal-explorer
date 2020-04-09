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

  magic({
    c,
    p,
    frames=60,
    hidden=false,
  }: {
    c?: {
      angle?: [number,number],
      radius?: (n: number) => number,
    }
    p?: {
      angle?: [number,number],
      radius?: (n: number) => number,
    }
    frames?: number,
    hidden?: boolean,
  }={}) {
    const alex = hidden ? Disconnected.new() : Connected.new(true);
    return new Promise((resolve, reject) => {
      const par = alex.getParams();
      const anim = new Animator(frames);
      const aa = anim.scale('linear', [0,Math.PI*4])
      const params: {[k: string]: (n: number) => number | [number,number]} = {}

      if (par.c) {
        const r1 = Math.random() * 0.5;
        const r3 = 3*Math.random();
        const cc = c || {};
        const c_angle = cc.angle || [0, Math.PI * (2 + Math.random() * 4)]
        const c_radius = cc.radius || ((i: number) => r1 * Math.sin(i*r3))
        const cangle = anim.scale('linear', c_angle);
        const [cx, cy] = par.c;
        const cang = Math.atan2(cy, cx);
        const crad = Math.sqrt(cx*cx+cy*cy);
        params.c = anim.scalePolar({
          angle: (i) => cang + cangle(i),
          radius: (i) => crad + c_radius(aa(i)),
        });
      }
      if (par.p) {
        const r2 = Math.random() * 0.5;
        const r4 = 3*Math.random();
        const pp = p || {};
        const p_angle = pp.angle || [Math.PI * (2 + Math.random() * 4), 0]
        const p_radius = pp.radius || ((i: number) => -r2 * Math.sin(i*r4))
        const pangle = anim.scale('linear', p_angle);
        const [px, py] = par.p;
        const pang = Math.atan2(py, px);
        const prad = Math.sqrt(px*px+py*py);
        params.p = anim.scalePolar({
          angle: (i) => pang + pangle(i),
          radius: (i) => prad + p_radius(aa(i)),
        });
      }
      if (par.c || par.p) {
        resolve(anim.animate({params})(alex));
      } else {
        reject();
      }
    });
  }
}