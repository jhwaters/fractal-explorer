import { Complex } from '../math/types';
import { abs2 } from '../math/complex';


export default function(bail: number, iterations: number) {
  const b2 = bail * bail;
  return (
    f: (n: Complex) => Complex,
    z0: Complex = {re: 0, im: 0}, 
  ) => {
    let k = 0;
    let z = z0;
    while (k < iterations && abs2(z) < b2) {
      k += 1;
      z = f(z);
    }
    return k;
  }
}