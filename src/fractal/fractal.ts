import {
  Complex,
  complex,
  abs2,
  add,
  multiply as mult,
  pow,
} from './math';


type ComplexFunction = (z: Complex) => Complex

function latex(n: number, withsign: boolean=false): string {
  if (withsign && n < 0) {
    return '+' + latex(n, false)
  } else {
    return (+(n.toFixed(6))).toString()
  }
}

interface FractalAlgorithm {
  z0: (x: number, y: number) => Complex
  f: (x: number, y: number) => ComplexFunction
  latex?: string
}

export function escapeTime({bound, iterations}: {
  bound: number, 
  iterations: number,
}) {
  const b2 = bound * bound;
  return ({z0, f}: {z0: Complex, f: ComplexFunction}) => {
    let k = 0;
    let z = z0;
    while (k < iterations && abs2(z) < b2) {
      k += 1;
      z = f(z);
    }
    return k;
  }
}

export function flipper({flipX, flipY}: {flipX?: boolean, flipY?: boolean}) {
  if (flipX) {
    if (flipY) {
      return (x: number, y: number) => [-x, -y]
    } else {
      return (x: number, y: number) => [-x, y]
    }
  } else {
    if (flipY) {
      return (x: number, y: number) => [x, -y]
    } else {
      return (x: number, y: number) => [x, y]
    }
  }
}

export function mandelbrot({power=2}: {power?: number}): FractalAlgorithm {
  return {
    z0: (x: number, y: number) => ({re: 0, im: 0}),
    f: (x: number, y: number) => {
      const c = complex(x, y);
      return (z: Complex) => add(pow(z, power), c)
    },
    latex: `z^{${power}}+x+yi`,
  }
}

export function burningship({power=2}: {power?: number}): FractalAlgorithm {
  return {
    z0: (x: number, y: number) => ({re: 0, im: 0}),
    f: (x: number, y: number) => {
      const c = complex(x, y);
      return (z: Complex) => add(pow({re: Math.abs(z.re), im: Math.abs(z.im)}, power), c)
    },
    latex: `\\left(|Re(z)|+|Im(z)|\\right)^{${power}}+x+yi`,
  }
}

export function juliaSimple({c, power=2}: {c: {x: number, y: number}, power?: number}) {
  const cc = complex(c.x, c.y);
  return {
    z0: (x: number, y: number) => complex(x, y),
    f: (x: number, y: number) => (z: Complex) => add(pow(z, power), cc),
    latex: `z^{${power}}${latex(cc.re,true)}${latex(cc.im,true)}i`,
  }
}