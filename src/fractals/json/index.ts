import { AlgorithmState } from '../../store/fractal/algorithm/types';
import { ColorState } from '../../store/fractal/color/types';
import { ViewState } from '../../store/fractal/view/types';
import { V1 } from './json1';
import { V2 } from './json2';
import { V3 } from './json3';
import {
  jsonToState1,
  urlToJson1,
  jsonToUrl1,
} from './json1'
import {
  jsonToState2,
  urlToJson2,
  jsonToUrl2,
} from './json2';
import {
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
  v: '1' | '2' | '3'
}

export type JsonState = V1 | V2 | V3

export function stateToJson(state: AppState): V3 {
  return stateToJson3(state);
}

export function jsonToState(data: Json & Partial<JsonState>): AppUpdate | undefined {
  if (data.v === '1') return jsonToState1(data);
  if (data.v === '2') return jsonToState2(data);
  return jsonToState3(data);
}

export function jsonToUrl(data: JsonState): string {
  return window.location.href.split('?')[0] + '?' + (
    data.v === '1' ? jsonToUrl1(data) :
    data.v === '2' ? jsonToUrl2(data) :
    jsonToUrl3(data)
  )
}

export function urlToJson(url: string): (Json & Partial<JsonState>) | undefined {
  try {
    const u = new URLSearchParams(url);
    const v = u.get('v');
    if (v === '1') return urlToJson1(u);
    else if (v === '2') return urlToJson2(u);
    else if (v === '3') return urlToJson3(u);
  } catch {}
}