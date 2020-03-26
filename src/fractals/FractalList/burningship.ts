import { Complex, ControlType, ControlProps } from '../types';
import * as mix from './mixers';
import {
  add,
  powInt,
  powFloat,
} from '../math/complex';
import { R as Math } from '../math';
import { isInt } from '../math/util';
import { num } from '../formatting'



export interface BurningShipParams { k: number }

function absabs(z: Complex) {
  return {re: Math.abs(z.re), im: Math.abs(z.im)};
}

export const BurningShip1 = mix.escape.escape<BurningShipParams>({
  label: 'Burning Ship',
  latexF: (p: BurningShipParams) => `\\left(|Re(z)|+|Im(z)|\\right)^{${num(p.k)}}+x-yi`,
  f: (p: BurningShipParams) => {
    const k = p.k;
    if (isInt(k)) {
      return (c: Complex) => {
        const cc = {re: c.re, im: -c.im}
        return (z: Complex) => add(powInt(absabs(z), k), cc);
      }
    } else {
      return (c: Complex) => {
        const cc = {re: c.re, im: -c.im}
        return (z: Complex) => add(powFloat(absabs(z), k), cc);
      }
    }
  },
  create: () => ({k: 2}),
  controls: [
    {
      type: ControlType.Number,
      label: 'exponent (k)',
      param: 'k',
      step: 1,
      min: 0,
    }
  ] as ControlProps[],
})



const BurningShip2 = mix.escape.escape<BurningShipParams>({
  label: 'Burning Ship II',
  latexF: (p: BurningShipParams) => `\\left(|Re(z)|+|Im(z)|\\right)^{${num(p.k)}}+x-yi`,
  f: (p: BurningShipParams) => {
    const k = p.k;
    if (isInt(k)) {
      return (c: Complex) => {
        const cc = {re: c.re, im: -c.im}
        return (z: Complex) => add(powInt(absabs(z), k), cc);
      }
    } else {
      return (c: Complex) => {
        const cc = {re: c.re, im: -c.im}
        return (z: Complex) => add(powFloat(absabs(z), k), cc);
      }
    }
  },
  create: () => ({k: 2}),
  controls: [
    {
      type: ControlType.Number,
      label: 'exponent (k)',
      param: 'k',
      step: 1,
      min: 0,
    }
  ] as ControlProps[],
})

