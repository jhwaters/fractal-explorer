import { pow, add, complex, abs2 } from './math';

function burningship(bound: number, iterations: number, flip: boolean=true) {
  const b2 = bound * bound;
  return function(x: number, y: number) {
    if (flip) {
      y = -y;
    }
    let x1 = x, y1 = y;
    let x2 = x1 * x1;
    let y2 = y1 * y1;
    let count = 0;
    while (count < iterations) {
      if (x2 + y2 < b2) {
        count++;
        y1 = Math.abs(2*x1*y1) + y;
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

function burningshipX(
  power: number, 
  bound: number, 
  iterations: number, 
  flip: boolean=true
) {
  const b2 = bound * bound;
  return function(x: number, y: number) {
    if (flip) {
      y = -y;
    }
    let z = complex(0, 0)
    const c = complex(x, y)
    let count = 0;
    while (count < iterations) {
      if (abs2(z) < b2) {
        count++;
        z = add(pow(complex(Math.abs(z.re), Math.abs(z.im)), power), c)
      } else {
        break;
      }
    }
    return count;
  }
}

export default function({power, bound, iterations, flip=true}: {
  power: number, 
  bound: number, 
  iterations: number, 
  flip?: boolean
}) {
  if (power === 2) {
    return burningship(bound, iterations, flip);
  } else {
    return burningshipX(power, bound, iterations, flip);
  }
}