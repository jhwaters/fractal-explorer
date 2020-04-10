import reduxStore from '../../store';
import * as reduxAction from '../../store/actions';
import { Action } from '../../store/types';
import { FractalState } from '../../store/fractal/types';
import { ColorState } from '../../store/fractal/color/types';
import { ViewState } from '../../store/fractal/view/types';
import { JsonState } from '../../fractals/json';
import { ALLFRACTALS } from '../../fractals'; 
import { FractalCommands, Params } from './types'
import Abstract from './abstract';
import { promiseRangeGen } from './util';

class Connected extends Abstract implements FractalCommands {
  protected store: typeof reduxStore
  autodraw: boolean

  constructor(store: typeof reduxStore=reduxStore, autodraw: boolean=false) {
    super();
    this.store = store;
    this.autodraw = autodraw
  }

  static new(autodraw: boolean=false) {
    return new Connected(reduxStore, autodraw);
  }

  loadJson(data: JsonState) {
    this.dispatch(reduxAction.uploadJson(data))
    return this;
  }

  animate([start, stop]: [number, number], {delay=0}: {
    delay?: number
  }={}) {
    return (f: (n: number) => {
      params?: {[k: string]: any},
      view?: Partial<ViewState>,
      color?: Partial<ColorState>,
    }) => {
      const autodraw = this.autodraw;
      this.autodraw = false;
      return promiseRangeGen(start, stop)((i: number) => {
        const {params, view, color} = f(i);
        if (params) this.updateParams(params);
        if (view) this.updateView(view);
        if (color) this.updateColor(color);
        this.redraw();
      }, delay).then(() => {
        this.autodraw = autodraw;
        return;
      })
    };
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
    this.dispatch(reduxAction.updateParams(this.fixPolarParams(p)));
  }

  // Color

  updateColor(color: Partial<ColorState>) {
    this.dispatch(reduxAction.updateColor(color));
  }

  // View

  updateView(view: Partial<ViewState>) {
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

const THE_CONNECTED = Connected.new(true);

export default Connected

export { THE_CONNECTED }