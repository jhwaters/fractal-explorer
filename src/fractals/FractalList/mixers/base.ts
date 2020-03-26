import { FractalInterface, ControlProps } from '../../types'


// create, settings, controls, random?


export function controls<T>(x: ControlProps[]=[]): Pick<FractalInterface<T>,'controls'> {
  return {controls: x as ControlProps[]};
}

export function settings<T>(x: any[]=[]): Pick<FractalInterface<T>,'settings'> {
  return {settings: x};
}