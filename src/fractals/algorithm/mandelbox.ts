import { FractalInterface, Complex, ControlType, ControlProps } from './types';
import { DefaultEscapeParams, describeEscapeFunction } from './mixers/escape';
import * as mix from './mixers';
import { add, complex } from '../math/complex';
import { R as Math } from '../math';
import { mandelbox, burningship } from '../math/fractals';
import * as fmt from '../formatting';
import * as ctrl from './mixers/controls';

function randomParams() {
  return {box3: Math.round(Math.random() * 20)/10 + 2}
}


const mandelboxFlatex = (v: number) => (
  '\\left\\{\\begin{aligned}'
  + `${fmt.num(2*v)} - n &, \\text{ if \$n > ${fmt.num(v)}\$}\\\\`
  + `${fmt.num(-2*v)} - n &, \\text{ if \$n < ${fmt.num(-v)}\$}\\\\`
  + 'n &, \\text{ otherwise}'
  + '\\end{aligned}\\right.'
);

const mandelboxAlatex = 'f(Re(z))+f(Im(z))i';

const mandelboxBlatex = (v: number) => (
  '\\left\\{\\begin{aligned}'
  + `${fmt.num(2*v)}z &, \\text{ if \$|z|<${fmt.num(1/v)}\$}\\\\`
  + `z \\div |z|^2 &, \\text{ if \$${fmt.num(1/v)} \\leq |z| < 1\$}\\\\`
  + 'z &, \\text{ otherwise}\\\\'
  + '\\end{aligned}\\right.'
)

const mandelboxClatex = (v: number) => fmt.num(v) + '\\cdot B(A(z)) + x + yi';


export function describeMandelbox(a: number, b: number, c: number, bail: number, iter: number) {
  return [
    {
      math: 'f_{\\mathbb{R}\\mapsto\\mathbb{R}}(n) =' + mandelboxFlatex(a),
      displayMode: true,
    },
    {
      math: 'A_{\\mathbb{C}\\mapsto\\mathbb{C}}(z) =' + mandelboxAlatex,
      displayMode: true,
    },
    {
      math: 'B_{\\mathbb{C}\\mapsto\\mathbb{C}}(z) =' + mandelboxBlatex(b),
      displayMode: true,
    },
    ...describeEscapeFunction(
      mandelboxClatex(c),
      '0',
      bail,
      iter,
    )
  ]
}


const MandelboxRandom = ({
  type: ControlType.Call,
  icon: 'Random',
  onCall: () => randomParams(),
}) as ControlProps


export interface MandelboxParams {
  box1: number,
  box2: number,
  box3: number,
}

export const FastMandelbox: FractalInterface<{
  box1: number
  box2: number
  box3: number
  iter: number
  bail: number
}> = {
  label: 'Mandelbox *',
  newParams: () => ({box1: 1, box2: 2, box3: 2, ...DefaultEscapeParams}),
  range: ({iter}) => [0,iter],
  controls: [
    MandelboxRandom,
    mix.controls.number('box1', {step: 0.1}),
    mix.controls.number('box2', {step: 0.1}),
    mix.controls.number('box3', {step: 0.1}),
    mix.controls.number('iter', {min: 0, step: 2}),
    mix.controls.number('bail', {min: 0, step: 1}),
  ],
  describe: ({box1, box2, box3, iter, bail}) => describeMandelbox(box1, box2, box3, bail, iter),
  calc: ({box1, box2, box3, iter, bail}) => {
    const box1a = box1*2;
    const box2a = box2*box2;
    const box2b = 1/box2a;
    const b2 = bail*bail;
    const ma = box3*box2a;
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
        x = f1(x);
        y = f1(y);
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


export const FastMandelcorner: FractalInterface<{
  box1: number
  box2: number
  box3: number
  iter: number
  bail: number
}> = {
  label: 'Mandelcorner *',
  newParams: () => ({box1: 1, box2: 2, box3: 2, ...DefaultEscapeParams}),
  range: ({iter}) => [0,iter],
  controls: [
    MandelboxRandom,
    mix.controls.number('box1', {step: 0.1}),
    mix.controls.number('box2', {step: 0.1}),
    mix.controls.number('box3', {step: 0.1}),
    mix.controls.number('iter', {min: 0, step: 2}),
    mix.controls.number('bail', {min: 0, step: 1}),
  ],
  describe: ({box1, box2, box3}) =>  ['Mandelbox(' + [box1, box2, box3].map(v => fmt.num(v)).join(',') + ') -> Burning Ship'],
  calc: ({box1, box2, box3, iter, bail}) => {
    const box1a = box1*2;
    const box2a = box2*box2;
    const box2b = 1/box2a;
    const b2 = bail*bail;
    const ma = box3*box2a;
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
        x = f1(x);
        y = f1(y);
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
        x = Math.abs(x) + x0;
        y = Math.abs(y) + y0;
        x2 = x*x;
        y2 = y*y;
        i += 1;
      }
      return i;
    }
  }
}