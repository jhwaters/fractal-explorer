import { Complex, Polar } from './types';
import * as P from './polar';
import * as Math from './real';


export function complex(re: number, im: number): Complex {
  return {re, im}
}

export function conjugate(z: Complex) {
  return {re: z.re, im: -z.im}
}

export function fromPolar({angle, radius}: Polar) {
  return {
    re: radius * Math.cos(angle),
    im: radius * Math.sin(angle),
  }
}

export function toPolar(z: Complex): Polar {
  return {
    angle: Math.atan2(z.im, z.re),
    radius: Math.sqrt(z.re*z.re + z.im*z.im),
  }
}

export function neg(a: Complex): Complex {
  return {re: -a.re, im: -a.im}
}


// Addition

export function add(a: Complex, b: Complex): Complex {
  return {re: a.re+b.re, im: a.im+b.im}
}

export function addReal(a: Complex, b: number): Complex {
  return {re: a.re + b, im: a.im}
}

export function addPolar(a: Complex, b: Polar): Complex {
  return add(a, fromPolar(b))
}


// Subtraction

export function subt(a: Complex, b: Complex): Complex {
  return {re: a.re - b.re, im: a.im - b.im}
}

export function subtReal(a: Complex, b: number): Complex {
  return {re: a.re - b, im: a.im}
}

export function subtPolar(a: Complex, b: Polar): Complex {
  return subt(a, fromPolar(b))
}


// Multiplication

export function mult(a: Complex, b: Complex): Complex {
  return {
    re: a.re*b.re - a.im*b.im,
    im: a.re*b.im + a.im*b.re,
  }
}

export function multReal(a: Complex, b: number): Complex {
  return {re: b * a.re, im: b * a.im}
}

export function multPolar(a: Complex, b: Polar): Complex {
  return mult(a, fromPolar(b))
}


// Division

export function div(a: Complex, b: Complex): Complex {
  const d = abs2(b);
  return {
    re: (a.re * b.re + a.im * b.im) / d,
    im: (a.im * b.re - a.re * b.im) / d,
  }
}

export function divReal(a: Complex, b: number): Complex {
  return {re: a.re / b, im: a.im / b}
}

export function divPolar(a: Complex, b: Polar): Complex {
  return fromPolar(P.div(toPolar(a), b))
}


// Exponentiation

export function exp(z: Complex): Complex {
  return fromPolar({radius: Math.exp(z.re), angle: z.im})
}

export function powFloat(z: Complex, k: number): Complex {
  return fromPolar(P.powReal(toPolar(z), k))
}

export function powInt(z: Complex, k: number): Complex {
  if (k < 0) return div(complex(1, 0), powInt(z, -k))
  if (k === 0) return complex(1, 0)
  if (k === 1) return z
  if (k === 2) return mult(z, z)
  if (k === 3) return mult(mult(z, z), z)
  if (k === 4) return mult(mult(mult(z, z), z), z)
  if (k === 5) return mult(mult(mult(mult(z, z), z), z), z)
  if (k === 6) return mult(mult(mult(mult(mult(z, z), z), z), z), z)
  if (k === 7) return mult(mult(mult(mult(mult(mult(z, z), z), z), z), z), z)
  if (k === 8) return mult(mult(mult(mult(mult(mult(mult(z, z), z), z), z), z), z), z)
  return powFloat(z, k)
}

export function powReal(z: Complex, k: number): Complex {
  return powInt(z, k);
}


// Other

export function abs2(z: Complex): number {
  return z.re * z.re + z.im * z.im;
}

export function abs(z: Complex): number {
  return Math.sqrt(abs2(z));
}

export function angle(z: Complex): number {
  return Math.atan2(z.im, z.re);
}

export function sqrt(z: Complex): Complex {
  const angle = Math.atan2(z.im, z.re);
  return fromPolar({
    angle: angle / 2,
    radius: Math.sqrt(abs(z))
  })
}

export function sinh(z: Complex): Complex {
  return divReal(subt(exp(z), exp(neg(z))), 2)
}
