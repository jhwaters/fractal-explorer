import reduxStore from '../../store';
import { addToGallery } from '../../store/actions';
import { FractalState } from '../../store/fractal/types';
import { recenterPPU } from '../../store/fractal/view/reducer';
import { JsonState, jsonToState, stateToJson } from '../../fractals/json';
import { ColorState } from '../../store/fractal/color/types';
import { ViewState } from '../../store/fractal/view/types';
import { ALLFRACTALS, COLORSCHEMES } from '../../fractals'; 
import { FractalCommands, Params } from './types'
import { FractalDrawer } from '../../fractals'
import Abstract from './abstract';
import { animator } from './animation';
import Zipper from './zip';

interface Fractal extends Omit<FractalState,'drawState'|'view'> {
  view: {
    cx: number
    cy: number
    w: number
    h: number
    ppu: number
  }
}

class Disconnected extends Abstract implements FractalCommands {
  fractal: Fractal
  drawer: FractalDrawer
  zipper: Zipper

  constructor(fractalState: Fractal) {
    super();
    this.fractal = fractalState;
    this.drawer = new FractalDrawer();
    this.zipper = new Zipper();
  }

  private static parseState(fractal: Fractal | FractalState) {
    return {
      algorithm: {...fractal.algorithm},
      color: {...fractal.color},
      view: {...fractal.view},
    }
  }

  static fromState(fractal: Fractal | FractalState) {
    return new Disconnected(Disconnected.parseState(fractal));
  }

  static new() {
    return new Disconnected(reduxStore.getState().fractal);
  }

  clear() {
    this.zipper = new Zipper();
  }

  loadJson(data: JsonState) {
    const fractal = jsonToState(data);
    if (fractal) {
      this.fractal.algorithm = {...this.fractal.algorithm, ...fractal.algorithm}
      this.fractal.color = {...this.fractal.color, ...fractal.color}
      this.fractal.view = {...this.fractal.view, ...fractal.view}
    }
    return this;
  }

  animate(start: number, stop: number, frames: number=0, {
    incl=true,
    ms=0,
  }: {
    incl?: boolean,
    ms?: number,
  }={}) {
    if (frames === 0) {
      frames = stop - start;
    }
    return (param: (n: number) => Params) => {
      return animator(start, stop, frames, incl)((n: number) => {
        this.updateParams(param(n));
        this.redraw();
        this.drawer.toBlob(blob => {
          if (blob) {
            this.zipper.addFile(blob)
          }
        });
      }, ms);
    }
  }

  download(filename: string) {
    this.drawer.toURL(url => {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.append(a);
      a.click();
      setTimeout(() => {
        a.remove();
        URL.revokeObjectURL(url);
      }, 100);
    })
  }

  saveToGallery() {
    this.redraw();
    this.drawer.toURL(url => {
      const title = 'fract' + Math.floor((Date.now() - new Date(2020,0,25).getTime())).toString(16)
      reduxStore.dispatch(addToGallery(url, stateToJson(this.getFractal()), title));
    })
  }

  getFractal(): Omit<FractalState,'drawState'> {
    return ({
      algorithm: this.getAlgorithm(),
      color: this.getColor(),
      view: this.getView(),
    });
  }

  getAlgorithm() {
    return this.fractal.algorithm;
  }

  getColor() {
    return this.fractal.color;
  }

  getView() {
    return {
      ...this.fractal.view,
      pixelCount: this.fractal.view.w * this.fractal.view.h,
    }
  }

  redraw() {
    this.drawer.draw(this.getFractal())
  }

  getMethod() {
    return this.fractal.algorithm.methodName;
  }

  getParams() {
    return this.fractal.algorithm.params;
  }

  getParam(k: string) {
    return this.getParams()[k]
  }

  setMethod(methodName: string) {
    const method = ALLFRACTALS[methodName];
    if (method) {
      this.fractal.algorithm.method = method;
      this.fractal.algorithm.methodName = methodName;
    } else {
      console.error('unknown methodName:', methodName)
    }
  }

  updateParams(p: Params) {
    this.fractal.algorithm.params = {...this.fractal.algorithm.params, ...p}
  }

  setParam(k: string, v: any) {
    this.fractal.algorithm.params[k] = v;
  }


  // Color

  _updateColor(color: Partial<ColorState>) {
    this.fractal.color = {...this.fractal.color, ...color};
  }



  // View

  _updateView(view: Partial<ViewState>) {
    this.fractal.view = {...this.fractal.view, ...view};
  }

  recenter() {
    this.fractal.view.cx = 0;
    this.fractal.view.cy = 0;
    this.fractal.view.ppu = recenterPPU(this.fractal.view);
  }

  setCenter(x: number, y: number) {
    this.fractal.view.cx = x;
    this.fractal.view.cy = y;
  }

  zoom(factor: number) {
    this.fractal.view.ppu *= factor;
  }
}

export default Disconnected