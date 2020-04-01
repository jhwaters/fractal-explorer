import { Complex, Coeffs } from './types';
import { add, powInt, multReal, toPolar, addPolar } from './complex';
import * as P from './polar';
import { isInt } from './util';


/**
 * { exponent: coefficient }
 * can be object 
 *  {2: 3, 5: 1} => 3z^2 + z^5
 * or array
 *  [1, 0, -3, 5] => z^0 - 3z^2 + 5z^3
 */


function allAreInts(coeffs: Coeffs): boolean {
  for (const k in coeffs) {
    if (!isInt(+k) || +k < 0) return false;
  }
  return true;
}


export default function(coeffs: Coeffs): (z: Complex) => Complex {
  if (allAreInts(coeffs)) {
    return (z: Complex) => {
      let result: Complex = {re: 0, im: 0};
      for (const k in coeffs) {
        result = add(result, multReal(powInt(z, +k), coeffs[k]))
      }
      return result
    }
  } else {
    return (z: Complex) => {
      const p = toPolar(z);
      let result: Complex = {re: 0, im: 0};
      for (const k in coeffs) {
        result = addPolar(result, P.multReal(P.powReal(p, +k), coeffs[k]))
      }
      return result
    }
  } 
}