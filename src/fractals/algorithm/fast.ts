import { FractalInterface } from './types';
import { controls } from './mixers'
import { describeEscapeFunction, DefaultEscapeParams } from './mixers/escape';
import * as fmt from '../formatting';

export const FastBurningShip: FractalInterface<{iter: number, bail: number}> = {
  label: 'Burning Ship *',
  range: ({iter}) => [0, iter],
  newParams: () => ({...DefaultEscapeParams}),
  controls: [
    controls.number('bail', {step: 1, min: 0}),
    controls.number('iter', {min: 1, step: 2}),
  ],
  describe: ({iter, bail}) => describeEscapeFunction(
    '\\(|Re(z)|+|Im(z)|\\right)^2+x-yi', 
    '0', 
    bail, 
    iter,
  ),
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
}

export const FastBurningShipMandelbox: FractalInterface<{
  box1: number
  box2: number
  box3: number
  iter: number
  bail: number
}> = {
  label: 'Burning Ship (Mandelbox Remix) *',
  newParams: () => ({...DefaultEscapeParams, bail: 50, box1: 1, box2: 2, box3: 2.2}),
  range: ({iter}) => [0,iter],
  controls: [
    controls.number('box1', {step: 0.1}),
    controls.number('box2', {step: 0.1}),
    controls.number('box3', {step: 0.1}),
    controls.number('iter', {step: 2, min: 0}),
    controls.number('bail', {step: 1, min: 0}),
  ],
  describe: ({box1, box2, box3, bail, iter}) => [
    'This follows the same algorithm as the Mandelbox fractal, but first applies the function ',
    {
      math: `z \\mapsto \\left(|Re(z)|-|Im(z)|\\right)^{2} \\div ${fmt.num(box3)}`,
      displayMode: true,
    }
  ],
  calc: ({box1, box2, box3, bail, iter}) => {
    const box1a = box1*2;
    const box2a = box2*box2;
    const box2b = 1/box2a;
    const b2 = bail*bail;
    const ma = box3*box2a;
    const box3a = 1/box3;
    const f1 = (n: number) =>  {
      if (n > box1) return box1a - n;
      else if (n < -box1) return -box1a - n;
      else return n;
    }
    return (x0: number, y0: number) => {
      let x = 0, y = 0;
      let x2 = 0, y2 = 0;
      let i = 0;
      while (x2 + y2 < b2 && i < iter) {
        y = f1(-2 * Math.abs(x*y) * box3a);
        x = f1((x2 - y2) * box3a);
        const abso2 = x*x + y*y;
        if (abso2 < box2b) {
          x *= ma
          y *= ma
        } else if (abso2 < 1) {
          x *= box3/abso2;
          y *= box3/abso2;
        } else {
          x *= box3;
          y *= box3;
        }
        x += x0;
        y += y0;
        x2 = x*x;
        y2 = y*y;
        i += 1;
      }
      return i;
    }
  }
}

export const FastJuliaMandelbrot: FractalInterface<{
  c: [number,number],
  iter: number,
  bail: number,
}> = {
  label: ['Mandelbrot Julia (', {math: 'z^2+c'}, ') *'],
  newParams: () => ({c: controls.getRandomC(), ...DefaultEscapeParams}),
  range: ({iter}) => [0,iter],
  controls: [
    controls.randomC('c'),
    controls.complex('c'),
    controls.number('iter', {min: 1, step: 2}),
  ],
  describe: ({c,iter,bail}) => describeEscapeFunction(
    `z^{2}${fmt.complex(c,{sign:true})}`,
    fmt.complex(c),
    bail,
    iter,
  ),
  calc: ({c,iter,bail}) => {
    const [cx,cy] = c;
    const b2 = bail*bail;
    return (x: number, y: number) => {
      let i = 0;
      let x2 = x*x, y2 = y*y;
      while (x2+y2 < b2 && i < iter) {
        y = 2 * x * y + cy;
        x = x2 - y2 + cx;
        x2 = x*x;
        y2 = y*y;
        i += 1;
      }
      return i;
    }
  }
}


export const FastMandelbrot: FractalInterface<{
  iter: number,
  bail: number,
}> = {
  label: ['Mandelbrot (', {math: 'z^2+c'},') *'],
  newParams: () => ({...DefaultEscapeParams}),
  range: ({iter}) => [0,iter],
  controls: [
    controls.number('iter', {min: 1, step: 2}),
  ],
  describe: ({iter,bail}) => describeEscapeFunction(
    `z^{2}+x+yi`,
    '0',
    bail,
    iter,
  ),
  calc: ({iter,bail}) => {
    const b2 = bail*bail;
    return (x0: number, y0: number) => {
      let i = 0;
      let x = 0, y = 0;
      let x2 = 0, y2 = 0;
      while (x2+y2 < b2 && i < iter) {
        y = 2 * x * y + y0;
        x = x2 - y2 + x0;
        x2 = x*x;
        y2 = y*y;
        i += 1;
      }
      return i;
    }
  }
}


