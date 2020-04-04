import store from '../store';
import * as action from '../store/fractal/actions';
import { ColorState } from '../store/fractal/color/types';
import { redraw } from '../store/ui/actions';
import { ALLFRACTALS, COLORSCHEMES } from '../fractals'; 
import { FractalState } from '../store/fractal/types';
import { JsonState } from '../fractals/json';


function withredraw(x: any) {
  store.dispatch(x);
  store.dispatch(redraw());
}

export function setParam(k: string, v: any) {
  withredraw(action.updateParams({[k]: v}));
}

export function getParam(k: string) {
  return params()[k];
}

export function method(m?: string) {
  if (m) {
    const method = ALLFRACTALS[m];
    if (method) {
      withredraw(action.setAlgorithm(m, method))
    } else {
      console.error('unknown method', m);
    }
  } else {
    return (store.getState().fractal as FractalState).algorithm.methodName;
  }
}

export function params(p?: {[k: string]: any}) {
  if (p) {
    withredraw(action.updateParams(p));
  } else {
    return (store.getState().fractal as FractalState).algorithm.params;
  }
}

export function loadJson(data: JsonState) {
  withredraw(action.uploadJson(data));
}

export function zoom(n: number=1) {
  zoomIn(n);
}

export function zoomIn(n: number=2) {
  withredraw(action.zoomIn(n));
}

export function zoomOut(n: number=2) {
  withredraw(action.zoomOut(n));
}

export function recenter() {
  withredraw(action.recenter())
}

export function color(x: Partial<{
  scheme: string,
  skew: number,
  reverse: boolean,
}>) {
  const {scheme, ...rest} = x;
  if (scheme && COLORSCHEMES[scheme]) {
    withredraw(action.updateColor({
      ...rest,
      schemeName: scheme,
      scheme: COLORSCHEMES[scheme],
    }));
  } else {
    withredraw(action.updateColor(rest));
  }
}