import store from '../store';
import * as action from '../store/fractal/actions';
import { redraw } from '../store/ui/actions';
import { ALLFRACTALS, COLORSCHEMES } from '../fractals'; 
import { FractalState } from '../store/fractal/types';
import { JsonState } from '../fractals/json';


export function setParam(k: string, v: any) {
  store.dispatch(action.updateParams({[k]: v}));
  store.dispatch(redraw());
}

export function getParam(k: string) {
  return params()[k];
}

export function method(m?: string) {
  if (m) {
    const method = ALLFRACTALS[m];
    if (method) {
      store.dispatch(action.setAlgorithm(m, method))
      store.dispatch(redraw());
    } else {
      console.error('unknown method', m);
    }
  } else {
    return (store.getState().fractal as FractalState).algorithm.methodName;
  }
}

export function params(p?: {[k: string]: any}) {
  if (p) {
    store.dispatch(action.updateParams(p));
    store.dispatch(redraw());
  } else {
    return (store.getState().fractal as FractalState).algorithm.params;
  }
}

export function loadJson(data: JsonState) {
  store.dispatch(action.uploadJson(data));
  store.dispatch(redraw());
}

export function zoom(n: number=1) {
  zoomIn(n);
}

export function zoomIn(n: number=2) {
  store.dispatch(action.zoomIn(n))
  store.dispatch(redraw())
}

export function zoomOut(n: number=2) {
  store.dispatch(action.zoomOut(n))
  store.dispatch(redraw())
}

export function recenter() {
  store.dispatch(action.recenter())
  store.dispatch(redraw())
}