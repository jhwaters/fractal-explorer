import { Complex, ControlType } from './types';
import * as mix from './mixers';
import {
  add,
  powInt,
  powFloat,
} from '../math/complex';
import { isInt } from '../math/util';
import { num } from '../formatting'



export interface MandelbrotParams { k: number }

export const Mandelbrot = mix.escape({
  label: 'Mandelbrot',
  latexF: (p: MandelbrotParams) => `z^{${num(p.k)}}+x+yi`,
  f: (p: MandelbrotParams) => {
    const k = p.k;
    if (isInt(k)) {
      return (c: Complex) => (z: Complex) => add(powInt(z, k), c);
    } else {
      return (c: Complex) => (z: Complex) => add(powFloat(z, k), c);
    }
  },
  newParams: () => ({k: 2}),
  controls: [
    {
      type: ControlType.Number,
      label: 'exponent (k)',
      param: 'k',
      step: 1,
      min: 0,
    }
  ],
})