export const FastPhoenix: FractalInterface<{
  p: [number,number],
  bail: number,
  iter: number
}> = {
  label: 'Phoenix *',
  newParams: () => ({p: [-0.5,0], ...DefaultEscapeParams}),
  range: ({iter}) => [0,iter],
  controls: [
    controls.complex('p'),
    controls.number('bail', {step: 1, min: 0}),
    controls.number('iter', {min: 1, step: 2}),
  ],
  describe: ({p,iter,bail}) => describeEscapeFunction(
    `z^{2}+(${fmt.complex(p)})z_{n-1}+x+yi`,
    '0',
    bail,
    iter,
  ),
  calc: ({p,bail,iter}) => {
    const [px, py] = p;
    const b2 = bail*bail;
    return (x0: number, y0: number) => {
      let x = x0, y = y0;
      let x_ = 0, y_ = 0;
      let x2 = x*x, y2 = y*y;
      let i = 0;
      while (x2 + y2 < b2 && i < iter) {
        const xn = x2 - y2 + x0 + px*x_ - py*y_;
        const yn = 2 * x * y + y0 + px*y_ + py*x_;
        x_ = x;
        y_ = y;
        y = yn;
        x = xn;
        x2 = x*x;
        y2 = y*y;
        i += 1;
      }
      return i;
    }
  },
}

export const FastPhoenixJulia: FractalInterface<{
  p: [number,number],
  c: [number,number],
  bail: number,
  iter: number
}> = {
  label: 'Phoenix Julia *',
  newParams: () => ({p: [-0.5,0], c: [0.6,0], ...DefaultEscapeParams}),
  range: ({iter}) => [0,iter],
  controls: [
    controls.complex('p'),
    controls.complex('c'),
    controls.number('bail', {step: 1, min: 0}),
    controls.number('iter', {min: 1, step: 2}),
  ],
  describe: ({p,c,iter,bail}) => describeEscapeFunction(
    `z^{2}+(${fmt.complex(p)})z_{n-1}${fmt.complex(c,{sign:true})}`,
    'y+xi',
    bail,
    iter,
  ),
  calc: ({p,c,bail,iter}) => {
    const [cx, cy] = c;
    const [px, py] = p;
    const b2 = bail*bail;
    return (y0: number, x0: number) => {
      let x = x0, y = y0;
      let x_ = 0, y_ = 0;
      let x2 = x*x, y2 = y*y;
      let i = 0;
      while (x2 + y2 < b2 && i < iter) {
        const yn = 2 * x * y + cy + px*y_ + py*x_;
        const xn = x2 - y2 + cx + px*x_ - py*y_;
        x_ = x;
        y_ = y;
        y = yn;
        x = xn;
        x2 = x*x;
        y2 = y*y;
        i += 1;
      }
      return i;
    }
  },
}


export const FastPhoenixBurningShip: FractalInterface<{
  p: [number,number], 
  bail: number,
  iter: number,
}> = {
  label: 'Phoenix/Burning Ship *',
  range: ({iter}) => [0,iter],
  newParams: () => ({p: [-0.5,0], ...DefaultEscapeParams}),
  controls: [
    controls.complex('p'),
    controls.number('bail', {step: 1, min: 0}),
    controls.number('iter', {min: 1, step: 2}),
  ],
  describe: ({p,iter,bail}) => describeEscapeFunction(
    `\\left(|Re(z_{n})|+|Im(z_{n})|\\right)^{2}+(${fmt.complex(p)})z_{n-1}+x-yi`,
    '0',
    bail,
    iter,
  ),
  calc: ({p,bail,iter}) => {
    const [px, py] = p;
    const b2 = bail*bail;
    return (x0: number, y0: number) => {
      let x = 0, y = 0;
      let x_ = 0, y_ = 0;
      let x2 = x*x, y2 = y*y;
      let i = 0;
      while (x2 + y2 < b2 && i < iter) {
        const yn = 2 * Math.abs(x * y) - y0 + px*y_ + py*x_;
        const xn = x2 - y2 + x0 + px*x_ - py*y_;
        x_ = x;
        y_ = y;
        y = yn;
        x = xn;
        x2 = x*x;
        y2 = y*y;
        i += 1;
      }
      return i;
    }
  },
}

export const FastPhoenixJuliaBurningShip: FractalInterface<{
  p: [number,number], 
  c: [number,number],
  bail: number,
  iter: number,
}> = {
  label: 'Phoenix Julia/Burning Ship *',
  range: ({iter}) => [0,iter],
  newParams: () => ({p: [-0.5,0], c: [0.6,0], ...DefaultEscapeParams}),
  controls: [
    controls.complex('p'),
    controls.complex('c'),
    controls.number('bail', {step: 1, min: 0}),
    controls.number('iter', {min: 1, step: 2}),
  ],
  describe: ({p,c,iter,bail}) => describeEscapeFunction(
    `\\left(|Re(z_{n})|+|Im(z_{n})|\\right)^{2}${fmt.complex(c,{sign:true})}+(${fmt.complex(p)})z_{n-1}`,
    'y+xi',
    bail,
    iter,
  ),
  calc: ({p,c,bail,iter}) => {
    const [cx, cy] = c;
    const [px, py] = p;
    const b2 = bail*bail;
    return (y0: number, x0: number) => {
      let x = x0, y = y0;
      let x_ = 0, y_ = 0;
      let x2 = x*x, y2 = y*y;
      let i = 0;
      while (x2 + y2 < b2 && i < iter) {
        const yn = 2 * Math.abs(x * y) + cy + px*y_ + py*x_;
        const xn = x2 - y2 + cx + px*x_ - py*y_;
        x_ = x;
        y_ = y;
        y = yn;
        x = xn;
        x2 = x*x;
        y2 = y*y;
        i += 1;
      }
      return i;
    }
  },
}