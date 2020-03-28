import { Complex, ControlType, FractalInterface } from '../types';
import { EscapeParams, describeEscapeFunction } from './mixers/escape';
import { BurningShipParams } from './burningship';
import { MandelboxParams } from './mandelbox';
import * as mix from './mixers';
import {
  complex,
  add,
  mult,
  multReal,
  abs2,
  powInt,
  powFloat,
  powReal,
} from '../math/complex';
import { R as Math } from '../math';
import { mandelbox } from '../math/fractals';
import { isInt } from '../math/util';
import { num } from '../formatting'
import { burningship } from '../math/fractals';


interface BSJ {
  k: number
  c: [number,number]
}

export const BurningShip2Julia: FractalInterface<BSJ> = ({
  ...mix.escape.escape({
    label: 'Burning Ship (Julia Remix)',

    create: () => ({k: 2, c: [-1,0]}),

    f: ({k, c}: BSJ) => {
      const cc = complex(c[0], c[1])
      const jl = (z: Complex) => add(powReal(z, k), cc);
      return (s: Complex) => {
        const ss = complex(s.re, -s.im);
        const bs = (z: Complex) => add(powReal(burningship(z), k), ss)
        return (z: Complex) => {
          return jl(bs(z));
        }
      }
    },

    z0: () => () => complex(0, 0),

    latexF: ({k,c}: BSJ) => `((|Re(z)|+|Im(z)|)^{${num(k)}}+x-yi)^{${num(k)}}${num(c[0],{sign:true})}${num(c[1],{sign:true})}i`,

    latexZ0: () => '0',

    controls: [
      {
        type: ControlType.Number,
        label: 'k',
        param: 'k',
        step: 1,
      },
      {
        type: ControlType.Complex,
        label: 'c',
        param: 'c',
        stepAngle: 0.1,
        stepRadius: 0.05,
      },
    ]

  }),
});



interface BurningShipBoxParams extends BurningShipParams, MandelboxParams {}

export const BurningShip2Mandelbox: FractalInterface<BurningShipBoxParams & EscapeParams> = ({
  label: 'Burning Ship (Mandelbox Remix)',

  ...mix.escape.pixel(
    ({a, b, c, k}: BurningShipBoxParams) => {
      const pow = isInt(k) && k > 0 ? powInt : powFloat
      const mbox = mandelbox(a, b, c);
      return (x: Complex) => (z: Complex) => {
        let z1 = multReal(pow(complex(Math.abs(z.re), -Math.abs(z.im)), k), 1/c);
        return add(mbox(z1), x);
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