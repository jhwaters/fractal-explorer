import { Complex, ControlType, FractalInterface } from '../types';
import { EscapeParams, describeEscapeFunction } from './mixers/escape';
import { BurningShipParams } from './burningship';
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


function mandelboxA(v: number=1) {
  const w = v*2;
  const f = (n: number) =>  {
    if (n > v) return w - n;
    else if (n < -v) return -w - n;
    else return n;
  }
  return (z: Complex) => complex(f(z.re), f(z.im));
}

function mandelboxB(v: number=2) {
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



const mandelboxFlatex = (v: number) => (
  '\\left\\{\\begin{aligned}'
  + `${num(2*v)} - n &, \\text{ if \$n > ${num(v)}\$}\\\\`
  + `${num(-2*v)} - n &, \\text{ if \$n < ${num(-v)}\$}\\\\`
  + 'n &, \\text{ otherwise}'
  + '\\end{aligned}\\right.'
);

const mandelboxAlatex = 'f(Re(z))+f(Im(z))i';

const mandelboxBlatex = (v: number) => (
  '\\left\\{\\begin{aligned}'
  + `${num(2*v)}z &, \\text{ if \$|z|<${num(1/v)}\$}\\\\`
  + `z \\div |z|^2 &, \\text{ if \$${num(1/v)} \\leq |z| < 1\$}\\\\`
  + 'z &, \\text{ otherwise}\\\\'
  + '\\end{aligned}\\right.'
)

const mandelboxClatex = (v: number) => num(v) + '\\cdot B(A(z)) + x + yi';

function describeMandelbox(a: number, b: number, c: number, bound: number, iterations: number) {
  return [
    {
      math: 'f_{\\mathbb{R}\\mapsto\\mathbb{R}}(n) =' + mandelboxFlatex(a),
      displayMode: true,
    },
    {
      math: 'A_{\\mathbb{C}\\mapsto\\mathbb{C}}(z) =' + mandelboxAlatex,
      displayMode: true,
    },
    {
      math: 'B_{\\mathbb{C}\\mapsto\\mathbb{C}}(z) =' + mandelboxBlatex(b),
      displayMode: true,
    },
    ...describeEscapeFunction(
      mandelboxClatex(c),
      '0',
      bound,
      iterations,
    )
  ]
} 


export interface MandelboxParams {
  a: number,
  b: number,
  c: number,
}

export const Mandelbox1: FractalInterface<MandelboxParams & EscapeParams> = ({
  label: 'Mandelbox',

  ...mix.escape.pixel(
    ({a, b, c}: MandelboxParams) => {
      const A = mandelboxA(a)
      const B = mandelboxB(b)
      return (x: Complex) => (z: Complex) => {
        return  add(multReal(B(A(z)), c), x)
      }
    }
  ),

  ...mix.escape.create(() => ({a: 1, b: 2, c: 2.2})),
  ...mix.base.settings(),

  formula: ({a, b, c}: MandelboxParams) => [
    'Mandelbox (', 
    [a, b, c].map((v: number) => num(v)).join(', '), 
    ')',
  ],

  description: ({a, b, c, bound, iterations}: MandelboxParams & EscapeParams) => {
    return describeMandelbox(a, b, c, bound, iterations);
  },

  ...mix.base.controls([
    {
      type: ControlType.Call,
      icon: 'Random',
      onCall: () => randomParams(),
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
      param: 'bound',
      label: 'bound',
      step: 10,
      min: 0,
    }
  ])

});



interface BurningShipBoxParams extends BurningShipParams, MandelboxParams {}

export const BurningShip2Mandelbox: FractalInterface<BurningShipBoxParams & EscapeParams> = ({
  label: 'Burning Ship (Mandelbox Remix)',

  ...mix.escape.pixel(
    ({a, b, c, k}: BurningShipBoxParams) => {
      const pow = isInt(k) && k > 0 ? powInt : powFloat
      const A = mandelboxA(a)
      const B = mandelboxB(b)
      return (x: Complex) => (z: Complex) => {
        let z1 = multReal(pow(complex(Math.abs(z.re), -Math.abs(z.im)), k), 1/c);
        return add(multReal(B(A(z1)), c), x)
      }
    }
  ),

  ...mix.escape.create(() => ({a: 1, b: 2, c: 2.2, k: 2, bound: 50})),
  ...mix.base.settings(),

  formula: ({a, b, c, k}: BurningShipBoxParams) => [
    'Burning Shipbox (', 
    [a, b, c, k].map((v) => num(v)).join(', '),
    ')'],

  description: ({a, b, c, k, bound, iterations}: BurningShipBoxParams & EscapeParams) => [
    'This follows the same algorithm as the Mandelbox fractal, but first applies the function ',
    {
      math: `z \\mapsto \\left(|Re(z)|-|Im(z)|\\right)^{${num(k)}} \\div ${num(c)}`,
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
  ])

});