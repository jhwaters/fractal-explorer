import { Complex, ControlType, FractalInterface } from '../types';
import { EscapeParams, describeEscapeFunction } from './mixers/escape';
import * as mix from './mixers';
import { add } from '../math/complex';
import { R as Math } from '../math';
import { mandelbox } from '../math/fractals';
import { num } from '../formatting'


function randomParams() {
  return {scale: Math.round(Math.random() * 20)/10 + 2}
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
      const mbox = mandelbox(a, b, c);
      return (x: Complex) => (z: Complex) => {
        return  add(mbox(z), x);
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


