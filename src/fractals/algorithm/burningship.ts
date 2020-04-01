import { Complex, ControlType, ControlProps } from './types';
import * as mix from './mixers';
import {
  complex,
  add,
  multReal,
  powInt,
  powFloat,
} from '../math/complex';
import { R as Math } from '../math';
import { mandelbox } from '../math/fractals';
import { isInt } from '../math/util';
import { num } from '../formatting'
import { MandelboxParams } from './mandelbox';


export interface BurningShipParams { k: number }

function absabs(z: Complex) {
  return {re: Math.abs(z.re), im: Math.abs(z.im)};
}

export const BurningShip1 = mix.escape({
  label: 'Burning Ship',
  latexF: (p: BurningShipParams) => `\\left(|Re(z)|+|Im(z)|\\right)^{${num(p.k)}}+x-yi`,
  f: (p: BurningShipParams) => {
    const k = p.k;
    if (isInt(k)) {
      return (c: Complex) => {
        const cc = {re: c.re, im: -c.im}
        return (z: Complex) => add(powInt(absabs(z), k), cc);
      }
    } else {
      return (c: Complex) => {
        const cc = {re: c.re, im: -c.im}
        return (z: Complex) => add(powFloat(absabs(z), k), cc);
      }
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
  ] as ControlProps[],
})




interface BurningShipBoxParams extends BurningShipParams, MandelboxParams {}

export const BurningShip2Mandelbox = mix.escape<BurningShipBoxParams>({
  label: 'Burning Ship (Mandelbox Remix)',
  
  f: ({a, b, c, k}) => {
    const pow = isInt(k) && k > 0 ? powInt : powFloat
    const mbox = mandelbox(a, b, c);
    return (x: Complex) => (z: Complex) => {
      let z1 = multReal(pow(complex(Math.abs(z.re), -Math.abs(z.im)), k), 1/c);
      return add(mbox(z1), x);
    }
  },

  z0: 0,

  describe: ({a, b, c, k, bound, iterations}) => [
    'This follows the same algorithm as the Mandelbox fractal, but first applies the function ',
    {
      math: `z \\mapsto \\left(|Re(z)|-|Im(z)|\\right)^{${num(k)}} \\div ${num(c)}`,
      displayMode: true,
    }
  ],

  newParams: () => ({a: 1, b: 2, c: 2.2, k: 2, bound: 50}),

  controls: [
    {
      type: ControlType.Call,
      icon: 'Random',
      onCall: () => ({scale: Math.round(Math.random() * 100)/100 + 0.5})
    },
    {
      type: ControlType.Number,
      param: 'a',
      label: 'a',
      step: 0.1,
      min: 0.1,
    },
    {
      type: ControlType.Number,
      param: 'b',
      label: 'b',
      step: 0.1,
      min: 0.1,
    },
    {
      type: ControlType.Number,
      param: 'c',
      label: 'c',
      step: 0.1,
      min: 0.1,
    },
    {
      type: ControlType.Number,
      param: 'k',
      label: 'k',
      step: 0.1,
      //min: 0
    },
    {
      type: ControlType.Number,
      param: 'bound',
      label: 'bound',
      step: 10,
      min: 0,
    }
  ],
});

