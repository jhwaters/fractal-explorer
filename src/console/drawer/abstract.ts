import { FractalCommands, Params } from './types';
import { JsonState } from '../../fractals/json';
import { ColorState } from '../../store/fractal/color/types';
import { ViewState } from '../../store/fractal/view/types';
import { COLORSCHEMES } from '../../fractals';

abstract class Base implements FractalCommands {
  abstract updateParams(p: Params): void
  abstract setParam(k: string, v: any): void
  abstract getParams(): Params
  abstract redraw(): void
  abstract setMethod(methodName: string): void
  abstract getMethod(): string
  abstract loadJson(data: JsonState): void
  abstract recenter(): void
  abstract zoom(factor: number): void
  abstract setCenter(x: number, y: number): void
  abstract _updateColor(color: Partial<ColorState>): void
  abstract _updateView(view: Partial<ViewState>): void
  abstract animate(start: number, stop: number, frames?: number, opts?: {
    incl?: boolean,
    ms?: number,
  }): (f: (n: number) => Params) => any

  rotateParam(k: string, {
    frames=30, 
    center=[0,0],
    angle=Math.PI*2,
    incl=true,
    ms=0
  }: {
    frames?: number,
    center?: [number,number],
    angle?: number,
    incl?: boolean,
    ms?: number,
  }={}) {
    const [x0, y0]: [number, number] = this.getParam(k);
    const [cx, cy] = center;
    const dx = x0 - cx;
    const dy = y0 - cy;
    const a0 = Math.atan2(dy, dx);
    const r0 = Math.sqrt(dx*dx + dy*dy);
    function setAngle(rad: number) {
      const a1 = a0 + rad;
      const x1 = cx + r0 * Math.cos(a1);
      const y1 = cy + r0 * Math.sin(a1);
      return {[k]: [x1, y1]}
    }
    return this.animate(0, angle, frames, {incl, ms})(setAngle)
  }

  getParam(k: string) {
    return this.getParams()[k];
  }

  setColorScheme(schemeName: string, opts?: {skew?: number, reverse?: boolean}) {
    const scheme = COLORSCHEMES[schemeName];
    if (scheme) {
      this._updateColor({
        scheme,
        schemeName,
        ...opts,
      });
    } else {
      console.error('unknown schemeName:', schemeName)
    }
  }

}

export default Base