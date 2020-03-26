import { FractalInterface, Complex, ControlProps } from '../../types'
import { complex } from '../../math/complex';
import escapeTime from '../../escapeTime';
import { settings, controls } from './base';
import { EscapeParams, description as _description, formula, create } from './escape';


export function label<T>(f: string): Pick<FractalInterface<T>,'label'> {
  return ({label: ['Julia (', {math: f}, ')']})
}

export function pixel<T extends EscapeParams>(
  f: (p: T) => (z: Complex) => Complex,
): Pick<FractalInterface<T>,'pixel'> {
  return ({pixel: (p: T) => {
    const func = f(p)
    return (x: number, y: number) => {
      return escapeTime(p.bound, p.iterations)(func, complex(x, y))
    };
  }});
}

export function description<T extends EscapeParams>(
  f: (p: T) => string
): Pick<FractalInterface<T>,'description'> {
  return _description<T>(f, 'c')
}

export function julia<T>(props: {
  f: (p: T & EscapeParams) => (z: Complex) => Complex,
  label: string,
  latexF: (p: T & EscapeParams) => string,
  create: () => T,
  settings?: any[],
  controls?: ControlProps[],
}): FractalInterface<T & EscapeParams> {
  return {
    ...label(props.label),
    ...pixel(props.f),
    ...description(props.latexF),
    ...formula(props.latexF),
    ...create(props.create),
    ...settings(props.settings),
    ...controls(props.controls),
  }
}

export function noParam(props: {
  f: (z: Complex) => Complex,
  latexF: string,
  settings?: any[],
  controls?: ControlProps[],
}): FractalInterface<EscapeParams> {
  return {
    ...julia({
        f: () => props.f,
        label: props.latexF,
        latexF: () => props.latexF,
        create: () => ({}),
        settings: props.settings,
        controls: props.controls,
    }),
  }
}