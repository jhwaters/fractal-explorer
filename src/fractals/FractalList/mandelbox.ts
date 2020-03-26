import { Complex, ControlType, FractalInterface } from '../types';
import { EscapeParams, describeEscapeFunction } from './mixers/escape';
import * as mix from './mixers';
import {
  complex,
  add,
  multReal,
  abs2,
  powInt,
  powFloat,
} from '../math/complex';
import { R as Math } from '../math';
import { isInt } from '../math/util';
import { num } from '../formatting'


function randomParams() {
  return {scale: Math.round(Math.random() * 20)/10 + 2}
}


function f1(n: number) {
  if (n > 1) return 2 - n;
  else if (n < -1) return -2 -n;
  else return n;
}



const f1latex = (
  'f_{\\mathbb{R}\\mapsto\\mathbb{R}}(n)='
  + '\\left\\{\\begin{aligned}'
  + '2 - n & \\text{, if $n > 1$}\\\\'
  + '-2 - n & \\text{, if $n < -1$}\\\\'
  + 'n & \\text{, otherwise}\\\\'
  + '\\end{aligned}\\right.'
)

const f2latex = (
  'g_{\\mathbb{C}\\mapsto\\mathbb{C}}(z)='
  + 'f(Re(z))+f(Im(z))i'
)

const f3latex = (
  'h_{\\mathbb{C}\\mapsto\\mathbb{C}}(z)='
  + '\\left\\{\\begin{aligned}'
  + '4z & \\text{, if $|z|<0.5$}\\\\'
  + 'z \\div |z|^2 & \\text{, if $0.5 \\leq |z| < 1$}\\\\'
  + 'z & \\text{, otherwise}\\\\'
  + '\\end{aligned}\\right.'
)




export interface MandelboxParams {scale: number}

export const Mandelbox1: FractalInterface<MandelboxParams & EscapeParams> = ({
  label: 'Mandelbox',

  ...mix.escape.pixel(
    ({scale}: MandelboxParams) => (c: Complex) => (z: Complex) => {
      let z1 = complex(f1(z.re), f1(z.im))
      let abs2z1 = abs2(z1)
      if (abs2z1 < 0.25) {
        return add(multReal(z1, 4*scale), c)
      } else if (abs2z1 < 1) {
        return add(multReal(z1, scale/abs2z1), c)
      } else {
        return add(multReal(z1, scale), c)
      }
    }
  ),

  ...mix.escape.create(() => ({scale: 2.2})),
  ...mix.base.settings(),

  formula: ({scale}: MandelboxParams) => ['Mandelbox (', num(scale), ')'],

  description: ({scale, bound, iterations}: MandelboxParams & EscapeParams) => [
    {math: f1latex, displayMode: true},
    {math: f2latex, displayMode: true},
    {math: f3latex, displayMode: true},
    ...describeEscapeFunction(
      num(scale) + '\\cdot h(g(z))+x+yi',
      '0',
      bound,
      iterations,
    )
  ],

  ...mix.base.controls([
    {
      type: ControlType.Call,
      icon: 'Random',
      onCall: () => randomParams(),
    },
    {
      type: ControlType.Number,
      param: 'scale',
      label: 'scale',
      step: 0.1,
      min: 0
    },
  ])

});



interface Mandelbox2Params {
  k: number,
  scale: number,
}

export const Mandelbox2BurningShip: FractalInterface<Mandelbox2Params & EscapeParams> = ({
  label: 'Mandelbox/Burning Ship Mashup',

  ...mix.escape.pixel(
    ({scale, k}: Mandelbox2Params) => {
      const pow = isInt(k) && k > 0 ? powInt : powFloat
      return (c: Complex) => (z: Complex) => {
        let z1 = multReal(pow(complex(Math.abs(z.re), Math.abs(z.im)), k), 1/scale);
        z1 = complex(f1(z1.re), f1(z1.im))
        let abs2z1 = abs2(z1)
        if (abs2z1 < 0.25) {
          return add(multReal(z1, 4*scale), c)
        } else if (abs2z1 < 1) {
          return add(multReal(z1, scale/abs2z1), c)
        } else {
          return add(multReal(z1, scale), c)
        }
      }
    }
  ),

  ...mix.escape.create(() => ({scale: 2.2, k: 2, bound: 50})),
  ...mix.base.settings(),

  formula: ({scale,k}: Mandelbox2Params) => ['Burning Shipbox (', num(scale), ', ', num(k), ')'],

  description: ({scale, k, bound, iterations}: Mandelbox2Params & EscapeParams) => [
    'This follows the same algorithm as the Mandelbox fractal, but first applies the function ',
    {
      math: `z \\mapsto \\left(|Re(z)|+|Im(z)|\\right)^{${num(k)}} \\div ${num(scale)}`,
      displayMode: true,
    }
  ],

  ...mix.base.controls([
    {
      type: ControlType.Call,
      icon: 'Random',
      onCall: () => ({scale: Math.round(Math.random() * 100)/100 + 0.5})
    },
    {
      type: ControlType.Number,
      param: 'scale',
      label: 'scale',
      step: 0.1,
      //min: 0
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
  ])

});