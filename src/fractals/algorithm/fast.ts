import { FractalInterface } from './types';
import { controls } from './mixers'
import { describeEscapeFunction } from './mixers/escape';


export const FastBurningShip: FractalInterface<{iter: number, bail: number}> = {
  label: 'Burning Ship (fast)',

  calc: ({iter, bail}) => (x0: number, y0: number) => {
    let x = 0;
    let y = 0;
    let x2 = 0;
    let y2 = 0;
    let i = 0;
    let b2 = bail * bail;
    while (x2 + y2 < b2 && i < iter) {
      y = 2 * Math.abs(x * y) - y0;
      x = x2 - y2 + x0;
      x2 = x*x;
      y2 = y*y;
      i += 1;
    }
    return i
  },

  range: ({iter, bail}) => [0, iter],

  newParams: () => ({iter: 20, bail: 3}),

  describe: ({iter, bail}) => describeEscapeFunction(
    '\\(|Re(z)|+|Im(z)|\\right)^2+x-yi', 
    '0', 
    bail, 
    iter,
  ),

  controls: [
    controls.number('iter', {min: 1, step: 2}),
    controls.number('bail', {step: 1, min: 0}),
  ],
}

type Complex = [number, number];

function add(a: Complex, b: Complex): Complex {
  return [a[0] + b[0], a[1] + b[1]];
}

function mult(a: Complex, b: Complex): Complex {
  return [a[0]*b[0] - a[1]*b[1], a[0]*b[1] + a[1]*b[0]];
}

function pow2(z: Complex) {
  return mult(z, z);
}

function abs2(z: Complex) {
  return z[0]*z[0] + z[1]*z[1];
}

function absabs(z: Complex): Complex {
  return [Math.abs(z[0]), Math.abs(z[1])];
}
