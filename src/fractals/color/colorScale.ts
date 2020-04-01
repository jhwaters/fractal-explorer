import {
  interpolateLab,
  piecewise,
  scalePow,
} from 'd3';
import { Color } from './types';


function colorScale(color: Color): (domain: [number,number]) => (n: number) => string {
  const interpolator = Array.isArray(color.scheme)
    ? piecewise(interpolateLab, color.scheme)
    : color.scheme;
  const range = color.reverse ? [1, 0] : [0, 1];
  const exponent = 2**color.skew;
  return (domain: [number,number]) => {
    const scale = scalePow().domain(domain).range(range).exponent(exponent);
    return (n: number) => interpolator(scale(n));  
  }
}

function colorMap(color: Color): (domain: [number,number]) => {[k: number]: string} {
  // discrete version
  const cs = colorScale(color);
  return (domain: [number, number]) => {
    const scale = cs(domain);
    if (domain[0] === 0) {
      const result: string[] = [];
      for (let i = domain[0]; i <= domain[1]; i++) {
        result.push(scale(i))
      }
      return result;
    } else {
      const result: {[k: number]: string} = {};
      for (let i = domain[0]; i <= domain[1]; i++) {
        result[i] = scale(i);
      }
      return result;
    }
  }
}


export { colorScale, colorMap }