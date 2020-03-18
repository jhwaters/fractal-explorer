import * as math from 'mathjs';
import {
  Complex,
  complex, 
  abs2, 
  add, 
  subtract as subt,
  multiply as mult,
  divide as div, 
  exp, 
  sqrt, 
  sinh, 
  polynomial,
} from './math'


function pickFunction(s: string): (c: Complex) => (z: Complex) => Complex {
  if (s === 'e^(z^3)-0.6') {
    return (c: Complex) => (z: Complex) => add(
      exp(mult(z, mult(z, z))),
      complex(-0.6, 0),
    )
  }
  if (s === 'sqrt(sinh(z^2))+0.06+0.12i') {
    return (c: Complex) => (z: Complex) => add(sqrt(sinh(mult(z, z))), complex(0.06, 0.12));
  }
  if (s === '(1-z^3/6)/((z-z^2/2)^2)+c') {
    return (c: Complex) => (z: Complex) => {
      const num = subt(complex(1), div(mult(z, mult(z, z)), 3))
      const den = subt(z, div(mult(z, z), 2))
      return add(div(num, mult(den, den)), c)
    }
  }
  if (s === '1-z^2+z^5/(2+4z)+c') {
    return (c: Complex) => (z: Complex) => {
      const A = complex(1)
      const B = mult(z, z);
      const C = mult(z, mult(z, mult(z, mult(z, z))));
      const D = add(complex(2), mult(z, 4))
      return add(subt(add(c, A), B), div(C, D))
    }
  }
  if (s === 'A') {
    return (c: Complex) => {
      const p = polynomial({2: 1});
      const b = complex(-0.8, 0.2);
      return (z: Complex) => add(p(z), b);
    }
  }
  console.log('unknown formula; parsing: ' + s)
  const f = math.parse(s);
  return (c: Complex) => {
    return (z: Complex) => f.evaluate({z, c})
  }
}

export default function({f, bound, iterations}: {f: string, bound: number, iterations: number}) {
  const f1 = pickFunction(f);
  const b2 = bound * bound;
  return (x: number, y: number) => {
    let z = math.complex(x, y);
    const f2 = f1(z);
    let count = 0;
    while (count < iterations) {
      if (abs2(z) < b2) {
        count++;
        z = f2(z) as math.Complex
      } else {
        break;
      }
    }
    return count;
  }
}