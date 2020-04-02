import {
  FractalInterface,
  Complex,
  ControlProps,
  StringWithMath,
} from '../types'
import baseFractalInterface from './base';
import escapeTime from '../escapeTime';
import { EscapeParams, describeEscapeFunction, newParams } from './escape';
import { complex } from '../../math/complex';


function juliaLabel(f: StringWithMath): StringWithMath {
  if (Array.isArray(f)) {
    return ['Julia: ', ...f]
  } else {
    return ['Julia: ', f]
  }
}

function juliaCalc<T>(
  f: (p: T) => (z: Complex) => Complex,
) {
  return (p: T & EscapeParams) => {
    const func = f(p)
    const esc = escapeTime(p.bd, p.iter)
    return (x: number, y: number) => {
      return esc(func, complex(x, y))
    };
  };
}

export default function julia<T>({f, label, latexF, ...props}: {
  f: (p: T) => (z: Complex) => Complex,
  label: StringWithMath,
  latexF: (p: T & EscapeParams) => string,
  newParams: () => T,
  controls?: ControlProps[],
}): FractalInterface<T & EscapeParams> {

  return baseFractalInterface<T & EscapeParams>({
    label: juliaLabel(label),
    calc: juliaCalc(f),
    range: (params: EscapeParams) => [0, params.iter],
    describe: (params: T & EscapeParams) => describeEscapeFunction(
      latexF(params),
      'x+yi',
      params.bd,
      params.iter,
    ),
    newParams: newParams(props.newParams),
    controls: props.controls,
  })
}

export function noParam(props: {
  f: (z: Complex) => Complex,
  latexF: string,
  newParams?: () => Partial<EscapeParams>
}): FractalInterface<EscapeParams> {
  return julia({
    f: () => props.f,
    label: props.latexF,
    latexF: () => props.latexF,
    newParams: props.newParams ? props.newParams : () => ({}),
  });
}