import { State } from '../store/types'
import { State as AlgorithmState } from '../store/fractal/algorithm/types';
import { State as ColorState } from '../store/fractal/color/types';
import { State as ViewState } from '../store/fractal/view/types';
import { ALLFRACTALS, COLORSCHEMES } from '.'


interface Json {
  v: '1'
}

interface V1 extends Json {
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


export interface UploadState {
  algorithm: AlgorithmState<any>,
  color: ColorState,
  view: Omit<ViewState,'pixelCount'>
}

export type JSONState = V1

export function stateToJSON(state: Pick<State,'fractal'>): JSONState {
  const {algorithm, color, view} = state.fractal;
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

export function jsonToState(json: JSONState): UploadState | undefined {
  if (json.v === '1') {
    const scheme = COLORSCHEMES[json.col.sc];
    return ({
      algorithm: {
        methodName: json.alg.m,
        method: ALLFRACTALS[json.alg.m],
        params: json.alg.p,
      },
      color: {
        schemeName: scheme ? json.col.sc : 'Rainbow',
        scheme: scheme ? scheme : COLORSCHEMES.Rainbow,
        skew: json.col.sk,
        reverse: json.col.rv,
      },
      view: {
        cx: json.view.cx,
        cy: json.view.cy,
        w: json.view.w,
        h: json.view.h,
        ppu: json.view.pp,
      }
    })
  }
}

let idcount = 1;


export function shortName(json: JSONState): string {
  if (json.v === '1') {
    return `${idcount++}-${json.alg.m}`;
  } else {
    return `${idcount++}-fractal`;
  }
}

export function toBase64(s: string) {
  return btoa(s).replace(/=/g, '_').replace(/\+/g, '-')
}

export function fromBase64(s: string) {
  return atob(s.replace(/_/g, '=').replace(/-/g, '+'))
}