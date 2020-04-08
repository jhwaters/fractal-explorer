import { Json, AppState } from '.';
import { ALLFRACTALS, COLORSCHEMES } from '../'


type Color = [string, number, number] | [string, number, number, ...string[]]

export interface V2 extends Json {
  v: '2',
  alg?: [string, {[k: string]: any}],
  col?: Color,
  view?: [number, number, number, number, number],
}

export function stateToJson2(state: AppState): V2 {
  const {algorithm, color, view} = state;
  const {schemeName} = color;
  const scheme = COLORSCHEMES[schemeName] ? null : color.scheme;
  const col: Color = [color.schemeName, color.skew, color.reverse ? 1 : 0];
  if (Array.isArray(scheme)) {
    col.push(...scheme)
  }
  return ({
    v: '2',
    alg: [algorithm.methodName, algorithm.params],
    col: col,
    view: [view.cx, view.cy, view.w, view.h, view.ppu],
  })
}

export function jsonToState2(data: V2): Partial<AppState> | undefined {
  const result: Partial<AppState> = {}
  if (data.alg) {
    const methodName = data.alg[0];
    const method = ALLFRACTALS[methodName];
    if (method) {
      result.algorithm = {
        methodName,
        method,
        params: data.alg[1],
      };
    }
  }

  if (data.col) {
    const schemeName = data.col[0];
    let scheme = COLORSCHEMES[schemeName];
    if (!scheme) {
      scheme = data.col.slice(3) as string[]
    }
    result.color = {
      schemeName: scheme && scheme.length ? schemeName : 'Rainbow',
      scheme: scheme && scheme.length ? scheme : COLORSCHEMES.Rainbow,
      skew: data.col[1],
      reverse: data.col[2] ? true : false,
      count: 0,
    };
  }
  if (data.view) {
    result.view = {
      cx: data.view[0],
      cy: data.view[1],
      w: data.view[2],
      h: data.view[3],
      ppu: data.view[4],
      t: [1,0,0,-1],
    };
  }
  return result;
}

export function jsonToUrl2(data: V2): string {
  const u = new URLSearchParams();
  const {v, alg, col, view} = data;
  u.append('v', v)
  if (alg) {
    const par = Object.entries(alg[1]).map(([k, v]) => {
      return k + ':' + JSON.stringify(v);
    }).join(';')
    u.append('al', alg[0] + ';' + par)
  }
  if (col) {
    u.append('co', col.join(';'))
  }
  if (view) {
    u.append('vw', view.join(';'))
  }
  return u.toString()
}

export function urlToJson2(u: URLSearchParams): V2 | undefined {
  try {
    const al = u.get('al')
    const co = u.get('co')
    const vw = u.get('vw')
    const result: V2 = {v: '2'};
    if (al) {
      try {
        const [me, ...pa] = al.split(';')
        const params: {[k: string]: any} = Object.fromEntries(pa.map((entry: string) => {
          const s = entry.split(':');
          try {
            return [s[0], JSON.parse(s[1])] as [string, any]
          } catch {
            console.log('bad param', entry)
            return ['BAD_PARAM', 'BAD_PARAM'] as [string, any]
          }
        }).filter((ent: [string, any]) => ent[1] !== 'BAD_PARAM'))
        result.alg = [me, params];
      } catch {}
    }
    if (co) {
      try {
        const [scheme, skew, rev, ...colors] = co.split(';')
        result.col = [scheme, +skew, +rev, ...colors];
      } catch {}
    }
    if (vw) {
      try {
        const [cx, cy, w, h, ppu] = vw.split(';').map(k => +k)
        result.view = [cx, cy, w, h, ppu];
      } catch {}
    }
    return result;
  } catch {}
}