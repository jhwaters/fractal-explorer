import {
  interpolateLab,
  piecewise,
  scalePow,
  ScalePower,
} from 'd3';


class ColorScale {
  interpolator: (n: number) => string
  skew: number
  reverse: boolean

  constructor(interpolator: (n: number) => string, {skew, reverse}: {
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

  scale(domain?: [number,number]): (n: number) => string {
    const scale = this.createScaler(domain);
    return (n: number) => this.interpolator(scale(n));
  }

  discreteScale(domain?: [number, number]): string[] {
    const scale = this.createScaler(domain);
    const result: string[] = Array(1 + Math.abs(scale.domain()[1] - scale.domain()[0]));
    for (let i = scale.domain()[0]; i <= scale.domain()[1]; i++) {
      result[i] = this.interpolator(scale(i));
    }
    return result;
  }
}

export default ColorScale