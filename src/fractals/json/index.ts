import { State as AlgorithmState } from '../../store/fractal/algorithm/types';
import { State as ColorState } from '../../store/fractal/color/types';
import { State as ViewState } from '../../store/fractal/view/types';
import { V1 } from './json1';
import { V2 } from './json2';
import {
  jsonToState1,
  stateToJson1,
  urlToJson1,
  jsonToUrl1,
} from './json1'
import {
  jsonToState2,
  stateToJson2,
  urlToJson2,
  jsonToUrl2,
} from './json2';


export interface AppState {
  algorithm: AlgorithmState<any>,
  color: ColorState,
  view: Omit<ViewState,'pixelCount'>
}

export interface Json {
  v: '1' | '2'
}

export type JsonState = V1 | V2

export function stateToJson(state: AppState): V2 {
  return stateToJson2(state);
}

export function jsonToState(data: JsonState): AppState | undefined {
  if (data.v === '1') return jsonToState1(data);
  return jsonToState2(data);
}

export function jsonToUrl(data: JsonState): string {
  if (data.v === '1') return jsonToUrl1(data);
  return jsonToUrl2(data);
}

export function urlToJson(url: string): JsonState | undefined {
  try {
    const u = new URLSearchParams(url);
    const v = u.get('v');
    if (v === '1') return urlToJson1(u);
    else if (v === '2') return urlToJson2(u);
  } catch {}
}