import { Complex, ControlType } from './types';
import * as mix from './mixers';
import {
  add,
  powInt,
  powFloat,
  multReal,
  addReal,
  div,
  mult,
} from '../math/complex';
import { isInt } from '../math/util';
import * as fmt from '../formatting'



export interface MagnetParams {
  k: number,
}

const Magnet1 = mix.escape({
  label: 'Magnet Type I',

  f: ({k}: MagnetParams) => {
    const pow = isInt(k) && k > 0 ? powInt : powFloat
    return (c: Complex) => {
      //const c = complex(x, y);
      const a = addReal(c, -1);
      const b = addReal(c, -2);
      return (z: Complex) => pow(div(
        add(powInt(z, 2), a),
        add(multReal(z, 2), b)
      ), k)
    }
  },

  latexF: ({k}: MagnetParams) => '\\left(\\frac{z^2 + x+yi - 1}{2z + x+yi - 2}\\right)^{' + fmt.num(k) + '}',

  newParams: () => ({k: 2}),

  controls: [
    {
      type: ControlType.Number,
      param: 'k',
      label: 'exponent',
      step: 0.5,
    },
    {
      type: ControlType.Number,
      param: 'bail',
      label: 'bound',
      step: 5,
      min: 0,
    },
  ],
})

export interface Magnet2Params {k: number}

const Magnet2 = mix.escape({
  label: 'Magnet Type II',

  newParams: () => ({k: 2}),

  f: ({k}: Magnet2Params) => {
    const pow = isInt(k) && k > 0 ? powInt : powFloat
    return (c: Complex) => {
      //const c = complex(x, y);
      const a = addReal(c, -1);
      const b = addReal(c, -2);
      const a3 = multReal(a, 3);
      const b3 = multReal(b, 3);
      const ab = mult(a, b)
      return (z: Complex) => pow(div(
        add(add(powInt(z, 3), mult(a3, z)), ab),
        add(add(multReal(powInt(z, 2), 3), mult(b3, z)), addReal(ab, 1))
      ), k)
    }
  },

  latexF: ({k}: Magnet2Params) => ('\\left(\\frac' 
  + '{z^3 + 3(x+yi-1)z + (x+yi-1)(x+yi-2)}' 
  + '{3z^2 + 3(x+yi-2)z + (x+yi-1)(x+yi-2) + 1}' 
  + '\\right)^{' + fmt.num(k) + '}'
  ),

  controls: [
    {
      type: ControlType.Number,
      param: 'k',
      label: 'exponent',
      step: 0.5,
    },
    {
      type: ControlType.Number,
      param: 'bail',
      label: 'bound',
      step: 5,
      min: 0,
    },
  ]
})


export { Magnet1, Magnet2 }