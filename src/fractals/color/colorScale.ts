import {
  interpolateLab,
  piecewise,
  scalePow,
  scaleLinear,
} from 'd3';
import { Color } from './types';


function colorScale(color: Color): (domain: [number,number]) => (n: number) => string {
  const interpolator = Array.isArray(color.scheme)
    ? piecewise(interpolateLab, color.scheme)
    : color.scheme;
  const range = color.reverse ? [1, 0] : [0, 1];
  const exponent = 2**color.skew;
  if (color.mirror) {
    const scaleA = scaleLinear().domain([0,0.5]).range([0,1]);
    const scaleB = scaleLinear().domain([0.5,1]).range([1,0]);
    return (domain: [number,number]) => {
      const scale1 = scalePow().domain(domain).range(range).exponent(exponent);
      const scale2 = (n: number) => {
        if (n < 0.5) return scaleA(n);
        else return scaleB(n);
      }
      return (n: number) => interpolator(scale2(scale1(n)));  
    }
  }
  return (domain: [number,number]) => {
    const scale = scalePow().domain(domain).range(range).exponent(exponent);
    return (n: number) => interpolator(scale(n));  
  }
}

type ColorRGBA = [number, number, number, number] & Uint8ClampedArray

function colorMap(color: Color): (domain: [number,number]) => ColorRGBA[] {
  // discrete version
  const cs = colorScale(color);
  const ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
  return (domain: [number, number]) => {
    if (domain[0] === 0) {
      const scale = cs(domain);
      const result: ColorRGBA[] = [];
      for (let i = 0; i <= domain[1]; i++) {
        ctx.fillStyle = scale(i);
        ctx.fillRect(0,0,1,1);
        const rgba = ctx.getImageData(0,0,1,1).data as ColorRGBA;
        result.push(rgba)
      }
      return result;
    } else {
      const d0 = domain[0]
      const dd = domain[1] - d0;
      const scale = cs([0, dd]);
      const result: ColorRGBA[] = [];
      for (let i = 0; i <= dd; i++) {
        ctx.fillStyle = scale(i % (dd+1));
        ctx.fillRect(0,0,1,1);
        const rgba = ctx.getImageData(0,0,1,1).data as ColorRGBA;
        result.push(rgba);
      }
      return result;
    }
  }
}


export { colorScale, colorMap }