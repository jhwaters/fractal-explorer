import reduxStore from '../../store';
import { addToGallery } from '../../store/actions';
import { FractalState } from '../../store/fractal/types';
import { recenterPPU } from '../../store/fractal/view/reducer';
import { JsonState, jsonToState, stateToJson, jsonToUrl } from '../../fractals/json';
import { ColorState } from '../../store/fractal/color/types';
import { ViewState } from '../../store/fractal/view/types';
import { ALLFRACTALS } from '../../fractals'; 
import { FractalCommands, Params } from './types'
import { drawImage } from '../../fractals'
import Abstract from './abstract';
import { rangeGen } from './util';
import { download } from './download';
import Zipper from './zip';

interface Fractal extends Omit<FractalState,'drawState'|'view'> {
  view: {
    cx: number
    cy: number
    w: number
    h: number
    ppu: number
    t: [number,number,number,number]
  }
}

class Disconnected extends Abstract implements FractalCommands {
  fractal: Fractal
  zipper: Zipper

  constructor(fractalState: Fractal) {
    super();
    this.fractal = fractalState;
    this.zipper = new Zipper();
  }

  animate([start, stop]: [number, number]) {
    const zip = this.zipper;
    return (f: (n: number) => {
      filename?: string,
      params?: {[k: string]: any},
      view?: Partial<ViewState>,
      color?: Partial<ColorState>,
    }) => new Promise(resolve => {
      for (const i of rangeGen(start, stop)) {
        const {filename='img' + String(i).padStart(4, '0') + '.png', params, view, color} = f(i);
        if (params) this.updateParams(params);
        if (view) this.updateView(view);
        if (color) this.updateColor(color);
        zip.file(filename, this.toBlob());
        console.log('frame', i)
      }
      resolve(this);
    })
  }

  private static parseState(fractal: Fractal) {
    return {
      algorithm: {...fractal.algorithm},
      color: {...fractal.color},
      view: {...fractal.view},
    }
  }

  toBlob(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const image = this.imageData();
      if (image) {
        const cvs = document.createElement('canvas')!
        const ctx = cvs.getContext('2d')!
        cvs.width = image.width;
        cvs.height = image.height;
        ctx.putImageData(image,0,0);
        cvs.toBlob(blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject();
          }
        });
      } else {
        reject();
      }
    });
  }

  toURL(): Promise<string> {
    return this.toBlob().then(blob => URL.createObjectURL(blob));
  }

  downloadImage(name: string='fractal.png') {
    this.toURL().then(url => {
      download(url, name);
    })
  }

  download(name: string='fractal.zip') {
    this.zipper.download(name);
  }

  clear() {
    this.zipper = new Zipper();
  }

  static fromState(fractal: Fractal | FractalState) {
    return new Disconnected(Disconnected.parseState(fractal));
  }

  static new() {
    return Disconnected.fromState(reduxStore.getState().fractal);
  }

  json() {
    return stateToJson(this.fractal)
  }

  url() {
    return jsonToUrl(this.json())
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

  saveToGallery() {
    this.toURL().then(url => {
      const title = 'fract' + Math.floor((Date.now() - new Date(2020,0,25).getTime())).toString(16)
      reduxStore.dispatch(addToGallery(url, stateToJson(this.getFractal()), title));
    })
  }

  imageData(): ImageData | undefined {
    return drawImage(this.getFractal())
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

  updateColor(color: Partial<ColorState>) {
    this.fractal.color = {...this.fractal.color, ...color};
  }



  // View

  updateView(view: Partial<ViewState>) {
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