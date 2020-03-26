import { Complex, ControlType } from '../types';
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
} from '../math/complex';
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


export const Julia2 = mix.julia.noParam({
  latexF: 'e^{z^3}-0.6',
  f: (z: Complex) => add(exp(powInt(z, 3)), complex(-0.6, 0)),
})

export const Julia3 = mix.julia.noParam({
  latexF: '\\sqrt{\\sinh(z^2)}+0.06+0.12i',
  f: (z: Complex) => add(sqrt(sinh(mult(z, z))), complex(0.06, 0.12)),
})


