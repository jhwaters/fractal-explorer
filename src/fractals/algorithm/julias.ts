import { Complex, ControlType, ControlProps } from './types';
import julia from './mixers/julia';
import {
  complex,
  add,
  powReal,
  exp,
  sqrt,
  sinh,
  powN,
} from '../math/complex';
import { burningship } from '../math/fractals';
import polynomial from '../math/polynomial';
import { R as Math } from '../math';
import * as fmt from '../formatting'


function randomC() {
  let angle = Math.PI -2 * Math.asin(Math.pow(Math.random(), 0.9));
  if (Math.random() < 0.5) angle = 2*Math.PI-angle;
  const radius = 0.3 + Math.sin(angle / 2) * 0.6 * (Math.random() * 0.4 + 0.8);
  return [
    Math.round(radius * Math.cos(angle) * 1000) / 1000,
    Math.round(radius * Math.sin(angle) * 1000) / 1000,
  ] as [number, number]
}


interface JuliaParams {
  k: number
  c: [number, number]
}


const JuliaControls: {[k: string]: ControlProps} = ({
  k: {
    type: ControlType.Number,
    label: 'exponent (k)',
    param: 'k',
    step: 0.5,
  },
  c: {
    type: ControlType.Complex,
    label: 'c',
    param: 'c',
    stepRadius: 0.02,
    stepAngle: 0.05,
  },
  randomC: {
    type: ControlType.Call,
    icon: 'Random',
    //label: 'random',
    onCall: () => ({c: randomC()}),
  },
})

interface JQuad extends JuliaParams {}

export const Julia = julia({
  label: {math: 'z^k+c'},

  f: ({k,c}: JQuad) => {
    const cc = complex(c[0], c[1])
    const p = powN(k)
    return (z: Complex) => add(p(z), cc);    
  },

  latexF: ({k,c}: JQuad) => `z^{${fmt.num(k)}}${fmt.complex(c,{sign:true})}`,

  newParams: () => ({k: 2, c: randomC()}),

  controls: [
    JuliaControls.randomC,
    JuliaControls.c,
    JuliaControls.k,
    {
      type: ControlType.Number,
      label: 'bound',
      param: 'bd',
      step: 5,
      min: 0,
    }
  ],

});


export type JPoly = {
  a: number,
  b: number,
  m: number,
  n: number,
  c: [number,number],
}

export const Julia2Term = julia({
  label: {math: 'az^m+bz^n+c'},

  f: ({a, b, c, m, n}: JPoly) => {
    const poly = polynomial({[m]: a, [n]: b});
    const cc = complex(c[0], c[1]);
    return (z: Complex) => add(poly(z), cc);
  },

  latexF: ({a, b, c, m, n}: JPoly) => {
    return (
      `${fmt.num(a)}z^{${fmt.num(m)}}`
      + `${fmt.num(b,{sign:true})}z^{${fmt.num(n)}}`
      + `${fmt.complex(c,{sign:true})}`
    )
  },

  newParams: () => ({
    a: -5, m: -2,
    b: 1, n: 1,
    c: [-0.5,0.5] as [number,number],
  }),

  controls: [
    ...['a', 'm', 'b', 'n'].map(p => ({
      type: ControlType.Number,
      param: p,
      label: p,
      step: p === 'a' || p === 'b' ? 1 : 0.1,
    }) as ControlProps),
    JuliaControls.c,
  ],
})



export const JuliaExp = julia<JuliaParams>({
  label: {math: 'e^{z^k}+c'},

  newParams: () => ({k: 3, c: [-0.6,0]}),

  latexF: ({k,c}: JuliaParams) => `e^{z^{${fmt.num(k)}}}${fmt.complex(c,{sign:true})}`,

  f: ({k,c}: JuliaParams) => {
    const cc = complex(c[0], c[1]);
    return (z: Complex) => add(exp(powReal(z, k)), cc);
  },

  controls: [
    JuliaControls.randomC,
    JuliaControls.c,
    JuliaControls.k,
    {
      type: ControlType.Number,
      label: 'bound',
      param: 'bd',
      min: 0,
      step: 1,
    },
  ]
})



export const JuliaSinh = julia<JuliaParams>({
  label: {math: '\\sqrt{\\sinh(z^{k})}+c'},

  newParams: () => ({k: 2, c: [0.06, 0.12]}),

  latexF: ({k,c}: JuliaParams) => `\\sqrt{\\sinh(z^{${fmt.num(k)}})}${fmt.complex(c,{sign:true})}`,

  f: ({k,c}: JuliaParams) => {
    const cc = complex(c[0], c[1]);
    return (z: Complex) => add(sqrt(sinh(powReal(z, k))), cc);
  },

  controls: [
    JuliaControls.randomC,
    JuliaControls.c,
    JuliaControls.k,
    {
      type: ControlType.Number,
      label: 'bound',
      param: 'bd',
      min: 0,
      step: 1,
    },
  ]
})


export const JuliaBS = julia<JuliaParams>({
  label: 'Burning Ship',

  newParams: () => ({k: 2, c: [-0.52, -1.1]}),

  f: ({k, c}: JuliaParams) => {
    const cc = complex(c[0], c[1])
    const bs = burningship(k);
    return (z: Complex) => add(bs(z), cc)
  },

  latexF: ({k,c}: JuliaParams) => `(|Re(z)|+|Im(z)|)^{${fmt.num(k)}}${fmt.complex(c,{sign:true})}`,

  controls: [
    JuliaControls.randomC,
    JuliaControls.c,
    JuliaControls.k,
  ]

});
