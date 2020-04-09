import { Complex, ControlType } from './types';
import * as mix from './mixers';
import {
  add,
  complex,
  powInt,
  powN,
  powFloat,
} from '../math/complex';
import { isInt } from '../math/util';
import * as fmt from '../formatting'



export interface MandelbrotParams { k: number }

export const Mandelbrot = mix.escape({
  label: 'Mandelbrot',
  latexF: (p: MandelbrotParams) => `z^{${fmt.num(p.k)}}+x+yi`,
  f: (p: MandelbrotParams) => {
    const k = p.k;
    if (isInt(k)) {
      return (c: Complex) => (z: Complex) => add(powInt(z, k), c);
    } else {
      return (c: Complex) => (z: Complex) => add(powFloat(z, k), c);
    }
  },
  newParams: () => ({k: 2}),
  controls: [
    mix.controls.number('k', {step: 1, min: 0}),
  ],
})

export const MandelbrotJulia = mix.julia<{
  c: [number,number],
  k: number,
}>({
  label: ['Mandelbrot (', {math: 'z^k+c'}, ')'],

  f: ({k,c}) => {
    const cc = complex(c[0], c[1])
    const p = powN(k)
    return (z: Complex) => add(p(z), cc);    
  },

  latexF: ({k,c}) => `z^{${fmt.num(k)}}${fmt.complex(c,{sign:true})}`,

  newParams: () => ({k: 2, c: mix.controls.getRandomC()}),

  controls: [
    mix.controls.randomC('c'),
    mix.controls.complex('c'),
    mix.controls.number('k', {step: 0.5}),
    mix.controls.number('bail', {step: 1, min: 0}),
  ],
});

MandelbrotJulia.label = ['Mandelbrot Julia (', {math: 'z^k+c'}, ')'];