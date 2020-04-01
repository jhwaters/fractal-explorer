import { Complex as _Complex } from '../math/types';
import { StringWithMath as SWM } from '../../components/TypographyWithMath';

export type Complex = _Complex

export type StringWithMath = SWM

export type PixelCalculator = (x: number, y: number) => number

export type Params = {[k: string]: any}

export enum ControlType {
  Call,
  Number,
  Complex,
  Boolean,
}

export interface ControlCall {
  type: ControlType.Call
  label?: string
  icon?: string
  onCall: () => Params
}

export interface ControlNumber {
  type: ControlType.Number
  label: string
  param: string
  step: number
  min?: number
  max?: number
}

export interface ControlComplex {
  type: ControlType.Complex
  label: string
  param: string
  stepRadius: number
  stepAngle: number
}

export interface ControlBoolean {
  type: ControlType.Boolean
  label: string
  param: string
}

export type ControlProps = ControlCall | ControlNumber | ControlComplex | ControlBoolean


export interface FractalInterface<T> {
  label: StringWithMath
  calc: (params: T) => (x: number, y: number) => number
  range: (params: T) => [number, number]
  describe: (params: T) => StringWithMath
  newParams: () => T
  controls: ControlProps[]
}

export type Vector = [number, number]

