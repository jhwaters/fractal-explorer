import Connected from './connected'
import Disconnected from './disconnected';
import createScale, { ScaleSpec, MappedSpec, Scale, PolarSpec } from './scales';


type ParamType = number | [number,number] | [number,number,number,number]

interface NoDomScale {
  scale?: 'linear' | 'log' | 'pow' | 'zoom'
  range: [number, number]
  exponent?: number
  base?: number
}

interface NoDomMapped<T> extends NoDomScale {
  map: (n: number) => T
}

type RangeOnly = [number, number]

interface MyPolar {
  angle?: number | RangeOnly | NoDomScale | NoDomMapped<number>
  radius?: number | RangeOnly | NoDomScale | NoDomMapped<number>
}

type MySpec<T> = RangeOnly | NoDomScale | NoDomMapped<T> | MyPolar

function isRangeOnly<T>(spec: MySpec<T>): spec is RangeOnly {
  return Array.isArray(spec);
}

function fixRangeOnly(spec: RangeOnly, domain: [number, number]): ScaleSpec {
  return {scale: 'linear', domain, range: spec};
}

function addDomain(spec: NoDomScale, domain: [number, number]): ScaleSpec;
function addDomain<T>(spec: NoDomMapped<T>, domain: [number, number]): MappedSpec<T>;
function addDomain<T>(spec: NoDomScale | NoDomMapped<T>, domain: [number, number]) {
  return {domain, ...spec};
}

function fixPolar(spec: MyPolar, domain: [number, number], init: [number, number]): PolarSpec {
  const [x, y] = init;
  return {
    angle:
      spec.angle === undefined ? Math.atan2(y, x) : 
      typeof spec.angle === 'number' ? spec.angle :
      isRangeOnly(spec.angle) ? fixRangeOnly(spec.angle, domain) :
      addDomain(spec.angle, domain),
    radius:
      spec.radius === undefined ? Math.sqrt(x*x + y*y) : 
      typeof spec.radius === 'number' ? spec.radius : 
      isRangeOnly(spec.radius) ? fixRangeOnly(spec.radius, domain) :
      addDomain(spec.radius, domain),
  };
}

function isPolar<T>(spec: MySpec<T>): spec is MyPolar {
  return !isRangeOnly(spec) && !('range' in spec);
}

type Target = Connected | Disconnected;

class Animator {
  domain: [number, number]
  params: {[k: string]: MySpec<ParamType>}
  view: {[k: string]: MySpec<ParamType>}

  constructor(frames: number | [number, number]) {
    this.domain = typeof frames === 'number' ? [1, frames] : frames;
    this.params = {}
    this.view = {}
  }

  makeScales(target: Target) {
    const currentParams = target.getParams();
    const currentView = target.getView() as {[k: string]: any};
    const params: {[k: string]: Scale<ParamType>} = {}
    const view: {[k: string]: Scale<ParamType>} = {}
    
    for (const [k, spec] of Object.entries(this.params)) {
      if (isPolar(spec)) {
        const init = currentParams[k];
        if (Array.isArray(init) && typeof init[0] === 'number' && typeof init[1] == 'number') {
          params[k] = createScale(fixPolar(spec, this.domain, init as [number,number]))
        }
      }
      else if (isRangeOnly(spec)) {
        params[k] = createScale(fixRangeOnly(spec, this.domain))
      }
      else {
        params[k] = createScale(addDomain(spec, this.domain));
      }
    }
    for (const [k, spec] of Object.entries(this.view)) {
      if (isPolar(spec)) {
        const init = currentView[k];
        if (Array.isArray(init) && typeof init[0] === 'number' && typeof init[1] == 'number') {
          view[k] = createScale(fixPolar(spec, this.domain, init as [number,number]))
        }
      }
      else if (isRangeOnly(spec)) {
        view[k] = createScale(fixRangeOnly(spec, this.domain))
      }
      else {
        view[k] = createScale(addDomain(spec, this.domain));
      }
    }
    return {params, view};
  }

  f = (target: Target) => {
    const scales = this.makeScales(target);
    return (i: number) => {
      const params: {[k: string]: ParamType} = {};
      const view: {[k: string]: ParamType} = {};
      for (const [k, scale] of Object.entries(scales.params)) {
        params[k] = scale(i);
      }
      for (const [k, scale] of Object.entries(scales.view)) {
        view[k] = scale(i)
      }
      return {params, view};
    }
  }
  
  animate({params, view}: {
    params?: {[k: string]: MySpec<ParamType>},
    view?: {[k: string]: MySpec<ParamType>},
  }) {
    this.params = Object.assign(this.params, params)
    this.view = Object.assign(this.view, view)
    return this;
  }

  apply = (target: Target, opts: {[k: string]: any}={}) => {
    const {frames, ...rest} = opts
    const domain = frames ? (
      typeof frames === 'number' ? [frames, frames] :
      frames.length === 1 ? [frames[0], frames[0]] :
      frames
    ) : this.domain;
    return target.animate(domain, rest)(this.f(target))
  }

}

export default Animator