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
  FastMandelbox,
  FastMandelcorner,
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
  FastBurningShipMandelbox,
  FastJuliaMandelbrot,
  FastMandelbrot,
  FastPhoenixJuliaBurningShip,
  FastPhoenixBurningShip,
  FastPhoenixJulia,
  FastPhoenix,
} from './fast';

export const ALLFRACTALS: {[k: string]: FractalInterface<any>} = ({
  F_Bs: FastBurningShip,
  F_BsMbx: FastBurningShipMandelbox,
  Mbx: FastMandelbox,
  F_Md: FastMandelbrot,
  F_MdJl: FastJuliaMandelbrot,
  MbxBs: FastMandelcorner,
  F_Ph: FastPhoenix,
  F_PhJl: FastPhoenixJulia,
  F_PhBs: FastPhoenixBurningShip,
  F_PhJlBs: FastPhoenixJuliaBurningShip,
  Bs: BurningShip,
  BsJl: JuliaBurningShip,
  BsMbx: BurningShipMandelbox,
  Jl2: Julia2Term,
  JlExp: JuliaExp,
  JlSinh: JuliaSinh,
  Mg1: Magnet1,
  Mg2: Magnet2,
  Md: Mandelbrot,
  MdJl: MandelbrotJulia,
  Ph: Phoenix,
  PhJl: PhoenixJulia,
  PhJlBs: PhoenixJuliaBurningShip,
  Test1,
});