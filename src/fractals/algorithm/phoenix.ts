import { Complex } from './types';
import * as mix from './mixers';
import {
  complex,
} from '../math/complex';
import * as fmt from '../formatting'
import { burningship, phoenix, lookback } from '../math/fractals';


interface PhoenixParams {
  p: [number,number]
  k: number
}

const Phoenix = mix.escape<PhoenixParams>({
  label: 'Phoenix',

  newParams: () => ({p: [-0.5, 0], k: 2}),

  f: ({p, k}) => {
    const pp = complex(p[0], p[1])
    return (c: Complex) => lookback(phoenix(pp, k, c))
  },

  z0: 0,

  latexZ0: 0,

  latexF: ({p, k}) => `z_{n}^{${fmt.num(k)}}+(${fmt.complex(p)})z_{n-1}+x+yi`,

  controls: [
    mix.controls.complex('p'),
    mix.controls.number('k', {step: 0.5}),
  ]
})


interface PhoenixJuliaParams extends PhoenixParams {
  c: [number,number]
}

const PhoenixJulia = mix.escape<PhoenixJuliaParams>({
  label: "Phoenix Julia",

  newParams: () => ({p: [-0.5,0], k: 2, c: [0.5667,0], iter: 40}),

  f: ({p, k, c}) => {
    const pp = complex(p[0], p[1])
    const cc = complex(c[0], c[1])
    return (_:Complex) => lookback(phoenix(pp, k, cc));
  },

  z0: () => (c: Complex) => complex(c.im, c.re),

  latexZ0: () => 'y+xi',

  latexF: ({p, k, c}) => {
    return `z_{n}^{${fmt.num(k)}}+(${fmt.complex(p)})z_{n-1}${fmt.complex(c,{sign:true})}`
  },

  controls: [
    mix.controls.complex('c'),
    mix.controls.complex('p'),
    mix.controls.number('k', {step: 0.5}),
  ]
})



const PhoenixJuliaBurningShip = mix.escape<PhoenixJuliaParams>({
  label: "Phoenix Julia/Burning Ship",

  newParams: () => ({p: [-0.5,0], k: 2, c: [0.6,0]}),

  f: ({p, k, c}: PhoenixJuliaParams) => {
    const pp = complex(p[0], p[1])
    const cc = complex(c[0], c[1])
    const bs = burningship(k)
    const px = phoenix(pp, 1, cc);
    const f = (z: Complex, zp: Complex) => px(bs(z), zp)
    return (_: Complex) => lookback(f);
  },

  z0: () => (c: Complex) => complex(c.im, c.re),

  latexZ0: () => 'y+xi',

  latexF: ({p, k, c}: PhoenixJuliaParams) => {
    return `\\left(|Re(z_{n})|+|Im(z_{n})|\\right)^{${fmt.num(k)}}+(${fmt.complex(p)})z_{n-1}${fmt.complex(c,{sign:true})}`
  },

  controls: [
    mix.controls.complex('c'),
    mix.controls.complex('p'),
    mix.controls.number('k', {step: 0.5}),
  ]
})


export {
  Phoenix,
  PhoenixJulia,
  PhoenixJuliaBurningShip,
}