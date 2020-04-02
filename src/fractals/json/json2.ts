import { Json, AppState } from '.';
import { ALLFRACTALS, COLORSCHEMES } from '../'

const NameMap = {
  BurningShip: 'BS',
  BurningShipMandelbox: 'BSMB',
  Exponential: 'Exp',
  Julia: 'JQ',
  Julia2Term: 'J2',
  JuliaBurningShip: 'JBS',
  JuliaExp: 'JExp',
  JuliaSinh: 'JSinh',
  Magnet1: 'Mg1',
  Magnet2: 'Mg2',
  Mandelbox: 'MB',
  Mandelbrot: 'Mand',
  Mandelcorner: 'MBC',
  Phoenix: 'Phx',
  PhoenixBurningShip: 'PhxBS',
}

function shortName(n: string): string {
  for (const e of Object.entries(NameMap)) {
    if (n === e[0]) {
      return e[1];
    }
  }
  return n;
}

function longName(n: string): string {
  for (const e of Object.entries(NameMap)) {
    if (n === e[1]) {
      return e[0];
    }
  }
  return n;
}


export interface V2 extends Json {
  v: '2',
  alg: [string, {[k: string]: any}],
  col: [string, number, number],
  view: [number, number, number, number, number],
}

export function stateToJson2(state: AppState): V2 {
  const {algorithm, color, view} = state;
  return ({
    v: '2',
    alg: [shortName(algorithm.methodName), algorithm.params],
    col: [color.schemeName, color.skew, color.reverse ? 1 : 0],
    view: [view.cx, view.cy, view.w, view.h, view.ppu],
  })
}

export function jsonToState2(data: V2): AppState | undefined {
  const methodName = longName(data.alg[0]);
  const schemeName = data.col[0];
  const method = ALLFRACTALS[methodName];
  const scheme = COLORSCHEMES[schemeName];
  if (method) {
    return ({
      algorithm: {
        methodName,
        method,
        params: data.alg[1],
      },
      color: {
        schemeName: scheme ? schemeName : 'Rainbow',
        scheme: scheme ? scheme : COLORSCHEMES.Rainbow,
        skew: data.col[1],
        reverse: data.col[2] ? true : false,
      },
      view: {
        cx: data.view[0],
        cy: data.view[1],
        w: data.view[2],
        h: data.view[3],
        ppu: data.view[4],
      }
    })
  }
}

export function jsonToUrl2(data: V2): string {
  const u = new URLSearchParams();
  const {v, alg, col, view} = data;
  const par = Object.entries(alg[1]).map(([k, v]) => {
    return k + ':' + JSON.stringify(v);
  }).join(';')
  u.append('v', v)
  u.append('al', alg[0] + ';' + par)
  u.append('co', col.join(';'))
  u.append('vw', view.join(';'))
  return u.toString()
}

export function urlToJson2(u: URLSearchParams): V2 | undefined {
  try {
    const al = u.get('al')
    const co = u.get('co')
    const vw = u.get('vw')
    if (al && co && vw) {
      const [me, ...pa] = al.split(';')
      const params = Object.fromEntries(pa.map((entry: string) => {
        const s = entry.split(':');
        try {
          return [s[0], JSON.parse(s[1])]
        } catch {
          console.log(s)
          return ['xx', 1]
        }
      }))
      const [scheme, skew, rev] = co.split(';')
      const [cx, cy, w, h, ppu] = vw.split(';').map(k => +k)
      return {
        v: '2',
        alg: [me, params],
        col: [scheme, +skew, +rev],
        view: [cx, cy, w, h, ppu],
      }
    }
  } catch {}
}