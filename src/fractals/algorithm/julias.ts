import { Complex } from './types';
import {controls, julia} from './mixers';
import {
  complex,
  add,
  powReal,
  exp,
  sqrt,
  sinh,
} from '../math/complex';
import { burningship } from '../math/fractals';
import polynomial from '../math/polynomial';
import * as fmt from '../formatting'


interface JuliaParams {
  k: number
  c: [number, number]
}

export type JPoly = {
  a: number,
  b: number,
  m: number,
  n: number,
  c: [number,number],
}

const Julia2Term = julia<JPoly>({
  label: {math: 'az^m+bz^n+c'},

  f: ({a, b, c, m, n}) => {
    const poly = polynomial({[m]: a, [n]: b});
    const cc = complex(c[0], c[1]);
    return (z: Complex) => add(poly(z), cc);
  },

  latexF: ({a, b, c, m, n}) => {
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
    controls.complex('c'),
    ...['a', 'm', 'b', 'n'].map(p => controls.number(p, {step: p === 'a' || p === 'b' ? 1 : 0.1})),
  ],
})


const JuliaExp = julia<JuliaParams>({
  label: {math: 'e^{z^k}+c'},

  newParams: () => ({k: 3, c: [-0.6,0]}),

  latexF: ({k,c}: JuliaParams) => `e^{z^{${fmt.num(k)}}}${fmt.complex(c,{sign:true})}`,

  f: ({k,c}: JuliaParams) => {
    const cc = complex(c[0], c[1]);
    return (z: Complex) => add(exp(powReal(z, k)), cc);
  },

  controls: [
    controls.randomC('c'),
    controls.complex('c'),
    controls.number('k', {step: 0.5}),
    controls.number('bail', {min: 0, step: 1}),
  ]
})



const JuliaSinh = julia<JuliaParams>({
  label: {math: '\\sqrt{\\sinh(z^{k})}+c'},

  newParams: () => ({k: 2, c: [0.06, 0.12]}),

  latexF: ({k,c}: JuliaParams) => `\\sqrt{\\sinh(z^{${fmt.num(k)}})}${fmt.complex(c,{sign:true})}`,

  f: ({k,c}: JuliaParams) => {
    const cc = complex(c[0], c[1]);
    return (z: Complex) => add(sqrt(sinh(powReal(z, k))), cc);
  },

  controls: [
    controls.randomC('c'),
    controls.complex('c'),
    controls.number('k', {step: 0.5}),
    controls.number('bail', {min: 0, step: 1}),
  ]
})


const JuliaBurningShip = julia<JuliaParams>({
  label: 'Burning Ship',

  newParams: () => ({k: 2, c: [-0.52, -1.1]}),

  f: ({k, c}: JuliaParams) => {
    const cc = complex(c[0], c[1])
    const bs = burningship(k);
    return (z: Complex) => add(bs(z), cc)
  },

  latexF: ({k,c}: JuliaParams) => `(|Re(z)|+|Im(z)|)^{${fmt.num(k)}}${fmt.complex(c,{sign:true})}`,

  controls: [
    controls.randomC('c'),
    controls.complex('c'),
    controls.number('k', {step: 0.5}),
  ]

});

JuliaBurningShip.label = 'Burning Ship Julia'


export {
  Julia2Term,
  JuliaBurningShip,
  JuliaExp,
  JuliaSinh,
}
