export const SET_METHOD = 'ALGORITHM_SET_METHOD';
export const UPDATE = 'ALGORITHM_UPDATE';
//export const UPDATE_PARAMS = 'ALGORITHM_UPDATE_PARAMS';

export type CartesianCoord = {x: number, y: number}

export type PolarCoord = {radius: number, angle: number}

export type Coordinate = CartesianCoord

export type MethodName = 'burningship' | 'julia' | 'julia-quadratic' | 'mandelbrot'

interface CommonParams {
  [k: string]: any,
  bound: number,
  iterations: number
}

export interface BurningShipParams extends CommonParams {
  flip: boolean
  power: number
}

export interface MandelbrotParams extends CommonParams {
  power: number
}

export interface JuliaParams extends CommonParams {
  f: string,
}

export interface JuliaQuadraticParams extends CommonParams {
  c: Coordinate,
}

export type MethodParams = JuliaParams | JuliaQuadraticParams | CommonParams

export type State = {
  [k: string]: any
  method: MethodName,
  'julia': JuliaParams,
  'julia-quadratic': JuliaQuadraticParams,
  'burningship': BurningShipParams,
  'mandelbrot': MandelbrotParams,
}

export type SetMethod = {
  type: typeof SET_METHOD,
  payload: MethodName,
}

export type Update = {
  type: typeof UPDATE,
  payload:
    {method: 'julia', params: Partial<JuliaParams>} |
    {method: 'julia-quadratic', params: Partial<JuliaQuadraticParams>} |
    {method: 'burningship', params: Partial<BurningShipParams>} |
    {method: 'mandelbrot', params: Partial<MandelbrotParams>}
}

export type Action = SetMethod | Update
