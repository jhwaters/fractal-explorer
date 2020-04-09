import { FractalInterface } from './types';
import {
  BurningShip,
  BurningShipMandelbox,
} from './burningship';
import {
  Julia2Term,
  JuliaBurningShip,
  JuliaExp,
  JuliaSinh,
} from './julias';
import {
  Magnet1,
  Magnet2,
} from './magnet';
import {
  Mandelbox,
  Mandelcorner,
} from './mandelbox';
import {
  MandelbrotJulia,
  Mandelbrot,
} from './mandelbrot';
import {
  Phoenix,
  PhoenixJulia,
  PhoenixJuliaBurningShip,
} from './phoenix';
import {
  Test1
} from './testing';
import {
  FastBurningShip,
  FastJuliaMandelbrot,
  FastPhoenixBurningShip,
  FastPhoenixJulia,
  FastPhoenix,
} from './fast';

export const ALLFRACTALS: {[k: string]: FractalInterface<any>} = ({
  Bs: BurningShip,
  F_Bs: FastBurningShip,
  BsJl: JuliaBurningShip,
  BsMbx: BurningShipMandelbox,
  Jl2: Julia2Term,
  JlExp: JuliaExp,
  JlSinh: JuliaSinh,
  Mg1: Magnet1,
  Mg2: Magnet2,
  Mbx: Mandelbox,
  Md: Mandelbrot,
  MdJl: MandelbrotJulia,
  F_MdJl: FastJuliaMandelbrot,
  MbxBs: Mandelcorner,
  Ph: Phoenix,
  F_Ph: FastPhoenix,
  PhJl: PhoenixJulia,
  F_PhJl: FastPhoenixJulia,
  PhJlBs: PhoenixJuliaBurningShip,
  F_PhBs: FastPhoenixBurningShip,
  Test1,
});