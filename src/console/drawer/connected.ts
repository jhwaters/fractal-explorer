import reduxStore from '../../store';
import * as reduxAction from '../../store/actions';
import { Action } from '../../store/types';
import { FractalState } from '../../store/fractal/types';
import { ColorState } from '../../store/fractal/color/types';
import { ViewState } from '../../store/fractal/view/types';
import { JsonState } from '../../fractals/json';
import { ALLFRACTALS, COLORSCHEMES } from '../../fractals'; 
import { FractalCommands, Params } from './types'
import Abstract from './abstract';
import { animator } from './animation';

class Connected extends Abstract implements FractalCommands {
  protected store: typeof reduxStore
  protected autodraw: boolean

  constructor(store: typeof reduxStore=reduxStore, autodraw: boolean=false) {
    super();
    this.store = store;
    this.autodraw = autodraw
  }

  static new(autodraw: boolean=false) {
    return new Connected(reduxStore, autodraw);
  }

  animate(start: number, stop: number, frames: number=0, {
    incl=true,
    ms=0,
  }: {
    incl?: boolean,
    ms?: number,
  }={}) {
    if (frames === 0) {
      frames = stop - start + 1;
    }
    return (param: (n: number) => Params) => {
      const autodraw = this.autodraw;
      this.autodraw = true;
      return animator(start, stop, frames, incl)((n: number) => {
        this.updateParams(param(n))
      }, ms).then(() => {
        this.autodraw = autodraw;
      });
    }
  }

  loadJson(data: JsonState) {
    this.dispatch(reduxAction.uploadJson(data))
    return this;
  }

  dispatch(action: Action) {
    this.store.dispatch(action)
    if (this.autodraw) {
      this.redraw();
    }
  }

  redraw() {
    this.store.dispatch(reduxAction.redraw())
  }

  getFractal(): FractalState {
    return this.store.getState().fractal;
  }

  getAlgorithm() {
    return this.getFractal().algorithm;
  }

  getColor() {
    return this.getFractal().color;
  }

  getView() {
    return this.getFractal().view;
  }

  // Algorithm

  getMethod() {
    return this.getFractal().algorithm.methodName;
  }

  getParams() {
    return this.getFractal().algorithm.params;
  }

  getParam(k: string) {
    return this.getParams()[k]
  }

  setMethod(methodName: string) {
    const method = ALLFRACTALS[methodName];
    if (method) {
      this.dispatch(reduxAction.setAlgorithm(methodName, method));
    } else {
      console.error('unknown methodName:', methodName)
    }
  }

  updateParams(p: Params) {
    this.dispatch(reduxAction.updateParams(p));
  }

  setParam(k: string, v: any) {
    this.dispatch(reduxAction.updateParams({[k]: v}));
  }

  // Color

  _updateColor(color: Partial<ColorState>) {
    this.dispatch(reduxAction.updateColor(color));
  }

  // View

  _updateView(view: Partial<ViewState>) {
    this.dispatch(reduxAction.updateView(view));
  }

  recenter() {
    this.dispatch(reduxAction.recenter());
  }

  setCenter(x: number, y: number) {
    this.dispatch(reduxAction.setCenter(x, y));
  }

  zoom(factor: number) {
    this.dispatch(reduxAction.zoomIn(factor));
  }
}

export default Connected