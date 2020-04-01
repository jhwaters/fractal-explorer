import { Complex, ControlType, ControlProps } from './types';
import { EscapeParams, describeEscapeFunction } from './mixers/escape';
import * as mix from './mixers';
import { add, complex } from '../math/complex';
import { R as Math } from '../math';
import { mandelbox, burningship } from '../math/fractals';
import * as fmt from '../formatting';
import * as ctrl from './mixers/controls';

function randomParams() {
  return {box3: Math.round(Math.random() * 20)/10 + 2}
}


const mandelboxFlatex = (v: number) => (
  '\\left\\{\\begin{aligned}'
  + `${fmt.num(2*v)} - n &, \\text{ if \$n > ${fmt.num(v)}\$}\\\\`
  + `${fmt.num(-2*v)} - n &, \\text{ if \$n < ${fmt.num(-v)}\$}\\\\`
  + 'n &, \\text{ otherwise}'
  + '\\end{aligned}\\right.'
);

const mandelboxAlatex = 'f(Re(z))+f(Im(z))i';

const mandelboxBlatex = (v: number) => (
  '\\left\\{\\begin{aligned}'
  + `${fmt.num(2*v)}z &, \\text{ if \$|z|<${fmt.num(1/v)}\$}\\\\`
  + `z \\div |z|^2 &, \\text{ if \$${fmt.num(1/v)} \\leq |z| < 1\$}\\\\`
  + 'z &, \\text{ otherwise}\\\\'
  + '\\end{aligned}\\right.'
)

const mandelboxClatex = (v: number) => fmt.num(v) + '\\cdot B(A(z)) + x + yi';


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

const MandelboxRandom = ({
  type: ControlType.Call,
  icon: 'Random',
  onCall: () => randomParams(),
}) as ControlProps

const MandelboxControls = [
  ctrl.number('box1', {step: 0.1, min: 0.1}),
  ctrl.number('box2', {step: 0.1, min: 0.1}),
  ctrl.number('box3', {step: 0.1, min: 0.1}),
]


export interface MandelboxParams {
  box1: number,
  box2: number,
  box3: number,
}

export const Mandelbox1 = mix.escape({
  label: 'Mandelbox',

  f: ({box1, box2, box3}: MandelboxParams) => {
    const mbox = mandelbox(box1, box2, box3);
    return (x: Complex) => (z: Complex) => {
      return  add(mbox(z), x);
    }
  },

  newParams: () => ({box1: 1, box2: 2, box3: 2.2}),

  describe: ({box1, box2, box3, bound, iterations}: MandelboxParams & EscapeParams) => {
    return describeMandelbox(box1, box2, box3, bound, iterations);
  },

  controls: [
    MandelboxRandom,
    ...MandelboxControls,
    {
      type: ControlType.Number,
      param: 'bound',
      label: 'bound',
      step: 10,
      min: 0,
    }
  ],

});



export const Mandelcorner = mix.escape<MandelboxParams>({
  label: 'Mandelcorner',
  f: ({box1, box2, box3}) => (z0: Complex) => {
    const cc = complex(z0.re, -z0.im);
    const f1 = mandelbox(box1, box2, box3)
    const bs = burningship()
    return (zz: Complex) => {
      let z = complex(zz.re, zz.im);
      z = f1(z)
      return add(bs(z), cc);
    }
  },

  newParams: () => ({box1: 1, box2: 2, box3: 3}),

  describe: ({box1, box2, box3}) => ['Mandelbox(' + [box1, box2, box3].map(v => fmt.num(v)).join(',') + ') -> Burning Ship'],

  controls: [
    MandelboxRandom,
    ...MandelboxControls,
    {
      type: ControlType.Number,
      param: 'bound',
      label: 'bound',
      step: 1,
    }
  ]
})