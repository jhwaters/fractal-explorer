import { FractalCommands, Params } from './types';
import { JsonState, jsonToState } from '../../fractals/json';
import { AlgorithmState } from '../../store/fractal/algorithm/types';
import { ColorState } from '../../store/fractal/color/types';
import { ViewState } from '../../store/fractal/view/types';
import { ALLFRACTALS, COLORSCHEMES } from '../../fractals';

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