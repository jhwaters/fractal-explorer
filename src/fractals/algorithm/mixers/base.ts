import {
  FractalInterface,
  ControlProps,
  StringWithMath,
} from '../types'


// create, settings, controls, random?


export default function<T>({
  controls=[],
  ...rest
}: {
  calc: (params: T) => (x: number, y: number) => number
  newParams: () => T
  label: StringWithMath
  describe: (params: T) => StringWithMath
  range: (params: T) => [number,number]
  controls?: ControlProps[]
}): FractalInterface<T> {
  return {...rest, controls};
}