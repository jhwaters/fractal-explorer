import { Complex, Polar } from './types';
import * as Math from './real';


export function polar(angle: number, radius: number): Polar {
  return {angle, radius};
}

export function fromComplex({re, im}: Complex): Polar {
  return {
    angle: Math.atan2(im, re),
    radius: Math.sqrt(re*re + im*im),
  };
}

export function toComplex(z: Polar): Complex {
  return {
    re: z.radius * Math.cos(z.angle),
    im: z.radius * Math.sin(z.angle),
  };
}

export function neg(z: Polar): Polar {
  return {
    angle: z.angle,
    radius: -z.radius,
  };
}

export function mult(a: Polar, b: Polar): Polar {
  return {
    angle: a.angle + b.angle,
    radius: a.radius * b.radius,
  };
}

export function multReal(a: Polar, b: number): Polar {
  return {angle: a.angle, radius: b* a.radius}
}

export function div(a: Polar, b: Polar): Polar {
  return {
    angle: a.angle - b.angle,
    radius: a.radius / b.radius,
  };
}

export function divReal(a: Polar, b: number): Polar {
  return {angle: a.angle, radius: a.radius / b}
}

export function powReal(z: Polar, k: number): Polar {
  return {angle: z.angle * k, radius: Math.pow(z.radius, k)}
}
