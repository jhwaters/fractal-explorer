import {
  interpolateLab,
  piecewise,
  scalePow,
  ScalePower,
} from 'd3';
import { ColorInterpolator } from '../types';


class ColorScale {
  interpolator: ColorInterpolator
  skew: number
  reverse: boolean

  constructor(interpolator: ColorInterpolator, {skew, reverse}: {
    reverse?: boolean,
    skew?: number,
  }={}) {
    this.interpolator = interpolator;
    this.reverse = reverse || false;
    this.skew = skew || 0;
  }

  static piecewise(colors: string[], opts?: {skew?: number, reverse?: boolean}) {
    return new ColorScale(piecewise(interpolateLab, colors), opts)
  }

  createScaler(domain?: [number, number]): ScalePower<number,number> {
    const scale = scalePow()
      .domain(domain || [0,1])
      .range(this.reverse ? [1, 0] : [0, 1])
    if (this.skew) {
      scale.exponent(2**this.skew);
    }
    return scale;
  }

  createMap(domain?: [number, number]): string[] {
    const scale = this.createScaler(domain);
    const result: string[] = Array(1 + Math.abs(scale.domain()[1] - scale.domain()[0]));
    for (let i = scale.domain()[0]; i <= scale.domain()[1]; i++) {
      result[i] = this.interpolator(scale(i));
    }
    return result;
  }
}

export default ColorScale