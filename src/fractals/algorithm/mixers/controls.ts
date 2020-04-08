import {
  ControlType,
  ControlNumber,
  ControlComplex,
} from '../types'


export function number(param: string, {step=1, ...rest}: {
  min?: number
  max?: number
  label?: string
  step?: number
}={}): ControlNumber {
  return {
    type: ControlType.Number,
    param,
    label: rest.label ? rest.label : param,
    step,
    ...rest,
  }
}


export function complex(param: string, {stepRadius=0.02, stepAngle=Math.PI/60, ...rest}: {
  label?: string
  stepRadius?: number
  stepAngle?: number
}={}): ControlComplex {
  return {
    type: ControlType.Complex,
    param,
    label: rest.label ? rest.label : param,
    stepRadius,
    stepAngle,
    ...rest,
  }
}