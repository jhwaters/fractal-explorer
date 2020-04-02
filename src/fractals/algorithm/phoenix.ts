import { Complex, ControlType } from './types';
import * as mix from './mixers';
import {
  complex,
} from '../math/complex';
import * as fmt from '../formatting'
import { burningship, phoenix, lookback } from '../math/fractals';



interface PhoenixParams {
  p: number
  k: number
  c: [number,number]
}

export const Phoenix = mix.escape<PhoenixParams>({
  label: "Phoenix",

  newParams: () => ({p: -0.5, k: 2, c: [0.5667,0], iter: 40}),

  f: ({p, k, c}: PhoenixParams) => {
    return (_:Complex) => lookback(phoenix(p, k, c));
  },

  z0: () => (c: Complex) => complex(c.im, c.re),

  latexZ0: () => 'y+xi',

  latexF: ({p, k, c}: PhoenixParams) => {
    return `z_{n}^{${fmt.num(k)}}${fmt.complex(c,{sign:true})}${fmt.num(p,{sign:true})}z_{n-1}`
  },

  controls: [
    {
      type: ControlType.Complex,
      param: 'c',
      label: 'c',
      stepRadius: 0.02,
      stepAngle: 0.05,
    },
    {
      type: ControlType.Number,
      param: 'p',
      label: 'p',
      step: 0.1,
    },
    {
      type: ControlType.Number,
      param: 'k',
      label: 'k',
      step: 0.5,
    },
  ]
})



export const PhoenixBurningShip = mix.escape<PhoenixParams>({
  label: "Phoenix/Burning Ship",

  newParams: () => ({p: -0.5, k: 2, c: [0.6,0]}),

  f: ({p, k, c}: PhoenixParams) => {
    const bs = burningship(k)
    const px = phoenix(p, 1, c);
    const f = (z: Complex, zp: Complex) => px(bs(z), zp)
    return (_: Complex) => lookback(f);
  },

  z0: () => (c: Complex) => complex(c.im, c.re),

  latexZ0: () => 'y+xi',

  latexF: ({p, k, c}: PhoenixParams) => {
    return `\\left(|Re(z_{n})|+|Im(z_{n})|\\right)^{${fmt.num(k)}}${fmt.complex(c,{sign:true})}${fmt.num(p,{sign:true})}z_{n-1}`
  },

  controls: [
    {
      type: ControlType.Complex,
      param: 'c',
      label: 'c',
      stepRadius: 0.02,
      stepAngle: 0.05,
    },
    {
      type: ControlType.Number,
      param: 'p',
      label: 'p',
      step: 0.1,
    },
    {
      type: ControlType.Number,
      param: 'k',
      label: 'k',
      step: 0.5,
    },
  ]
})
