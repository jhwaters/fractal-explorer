import { Json, AppState, AppUpdate } from '.';
import { ALLFRACTALS, COLORSCHEMES } from '../'
import {
  objToString,
  stringToObj,
} from './util';

type NTuple<T,L extends number> = [T, ...T[]] & {length: L};

interface V3_ extends Json {
  v: '3'
  am: string
  ap: {[k: string]: any}
  cp: NTuple<number,4> | {n: number, mi: boolean, rv: boolean, sk: number}
  vc: NTuple<number,2>
  vs: NTuple<number,3>
  vt: NTuple<number,4>
}

interface V3a extends V3_ {
  cs: string
}

interface V3b extends V3_ {
  cl: string[]
}

export type V3 = V3a | V3b

export function stateToJson3(state: AppState): V3 {
  const {algorithm, color, view} = state;
  if (COLORSCHEMES[color.schemeName]) {
    return {
      v: '3',
      am: algorithm.methodName,
      ap: {...algorithm.params},
      cs: color.schemeName,
      //cp: [color.count, color.mirror ? 1 : 0, color.reverse ? 1 : 0, color.skew],
      cp: {n: color.count, mi: color.mirror, rv: color.reverse, sk: color.skew},
      vc: [view.cx, view.cy],
      vs: [view.w, view.h, view.ppu],
      vt: view.t,
    }
  } else {
    return {
      v: '3',
      am: algorithm.methodName,
      ap: {...algorithm.params},
      cl: color.scheme as string[],
      //cp: [color.count, color.mirror ? 1 : 0, color.reverse ? 1 : 0, color.skew],
      cp: {n: color.count, mi: color.mirror, rv: color.reverse, sk: color.skew},
      vc: [view.cx, view.cy],
      vs: [view.w, view.h, view.ppu],
      vt: view.t,
    }
  }
}

export function jsonToState3(data: Partial<V3>): AppUpdate {
  const result: AppUpdate = {};
  if (data.am) {
    const method = ALLFRACTALS[data.am];
    result.algorithm = {
      methodName: data.am,
      method: method,
      params: data.ap ? data.ap : method.newParams()
    }
  }
  if ('cl' in data || 'cs' in data || data.cp) {
    result.color = {};
    if ('cl' in data && data.cl) {
      result.color.schemeName = '[Imported Scheme]';
      result.color.scheme = data.cl as string[];
    } else if ('cs' in data && data.cs && COLORSCHEMES[data.cs]) {
      result.color.schemeName = data.cs;
      result.color.scheme = COLORSCHEMES[data.cs];
    }
    if (data.cp) {
      if (Array.isArray(data.cp)) {
        result.color.count = data.cp[0];
        result.color.mirror = data.cp[1] ? true : false;
        result.color.reverse = data.cp[2] ? true : false;
        result.color.skew = data.cp[3];
      } else {
        result.color.count = data.cp.n;
        result.color.mirror = data.cp.mi;
        result.color.reverse = data.cp.rv;
        result.color.skew = data.cp.sk;
      }
    }
  }
  if (data.vc || data.vs || data.vt) {
    result.view = {};
    if (data.vc) {
      result.view.cx = data.vc[0];
      result.view.cy = data.vc[1];
    }
    if (data.vs) {
      result.view.w = data.vs[0];
      result.view.h = data.vs[1];
      result.view.ppu = data.vs[2];
    }
    if (data.vt) {
      result.view.t = data.vt as [number,number,number,number];
    }
  }
  return result;
}



export function fromNumArr(arr: number[]) {
  return arr.map(n => n.toString().replace('e+', 'e')).join('_');
}

export function toNumArr<L extends number>(str: string, len: L) {
  const a = str.split('_').map(n => +n);
  if (a.length === len) {
    return a as NTuple<number,L>;
  }
}

export function jsonToUrl3(data: Partial<V3>): string {
  const u = new URLSearchParams();
  u.append('v', '3');
  if (data.am) u.append('am', data.am);
  if (data.ap) u.append('ap', objToString(data.ap));
  if ('cl' in data && data.cl) {
    u.append('cl', data.cl.join('_'))
  } else if ('cs' in data && data.cs) {
    u.append('cs', data.cs);
  }
  if (data.cp) {
    if (Array.isArray(data.cp)) {
      u.append('cp', fromNumArr(data.cp));
    } else {
      u.append('cp', fromNumArr([data.cp.n, data.cp.mi ? 1 : 0, data.cp.rv ? 1 : 0, data.cp.sk]))
    }
  }
  if (data.vc) {
    u.append('vc', fromNumArr(data.vc));
  }
  if (data.vs) {
    u.append('vs', fromNumArr(data.vs));
  }
  if (data.vt) {
    u.append('vt', fromNumArr(data.vt));
  }
  return u.toString();
}

type X  = {v: '3'} & Partial<V3>

export function urlToJson3(u: URLSearchParams): X {
  const data: X = {v: '3'};
  const am = u.get('am');
  if (am) data.am = am;
  const ap = u.get('ap');
  if (ap) data.ap = stringToObj(ap);
  
  const cp = u.get('cp');
  if (cp) {
    const x = toNumArr(cp, 4);
    if (x) data.cp = {n: x[0], mi: x[1] === 1, rv: x[2] === 1, sk: x[3]};
  }
  
  const vc = u.get('vc');
  if (vc) {
    const x = toNumArr(vc, 2);
    if (x) data.vc = x;
  }

  const vs = u.get('vs');
  if (vs) {
    const x = toNumArr(vs, 3);
    if (x) data.vs = x;
  }

  const vt = u.get('vt');
  if (vt) {
    const x = toNumArr(vt, 4);
    if (x) data.vt = x;
  }

  const cl = u.get('cl');
  if (cl) {
    return {...data, cl: cl.split('_')}
  } else {
    const cs = u.get('cs');
    if (cs) {
      return {...data, cs};
    }
  }
  return data;
}