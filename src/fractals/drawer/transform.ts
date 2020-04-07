import { Vector, Transform } from './types';

export const rotate = (rad: number): Transform => {
  const co = Math.cos(rad), si = Math.sin(rad);
  return [co, si, -si, co];
}
export const rotateDeg = (deg: number): Transform => rotate(deg * Math.PI / 180);
export const scale = (k: number): Transform => [k, 0, 0, k];
export const scaleX = (k: number): Transform => [k, 0, 0, 1];
export const scaleY = (k: number): Transform => [1, 0, 0, k];

export function invert(t: Transform): Transform | undefined {
  const [a, b, c, d] = t;
  const det = a*d - b*c;
  if (det === 0) {
    console.error('cannot invert matrix - determinant is zero: [' + t.join(',') + ']');
  } else {
    return [d, -b, -c, a].map(n => n/det) as Transform
  }
}

export function apply(t: Transform, pt: Vector): Vector {
  return [
    t[0] * pt[0] + t[2] * pt[1],
    t[1] * pt[0] + t[3] * pt[1],
  ];
}

export function multiply(t1: Transform, t2: Transform): Transform {
  return [
    t1[0]*t2[0] + t1[2]*t2[1],
    t1[1]*t2[0] + t1[3]*t2[1],
    t1[0]*t2[2] + t1[2]*t2[3],
    t1[1]*t2[2] + t1[3]*t2[3],
  ]
}

export function transformed(f: (x: number, y: number) => number, t?: Transform): (x: number, y: number) => number {
  if (t) {
    const [a, b, c, d] = t;
    return (x: number, y: number) => f(
      x*a + y*c,
      x*b + y*d,
    );
  }
  return f;
}