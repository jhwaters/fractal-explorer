import { ALLFRACTALS, COLORSCHEMES } from '../'
import { Json, AppState } from '.';

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

export function jsonToState1(data: V1): AppState | undefined {
  const method = ALLFRACTALS[data.alg.m];
  const scheme = COLORSCHEMES[data.col.sc];
  if (method) {
    return ({
      algorithm: {
        methodName: data.alg.m,
        method: method,
        params: data.alg.p,
      },
      color: {
        schemeName: scheme ? data.col.sc : 'Rainbow',
        scheme: scheme ? scheme : COLORSCHEMES.Rainbow,
        skew: data.col.sk,
        reverse: data.col.rv,
      },
      view: {
        cx: data.view.cx,
        cy: data.view.cy,
        w: data.view.w,
        h: data.view.h,
        ppu: data.view.pp,
      }
    })
  }
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