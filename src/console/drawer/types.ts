import { JsonState } from '../../fractals/json';
import { AlgorithmState } from '../../store/fractal/algorithm/types';
import { ColorState } from '../../store/fractal/color/types';
import { ViewState } from '../../store/fractal/view/types';

export type Params = {[k: string]: any}

export interface FractalCommands {
  redraw(): void
  
  loadJson(data: JsonState): void

  // Algorithm
  getMethod(): string
  setMethod(methodName: string): void
  getParams(): Params
  getParam(k: string): any
  updateParams(p: Params): void
  setParam(k: string, v: any): void
  
  // Color
  _updateColor(color: Partial<ColorState>): void

  // View
  _updateView(view: Partial<ViewState>): void
  recenter(): void
  setCenter(x: number, y: number): void
  zoom(factor: number): void

}