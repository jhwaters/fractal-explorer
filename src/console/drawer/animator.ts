import {
  scaleLinear,
  scalePow,
  scaleLog,
} from 'd3';
import Connected from './connected'
import Disconnected from './disconnected';

/*
export function scaleLinear(domain: [number, number], range: [number,number]) {
  const m = (range[1] - range[0]) / (domain[1] - domain[0])
  const b = range[0] - m*domain[0]
  return (n: number) => m * n + b;
}

export function scalePow(domain: [number, number], range: [number, number], exponent: number) {

}
*/

function scaleZoom(domain: [number, number], range: [number, number], exponent: number=1) {
  const f = range[1] / range[0]
  const r0 = range[0]
  const s = scalePow().domain(domain).range([0,1]).exponent(exponent)
  return (n: number) => r0 * Math.pow(f, s(n));
}


function scalePolar(angle: (n: number) => number, radius: (n: number) => number) {
  return (n: number) => {
    const r = radius(n);
    const a = angle(n);
    return [r*Math.cos(a), r*Math.sin(a)];
  }
}


class Animator {
  domain: [number, number]
  params: {[k: string]: (n: number) => number | [number, number]}
  view: {[k: string]: (n: number) => number}

  constructor(frames: number | [number, number]) {
    this.domain = typeof frames === 'number' ? [1, frames] : frames;
    this.params = {}
    this.view = {}
  }

  scale(
    type: 'linear' | 'pow' | 'log' | 'zoom',
    range: [number,number],
    opts: {
      round?: 'floor' | 'ceil' | 'closest',
      exponent?: number,
      base?: number,
      domain?: [number,number]
    }={}
  ): (n: number) => number {
    if (opts.round) {
      const rounder = 
        opts.round === 'floor' ? Math.floor :
        opts.round === 'ceil' ? Math.ceil :
        Math.round;
      const f = this.scale(type, range, {...opts, round: undefined})
      return (n: number) => rounder(f(n));
    }
    const domain = opts.domain ? opts.domain : this.domain;
    switch (type) {
      case 'linear': return scaleLinear().domain(domain).range(range);
      case 'log': 
        if (opts.base) return scaleLog().domain(domain).range(range).base(opts.base);
        return scaleLog().domain(domain).range(range);
      case 'pow':
        if (opts.exponent) return scalePow().domain(domain).range(range).exponent(opts.exponent);
        return scalePow().domain(domain).range(range);
      case 'zoom':
        return scaleZoom(domain, range, opts.exponent);
      default:
        return scaleLinear().domain(domain).range(range);
    }
  }

  scalePolar({angle, radius}: {angle: (n: number) => number, radius: (n: number) => number}) {
    return scalePolar(angle, radius);
  }

  scaleLinear(range: [number, number]) {
    return scaleLinear().domain(this.domain).range(range);
  }

  scalePow(range: [number, number], exponent: number=2) {
    return scalePow().domain(this.domain).range(range).exponent(exponent);
  }

  scaleLog(range: [number, number], base=10) {
    return scaleLog().domain(this.domain).range(range).base(base)
  }

  scaleZoom(range: [number, number], exponent=1) {
    return scaleZoom(this.domain, range, exponent);
  }

  animate({params, view}: {
    params?: {[k: string]: (n: number) => number | [number,number]},
    view?: {[k: string]: (n: number) => number},
  }) {
    this.params = Object.assign(this.params, params)
    this.view = Object.assign(this.view, view)
  }

  f = () => {
    return (n: number) => {
      const params: {[k: string]: number | [number,number]} = {}
      const view: {[k: string]: number} = {}
      for (const k in this.params) {
        params[k] = this.params[k](n)
      }
      for (const k in this.view) {
        view[k] = this.view[k](n);
      }
      return {params, view};
    }
  }

  apply(x: Connected | Disconnected, opts: {[k: string]: any}={}) {
    const {frames, ...rest} = opts
    const domain = frames ? (
      typeof frames === 'number' ? [frames, frames] :
      frames.length === 1 ? [frames[0], frames[0]] :
      frames
    ) : this.domain;
    return x.animate(domain, rest)(this.f())
  }

}

export default Animator