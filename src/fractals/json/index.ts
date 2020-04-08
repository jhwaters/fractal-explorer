import { AlgorithmState } from '../../store/fractal/algorithm/types';
import { ColorState } from '../../store/fractal/color/types';
import { ViewState } from '../../store/fractal/view/types';
import {
  V3,
  jsonToState3,
  stateToJson3,
  urlToJson3,
  jsonToUrl3,
} from './json3';


export interface AppState {
  algorithm: AlgorithmState<any>,
  color: ColorState,
  view: Omit<ViewState,'pixelCount'>
}

export interface AppUpdate {
  algorithm?: AlgorithmState<any>
  color?: Partial<ColorState>
  view?: Partial<Omit<ViewState,'pixelCount'>>
}

export interface Json {
  v: '3'
}

export type JsonState = V3

export type JsonCurrent = V3

export function stateToJson(state: AppState): JsonCurrent {
  return stateToJson3(state);
}

export function jsonToState(data: Json & Partial<JsonState>): AppUpdate | undefined {
  return jsonToState3(data);
}

export function jsonToUrl(data: JsonState): string {
  const q = window.location.href.split('?')[0] + '?';
  return q + jsonToUrl3(data);
}

export function urlToJson(url: string): (Json & Partial<JsonState>) | undefined {
  try {
    const u = new URLSearchParams(url);
    return urlToJson3(u);
  } catch {}
}