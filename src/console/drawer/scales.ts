import {
  scaleLinear,
  scalePow,
  scaleLog,
} from 'd3';


export type Scale<T> = (i: number) => T

function scaleZoom(
  domain: [number, number], 
  range: [number, number], 
  exponent: number=1,
): Scale<number> {
  const f = range[1] / range[0]
  const r0 = range[0]
  const s = scalePow().domain(domain).range([0,1]).exponent(exponent)
  return (n: number) => r0 * Math.pow(f, s(n));
}

interface CommonSpec {
  scale?: 'linear' | 'log' | 'pow' | 'zoom'
  domain: [number, number]
  range: [number, number]
  exponent?: number
  base?: number
}

export interface ScaleSpec extends CommonSpec {}

function baseScale(spec: ScaleSpec): Scale<number> {
  if (spec.scale === 'linear') {
    return scaleLinear().domain(spec.domain).range(spec.range);
  }
  if (spec.scale === 'log') {
    return scaleLog().domain(spec.domain).range(spec.range).base(spec.base || 10);
  }
  if (spec.scale === 'pow') {
    return scalePow().domain(spec.domain).range(spec.range).exponent(spec.exponent || 2);
  }
  if (spec.scale === 'zoom') {
    return scaleZoom(spec.domain, spec.range, spec.exponent || 2);
  }
  return scaleLinear().domain(spec.domain).range(spec.range);
}

export interface MappedSpec<T> extends CommonSpec {
  map: (n: number) => T
}

function mappedScale<T>(spec: MappedSpec<T>): Scale<T> {
  const a = baseScale(spec);
  return (n: number) => spec.map(a(n));
}

function makeScale<T>(spec: ScaleSpec): Scale<number>;
function makeScale<T>(spec: MappedSpec<T>): Scale<T>;
function makeScale<T>(spec: ScaleSpec | MappedSpec<T>) {
  if ('map' in spec) return mappedScale(spec);
  else return baseScale(spec);
}

export interface PolarSpec {
  angle: number | ScaleSpec | MappedSpec<number>
  radius: number | ScaleSpec | MappedSpec<number>
}

function polarScale(spec: PolarSpec): Scale<[number,number]> {
  const {angle, radius} = spec;
  const ang: (n: number) => number = typeof angle === 'number' ? (n: number) => angle : makeScale(angle);
  const rad: (n: number) => number = typeof radius === 'number' ? (n: number) => radius : makeScale(radius);
  return (n: number) => {
    const a = ang(n);
    const r = rad(n);
    return [r * Math.cos(a), r * Math.sin(a)];
  }
}

export type Spec<T> = ScaleSpec | MappedSpec<T> | PolarSpec;


function createScale<T>(spec: ScaleSpec): Scale<number>;
function createScale<T>(spec: PolarSpec): Scale<[number,number]>;
function createScale<T>(spec: MappedSpec<T>): Scale<T>;
function createScale<T>(spec: Spec<T>) {
  if ('range' in spec) {
    return makeScale(spec);
  } else {
    return polarScale(spec);
  }
}

export default createScale