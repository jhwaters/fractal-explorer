import { Complex, ControlType, ControlProps } from '../types';
import * as mix from './mixers';
import {
  complex,
  add,
  powInt,
  powFloat,
  exp,
  sqrt,
  sinh,
  mult,
  multReal,
} from '../math/complex';
import polynomial from '../math/polynomial';
import { R as Math } from '../math';
import { isInt } from '../math/util';
import { num } from '../formatting'


function randomC() {
  let angle = Math.PI -2 * Math.asin(Math.pow(Math.random(), 0.9));
  if (Math.random() < 0.5) angle = 2*Math.PI-angle;
  const radius = 0.3 + Math.sin(angle / 2) * 0.6 * (Math.random() * 0.4 + 0.8);
  return [
    Math.round(radius * Math.cos(angle) * 1000) / 1000,
    Math.round(radius * Math.sin(angle) * 1000) / 1000,
  ] as [number, number]
}

export interface JuliaKCParams {
  k: number
  c: [number, number]
}

export const Julia1KC = {
  ...mix.julia.julia<JuliaKCParams>({
    label: 'z^k+c',

    f: (p: JuliaKCParams) => {
      const cc = complex(p.c[0], p.c[1])
      const {k} = p;
      if (isInt(p.k)) {
        return (z: Complex) => add(powInt(z, k), cc);
      } else {
        return (z: Complex) => add(powFloat(z, k), cc);
      } 
    },

    latexF: (p: JuliaKCParams) => `z^{${num(p.k)}}${num(p.c[0],{sign:true})}${num(p.c[1],{sign:true})}i`,

    create: () => ({k: 2, c: randomC()}),

    controls: [
      {
        type: ControlType.Call,
        icon: 'Random',
        //label: 'random',
        onCall: () => ({c: randomC()}),
      },
      {
        type: ControlType.Complex,
        label: 'seed (c)',
        param: 'c',
        stepRadius: 0.05,
        stepAngle: 0.1,
      },
      {
        type: ControlType.Number,
        label: 'exponent (k)',
        param: 'k',
        step: 1,
      },
      {
        type: ControlType.Number,
        label: 'bound',
        param: 'bound',
        step: 5,
        min: 0,
      }
    ],

    settings: [],
  }),
};


export interface JuliaPolyParams {
  a: number,
  b: number,
  m: number,
  n: number,
  c: [number,number],
}


export const Julia1Poly = mix.julia.julia<JuliaPolyParams>({
  label: 'az^m+bz^n+c',

  f: ({a, b, c, m, n}: JuliaPolyParams) => {
    const poly = polynomial({[m]: a, [n]: b});
    const cc = complex(c[0], c[1]);
    return (z: Complex) => add(poly(z), cc);
  },

  latexF: ({a, b, c, m, n}: JuliaPolyParams) => {
    return (
      `${num(a)}z^{${num(m)}}`
      + `${num(b,{sign:true})}z^{${num(n)}}`
      + `${num(c[0],{sign:true})}${num(c[1],{sign:true})}i`
    )
  },

  create: () => ({
    a: -5, m: -2,
    b: 1, n: 1,
    c: [-0.5,0.5],
  }),

  controls: [
    ...['a', 'm', 'b', 'n'].map(p => ({
      type: ControlType.Number,
      param: p,
      label: p,
      step: p === 'a' || p === 'b' ? 1 : 0.1,
    }) as ControlProps),
    {
      type: ControlType.Complex,
      label: 'c',
      param: 'c',
      stepRadius: 0.05,
      stepAngle: 0.1,
    },
  ],
})



export const Julia2 = mix.julia.noParam({
  latexF: 'e^{z^3}-0.6',
  f: (z: Complex) => add(exp(powInt(z, 3)), complex(-0.6, 0)),
})

export const Julia3 = mix.julia.noParam({
  latexF: '\\sqrt{\\sinh(z^2)}+0.06+0.12i',
  f: (z: Complex) => add(sqrt(sinh(mult(z, z))), complex(0.06, 0.12)),
})
