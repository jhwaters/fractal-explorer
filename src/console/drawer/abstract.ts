import { FractalCommands, Params } from './types';
import { JsonState } from '../../fractals/json';
import { ColorState } from '../../store/fractal/color/types';
import { ViewState } from '../../store/fractal/view/types';
import { COLORSCHEMES } from '../../fractals';
import { multiply } from '../../fractals/drawer/transform';

abstract class Base implements FractalCommands {
  abstract updateParams(p: Params): void
  abstract getParams(): Params
  abstract setMethod(methodName: string): void
  abstract getMethod(): string
  abstract loadJson(data: JsonState): void
  abstract recenter(): void
  abstract zoom(factor: number): void
  abstract setCenter(x: number, y: number): void
  abstract getView(): ViewState
  abstract updateColor(color: Partial<ColorState>): void
  abstract updateView(view: Partial<ViewState>): void

  transform(t: [number,number,number,number]) {
    const t0 = this.getView().t;
    this.updateView({t: multiply(t0, t)})
  }

  getParam(k: string) {
    return this.getParams()[k];
  }

  setColorScheme(schemeName: string, opts?: {skew?: number, reverse?: boolean}) {
    const scheme = COLORSCHEMES[schemeName];
    if (scheme) {
      this.updateColor({
        scheme,
        schemeName,
        ...opts,
      });
    } else {
      console.error('unknown schemeName:', schemeName)
    }
  }

  fixPolarParams(p: Params) {
    return Object.fromEntries(Object.entries(p).map(([k, v]: [string, any]) => {
      if (v.angle && v.radius) {
        const x = v.radius * Math.cos(v.angle)
        const y = v.radius * Math.sin(v.angle)
        return [k, [x, y]]
      } else {
        return [k, v];
      }
    }))
  }

}

export default Base