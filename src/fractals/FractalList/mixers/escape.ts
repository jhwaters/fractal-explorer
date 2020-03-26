import { FractalInterface, Complex, ControlProps } from '../../types'
import { StringOrMath } from '../../../components/TextWithMath';
import { complex } from '../../math/complex';
import escapeTime from '../../escapeTime';
import { num } from '../../formatting';
import { settings, controls } from './base';


export interface EscapeParams {
  bound: number
  iterations: number
}

const DefaultEscapeParams: EscapeParams ={
  bound: 10,
  iterations: 20,
}

export function create<T>(x: () => T): Pick<FractalInterface<T & EscapeParams>,'create'> {
  return {create: () => ({...DefaultEscapeParams, ...x()})};
}

export function pixel<T>(
    f: (p: T) => (c: Complex) => (z: Complex) => Complex,
    z0: 0 | 'c' | ((p: T) => (c: Complex) => Complex)=0,
): Pick<FractalInterface<T & EscapeParams>,'pixel'> {
  if (z0 === 0) {
    return ({pixel: (p: T & EscapeParams) => {
      const func = f(p)
      return (x: number, y: number) => {
        return escapeTime(p.bound, p.iterations)(func(complex(x, y)))
      };
    }});
  }
  if (z0 === 'c') {
    return ({pixel: (p: T & EscapeParams) => {
      const func = f(p)
      return (x: number, y: number) => {
        return escapeTime(p.bound, p.iterations)(func(complex(x, y)), complex(x, y))
      };
    }});
  }
  return ({pixel: (p: T & EscapeParams) => {
    const func = f(p)
    const zz = z0(p)
    return (x: number, y: number) => {
      return escapeTime(p.bound, p.iterations)(func(complex(x, y)), zz(complex(x, y)))
    };
  }});
}

export function description<T>(
    f: (p: T & EscapeParams) => string,
    z0: 0 | 'c' | ((p: T & EscapeParams) => string)=0,
): Pick<FractalInterface<T & EscapeParams>,'description'> {
  return {
    description: (p: T & EscapeParams) => describeEscapeFunction(
      f(p),
      z0 === 0 ? '0' : z0 === 'c' ? 'x+yi' : z0(p),
      p.bound,
      p.iterations,
    ),
  }
}

export function formula<T>(
  f: (p: T) => string,
): Pick<FractalInterface<T>,'formula'> {
  return ({formula: (p: T) => ({math: f(p)})});
}

export function escape<T>(props: {
  label: string,
  f: (p: T) => (c: Complex) => (z: Complex) => Complex,
  latexF: (p: T & EscapeParams) => string,
  z0?: 0 | 'c' | ((p: T) => (c: Complex) => Complex),
  latexZ0?: 0 | 'c' | ((p: T) => string),
  create: () => T,
  settings?: any[],
  controls?: ControlProps[]
}): FractalInterface<T & EscapeParams> {
  return {
    label: props.label,
    ...pixel(props.f, props.z0),
    ...description(props.latexF, props.latexZ0),
    ...formula(props.latexF),
    ...create(props.create),
    ...settings(props.settings),
    ...controls(props.controls),
  }
}


export function describeEscapeFunction(
  f: string, 
  z0: string, 
  bound: number, 
  iterations: number,
): StringOrMath[] {

  const fmla = (
    '\\begin{aligned}'
    + 'z_0 &= ' + z0
    + '\\\\' 
    + 'z_{n+1} &= ' + f.replace(/z/g, 'z_n')
    + '\\end{aligned}'
  );

  return [
    {math: fmla, displayMode: true},
    "The color of the pixel located at ", {math: "(x, y)"},
    " corresponds to ", {math: "k"}, ", where ", {math: "z_k"},
    " is the first term of the above sequence such that ",
    {math: `|z_k| > ${num(bound)}`},
    ". If this does not occur in the first ", {math: num(iterations)},
    " terms of the sequence, then ", {math: "k = " + num(iterations)}, '.',
  ]
}