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
import * as ctrl from './mixers/controls';


export interface BurningShipParams { k: number }

function absabs(z: Complex) {
  return {re: Math.abs(z.re), im: Math.abs(z.im)};
}

const BurningShip = mix.escape({
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
      step: 0.1,
      min: 0,
    }
  ] as ControlProps[],
})




interface BurningShipBoxParams extends BurningShipParams, MandelboxParams {}

const BurningShipMandelbox = mix.escape<BurningShipBoxParams>({
  label: 'Burning Ship (Mandelbox Remix)',
  
  f: ({box1, box2, box3, k}) => {
    const pow = isInt(k) && k > 0 ? powInt : powFloat
    const mbox = mandelbox(box1, box2, box3);
    return (x: Complex) => (z: Complex) => {
      let z1 = multReal(pow(complex(Math.abs(z.re), -Math.abs(z.im)), k), 1/box3);
      return add(mbox(z1), x);
    }
  },

  z0: 0,

  describe: ({box1, box2, box3, k, bd, iter}) => [
    'This follows the same algorithm as the Mandelbox fractal, but first applies the function ',
    {
      math: `z \\mapsto \\left(|Re(z)|-|Im(z)|\\right)^{${num(k)}} \\div ${num(box3)}`,
      displayMode: true,
    }
  ],

  newParams: () => ({box1: 1, box2: 2, box3: 2.2, k: 2, bd: 50}),

  controls: [
    {
      type: ControlType.Call,
      icon: 'Random',
      onCall: () => ({box3: Math.round(Math.random() * 100)/100 + 0.5})
    },
    ...['box1', 'box2', 'box3'].map(p => ctrl.number(p, {step:0.1})),
    ctrl.number('k', {step: 0.1, min: 0}),
    ctrl.number('bd', {step: 5, min: 0}),
  ],
});

export {
  BurningShip,
  BurningShipMandelbox,
}