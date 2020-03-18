import { complex, pow, abs2, add } from './math';

export function mandelbrot(bound: number, iterations: number) {
  const b2 = bound * bound;
  return function(x: number, y: number) {
    let x1 = 0, y1 = 0;
    let x2 = x1 * x1;
    let y2 = y1 * y1;
    let count = 0;
    while (count < iterations) {
      if (x2 + y2 < b2) {
        count++;
        y1 = 2*x1*y1 + y;
        x1 = x2 - y2 + x;
        x2 = x1*x1;
        y2 = y1*y1;
      } else {
        break;
      }
    }
    return count;
  }
}

export function multibrot(power: number, bound: number, iterations: number) {
  const b2 = bound * bound;
  return function(x: number, y: number) {
    let z = complex(0, 0);
    let c = complex(x, y);
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

export default function({bound, iterations, power=2}: {bound: number, iterations: number, power?: number}) {
  if (power === 2) {
    return mandelbrot(bound, iterations)
  } else {
    return multibrot(power, bound, iterations);
  }
}