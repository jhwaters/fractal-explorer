import { abs2, add, pow, complex } from './math';


export function randomC() {
  let angle = Math.PI -2 * Math.asin(Math.pow(Math.random(), 0.9));
  if (Math.random() < 0.5) angle = 2*Math.PI-angle;
  const radius = 0.3 + Math.sin(angle / 2) * 0.6 * (Math.random() * 0.4 + 0.8);
  return {
    x: Math.round(radius * Math.cos(angle) * 1000) / 1000,
    y: Math.round(radius * Math.sin(angle) * 1000) / 1000,
  }
}

export function juliaQuadratic(seedX: number, seedY: number, bound: number, iterations: number) {
  const b2 = bound * bound;
  const im = seedY;
  const re = seedX;
  return (x: number, y: number) => {
    let x1 = x, y1 = y;
    let x2 = x1 * x1;
    let y2 = y1 * y1;
    let count = 0;
    while (count < iterations) {
      if (x2 + y2 < b2) {
        count++;
        y1 = 2*x1*y1 + im;
        x1 = x2 - y2 + re;
        x2 = x1*x1;
        y2 = y1*y1;
      } else {
        break;
      }
    }
    return count;
  }
}

export function juliaQuadraticX(seedX: number, seedY: number, power: number, bound: number, iterations: number) {
  const b2 = bound * bound;
  const c = complex(seedX, seedY)
  return (x: number, y: number) => {
    let z = complex(x, y)
    let count = 0;
    while (count < iterations) {
      if (abs2(z) < b2) {
        count++;
        z = add(pow(z, power), c)
      } else {
        break;
      }
    }
    return count;
  }
}

export default function({c, bound, iterations, power=1}: {
  c: {x: number, y: number}, 
  bound: number, 
  iterations: number,
  power?: number
}) {
  if (power === 2) {
    return juliaQuadratic(c.x, c.y, bound, iterations);
  } else {
    return juliaQuadraticX(c.x, c.y, power, bound, iterations);
  }
}
