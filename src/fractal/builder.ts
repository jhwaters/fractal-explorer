import juliaQuadratic from './juliaQuadratic';
import julia from './julia';
import mandelbrot from './mandelbrot';
import burningship from './burningship';
import {
  State as AlgState,
  JuliaParams,
  JuliaQuadraticParams,
  MandelbrotParams,
  BurningShipParams,
} from '../store/algorithm/types';


type Julia = {
  method: 'julia',
  params: JuliaParams,
}

type JQ = {
  method: 'julia-quadratic',
  params: JuliaQuadraticParams,
}

type Mand = {
  method: 'mandelbrot',
  params: MandelbrotParams,
}

type Burn = {
  method: 'burningship',
  params: BurningShipParams
}

type Alg = Julia | JQ | Mand | Burn

type F = {
  f: (x: number, y: number) => number,
  range: [number, number],
}

function makeJulia(params: JuliaParams): F {
  return {
    f: julia(params),
    range: [0, params.iterations],
  }
}

function makeJuliaQuadratic(params: JuliaQuadraticParams): F {
  return {
    f: juliaQuadratic(params),
    range: [0, params.iterations]
  }
}

function makeMandelbrot(params: MandelbrotParams): F {
  return {
    f: mandelbrot(params),
    range: [0, params.iterations],
  }
}

function makeBurningShip(params: BurningShipParams): F {
  return {
    f: burningship(params),
    range: [0, params.iterations],
  }
}

export default function(alg: AlgState): F | undefined {
  if (alg.method === 'julia') {
    return makeJulia(alg['julia']);
  }
  if (alg.method === 'julia-quadratic') {
    return makeJuliaQuadratic(alg['julia-quadratic'])
  }
  if (alg.method === 'mandelbrot') {
    return makeMandelbrot(alg['mandelbrot']);
  }
  if (alg.method === 'burningship') {
    return makeBurningShip(alg['burningship']);
  }
}