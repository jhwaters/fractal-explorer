import {
  ControlCall,
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


export function getRandomC(): [number,number] {
  let angle = Math.PI -2 * Math.asin(Math.pow(Math.random(), 0.9));
  if (Math.random() < 0.5) angle = 2*Math.PI-angle;
  const radius = 0.3 + Math.sin(angle / 2) * 0.6 * (Math.random() * 0.4 + 0.8);
  return [
    Math.round(radius * Math.cos(angle) * 1000) / 1000,
    Math.round(radius * Math.sin(angle) * 1000) / 1000,
  ] as [number, number]
}

export function randomC(param: string): ControlCall {
  return {
    type: ControlType.Call,
    icon: 'Random',
    onCall: () => ({[param]: getRandomC()}),
  }
}