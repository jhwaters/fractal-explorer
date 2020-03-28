// Fractal-specific functions
import { Complex } from './types';
import { complex, abs2, multReal } from './complex';
import * as Math from './real';

export function burningship(z: Complex) {
  return complex(Math.abs(z.re), Math.abs(z.im))
}

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

export function mandelbox(a: number, b: number, c: number) {
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