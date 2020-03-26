import { Complex as _Complex } from './math/types';
import { StringWithMath } from '../components/TextWithMath';

export type Complex = _Complex

export type TextWithMath = StringWithMath

export type Label = StringWithMath

export type PixelCalculator = (x: number, y: number) => number

export interface Params {[k: string]: any}

export enum ControlType {
  Call,
  Number,
  Complex,
  Boolean,
}

interface ControlBase {
  type: ControlType
}

export interface ControlCall extends ControlBase {
  type: ControlType.Call
  label?: string
  icon?: string
  onCall: () => Params
}

export interface ControlNumber extends ControlBase {
  type: ControlType.Number
  label: string
  param: string
  step: number
  min?: number
  max?: number
}

export interface ControlComplex extends ControlBase {
  type: ControlType.Complex
  label: string
  param: string
  stepRadius: number
  stepAngle: number
}

export interface ControlBoolean extends ControlBase {
  type: ControlType.Boolean
  label: string
  param: string
}

export type ControlProps = ControlCall | ControlNumber | ControlComplex | ControlBoolean

export interface FractalInterface<T> {
  label: StringWithMath
  pixel(params: T): PixelCalculator
  formula(params: T): StringWithMath
  description(params: T): StringWithMath
  create(): T
  settings: any[]
  controls: ControlProps[]
}


export type Vector = [number, number]


