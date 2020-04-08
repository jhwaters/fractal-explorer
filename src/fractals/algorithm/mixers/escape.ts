import {
  FractalInterface,
  Complex,
  ControlProps,
  StringWithMath,
  Params,
} from '../types'
import { StringOrMath } from '../../../components/TypographyWithMath';
import { complex } from '../../math/complex';
import escapeTime from '../escapeTime';
import { num } from '../../formatting';
import baseFractalInterface from './base';


export interface EscapeParams extends Params {
  bail: number
  iter: number
}

const DefaultEscapeParams: EscapeParams ={
  bail: 10,
  iter: 20,
}

export function newParams<T>(x: () => T): () => (T & EscapeParams) {
  return () => ({...DefaultEscapeParams, ...x()});
}

function calculate<T>(
    f: (p: T) => (c: Complex) => (z: Complex) => Complex,
    z0: 0 | 'c' | ((p: T) => (c: Complex) => Complex)=0,
): (params: T & EscapeParams) => (x: number, y: number) => number {
  if (z0 === 0) {
    return (p: T & EscapeParams) => {
      const func = f(p)
      return (x: number, y: number) => {
        return escapeTime(p.bail, p.iter)(func(complex(x, y)))
      };
    };
  }
  if (z0 === 'c') {
    return (p: T & EscapeParams) => {
      const func = f(p)
      return (x: number, y: number) => {
        return escapeTime(p.bail, p.iter)(func(complex(x, y)), complex(x, y))
      };
    };
  }
  return (p: T & EscapeParams) => {
    const func = f(p)
    const zz = z0(p)
    return (x: number, y: number) => {
      return escapeTime(p.bail, p.iter)(func(complex(x, y)), zz(complex(x, y)))
    };
  };
}

function describe<T>(
    f: (p: T & EscapeParams) => string,
    z0: 0 | 'c' | ((p: T & EscapeParams) => string)=0,
): (params: T & EscapeParams) => StringWithMath {
  return (p: T & EscapeParams) => describeEscapeFunction(
    f(p),
    z0 === 0 ? '0' : z0 === 'c' ? 'x+yi' : z0(p),
    p.bail,
    p.iter,
  );
}

interface CommonEscapeProps<T> {
  label: StringWithMath
  f: (p: T) => (c: Complex) => (z: Complex) => Complex
  z0?: 0 | 'c' | ((p: T) => (c: Complex) => Complex)
  newParams: () => T
  controls?: ControlProps[]
}

interface EscapePropsA<T> extends CommonEscapeProps<T> {
  latexF: (p: T & EscapeParams) => string
  latexZ0?: 0 | 'c' | ((p: T) => string)
}

interface EscapePropsB<T> extends CommonEscapeProps<T> {
  describe: (p: T & EscapeParams) => StringWithMath
}

type EscapeProps<T> = EscapePropsA<T> | EscapePropsB<T>

function isTypeA<T>(p: EscapeProps<T>): p is EscapePropsA<T> {
  return !('describe' in p);
}

export default function escape<T>(props: EscapeProps<T>): FractalInterface<T & EscapeParams> {
  if (isTypeA(props)) {
    const lz0 =
      props.latexZ0 === undefined && (props.z0 === 0 || props.z0 === 'c')
      ? props.z0 : props.latexZ0;
    return baseFractalInterface<T & EscapeParams>({
      label: props.label,
      calc: calculate(props.f, props.z0),
      range: (params: EscapeParams) => [0, params.iter],
      describe: describe(props.latexF, lz0),
      newParams: newParams(props.newParams),
      controls: props.controls,
    })
  } else {
    return baseFractalInterface<T & EscapeParams>({
      label: props.label,
      calc: calculate(props.f, props.z0),
      range: (params: T & EscapeParams) => [0, params.iter],
      describe: props.describe,
      newParams: newParams(props.newParams),
      controls: props.controls,
    })
  }
}


export function describeEscapeFunction(
  f: string, 
  z0: string, 
  bail: number, 
  iter: number,
): StringOrMath[] {

  const fmla = (
    '\\begin{aligned}'
    + 'z_0 &= ' + z0
    + '\\\\' 
    + 'z_{n+1} &= ' + (f.indexOf('z_') === -1 ? f.replace(/z/g, 'z_n') : f)
    + '\\end{aligned}'
  );

  return [
    {math: fmla, displayMode: true},
    "The color of the pixel located at ", {math: "(x, y)"},
    " corresponds to ", {math: "k"}, ", where ", {math: "z_k"},
    " is the first term of the above sequence such that ",
    {math: `|z_k| > ${num(bail)}`},
    ". If this does not occur in the first ", {math: num(iter)},
    " terms of the sequence, then ", {math: "k = " + num(iter)}, '.',
  ]
}