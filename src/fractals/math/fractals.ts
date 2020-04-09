// Fractal-specific functions
import { Complex } from './types';
import {
  complex,
  abs2,
  add,
  mult,
  multReal,
  powN,
} from './complex';
import * as Math from './real';



// Burning Ship

const BS = (z: Complex) => complex(Math.abs(z.re), Math.abs(z.im))

export function burningship(k: number=1, c?: [number,number]): (z: Complex) => Complex {
  if (c) {
    const bs = burningship(k);
    const cc = complex(c[0], c[1])
    return (z: Complex) => add(bs(z), cc)
  }
  if (k === 1) return BS
  else {
    const p = powN(k)
    return (z: Complex) => p(complex(Math.abs(z.re), Math.abs(z.im)))
  }
}


// Mandelbox

export function mandelboxA(v: number=1) {
  const w = v*2;
  const f = (n: number) =>  {
    if (n > v) return w - n;
    else if (n < -v) return -w - n;
    else return n;
  }
  return (z: Complex) => complex(f(z.re), f(z.im));
}

export function mandelboxB(v: number=2) {
  const v2 = v*v;
  const recip = 1/v2;
  return (z: Complex) => {
    const ab2 = abs2(z);
    if (ab2 < recip) {
      return multReal(z, v2)
    } else if (ab2 < 1) {
      return multReal(z, 1/ab2)
    } else {
      return z
    }
  }
}

export function mandelbox(a: number=1, b: number=2, c: number=2) {
  const aa = a*2;
  const f1 = (n: number) =>  {
    if (n > a) return aa - n;
    else if (n < -a) return -aa - n;
    else return n;
  }
  const b2 = b*b;
  const recip = 1/b2;
  const f2 = (z: Complex) => {
    const ab2 = abs2(z);
    if (ab2 < recip) {
      return multReal(z, c*b2)
    } else if (ab2 < 1) {
      return multReal(z, c/ab2)
    } else {
      return multReal(z, c)
    }
  }
  return (z: Complex) => f2(complex(f1(z.re), f1(z.im)));
}


// Phoenix


export function lookback(f: (z: Complex, zprev: Complex) => Complex, z0: Complex=complex(0,0)) {
  let zp = z0;
  return (z: Complex) => {
    const z1 = f(z, zp)
    zp = z;
    return z1;
  }
}


export function phoenix(p: number | Complex=-0.5, k: number=2, c?: Complex) {
  const po = powN(k)
  const multiplier =
    typeof p === 'number'
    ? (zz: Complex) => multReal(zz, p)
    : (zz: Complex) => mult(zz, p);
  if (c) {
    return (z: Complex, zp: Complex) => add(add(po(z), c), multiplier(zp));
  } else {
    return (z: Complex, zp: Complex) => add(po(z), multiplier(zp));
  }
}