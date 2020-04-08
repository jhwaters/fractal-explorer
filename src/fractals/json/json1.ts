import { ALLFRACTALS, COLORSCHEMES } from '../'
import { Json, AppState, AppUpdate } from '.';

export interface V1 extends Json {
  v: '1',
  alg: {
    m: string
    p: object
  },
  col: {
    sc: string
    sk: number
    rv: boolean
  },
  view: {
    cx: number
    cy: number
    w: number
    h: number
    pp: number
  }
}

export function stateToJson1(state: AppState): V1 {
  const {algorithm, color, view} = state;
  return ({
    v: '1',
    alg: {
      m: algorithm.methodName,
      p: algorithm.params,
    },
    col: {
      sc: color.schemeName,
      sk: color.skew,
      rv: color.reverse,
    },
    view: {
      cx: view.cx,
      cy: view.cy,
      w: view.w,
      h: view.h,
      pp: view.ppu,
    }
  })
}

export function jsonToState1(data: Partial<V1>): AppUpdate | undefined {
  const {alg, col, view} = data;
  if (!alg && !col && !view) {
    return;
  }
  const result: AppUpdate = {};
  if (alg) {
    const method = ALLFRACTALS[alg.m];
    if (method) {
      result.algorithm = {
        methodName: alg.m,
        method: method,
        params: alg.p ? alg.p : method.newParams(),
      }
    }
  }
  if (col) {
    const scheme = COLORSCHEMES[col.sc];
    result.color = {
      schemeName: scheme ? col.sc : 'Rainbow',
      scheme: scheme ? scheme : COLORSCHEMES.Rainbow,
      skew: col.sk,
      reverse: col.rv,
      count: 0,
    }
  }
  if (view) {
    result.view = {
      cx: view.cx,
      cy: view.cy,
      w: view.w,
      h: view.h,
      ppu: view.pp,
      t: [1,0,0,-1],
    }
  }
  return result;
}

export function jsonToUrl1(data: V1): string {
  const u = new URLSearchParams();
  const {v, ...rest} = data;
  u.append('v', v)
  u.append('data', btoa(JSON.stringify(rest)))    
  return u.toString()
}

export function urlToJson1(u: URLSearchParams): V1 | undefined {
  try {
    const data = u.get('data')
    if (data) {
      const {alg, col, view} = JSON.parse(atob(data));
      if (alg && col && view) {
        return {v: '1', alg, col, view}
      }
    }
  } catch {}
}