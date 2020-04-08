import { Complex, ControlType, FractalInterface } from './types';
import { EscapeParams, describeEscapeFunction } from './mixers/escape';
import { BurningShipParams } from './burningship';
import { MandelboxParams } from './mandelbox';
import * as mix from './mixers';
import {
  complex,
  add,
  exp,
  mult,
  multReal,
  abs2,
  powInt,
  powFloat,
  powReal,
} from '../math/complex';
import { R as Math } from '../math';
import { isInt } from '../math/util';
import * as fmt from '../formatting'
import { burningship, mandelbox, phoenix, lookback } from '../math/fractals';
import * as ctrl from './mixers/controls';




interface ExpoParams {
  k: number
}

export const Exponential = mix.escape<ExpoParams>({
  label: {math: 'e^{z^k}+c'},

  newParams: () => ({k: 3}),

  latexF: ({k}: ExpoParams) => `e^{z^{${fmt.num(k)}}}+x+yi`,

  f: ({k}: ExpoParams) => (c: Complex) => {
    return (z: Complex) => add(exp(powReal(z, k)), c);
  },

  controls: [
    {
      type: ControlType.Number,
      label: 'k',
      param: 'k',
      step: 0.5,
    },
    {
      type: ControlType.Number,
      label: 'bound',
      param: 'bail',
      min: 0,
      step: 1,
    },
  ]
})


interface P {
  m1: number
  m2: number
  m3: number
  k: number
  p: [number, number]
  c: [number, number]
}

export const Test1 = mix.escape<P>({
  label: 'Test',

  newParams: () => ({p: [0.5,0], k: 2, m1: 2, m2: 2, m3: 2, c: [0.001, 0]}),

  f: ({p, k, m1, m2, m3, c}) => {
    const pp = complex(p[0], p[1])
    const cc = complex(c[0], c[1])
    const bs = burningship(k)
    const bx = mandelbox(m1, m2, m3)
    const px = phoenix(pp, 1, cc)
    const f = (z: Complex, zp: Complex) => bx(px(bs(z), zp))
    return (_: Complex) => lookback(f)
  },

  z0: () => (c: Complex) => c,

  describe: () => [''],

  controls: [
    ctrl.complex('c'),
    ctrl.number('k', {step: 0.5}),
    ctrl.complex('p'),
    ctrl.number('m1', {step: 0.1}),
    ctrl.number('m2', {step: 0.5}),
    ctrl.number('m3', {step: 0.1}),

  ]
})