import { FractalInterface } from './types';
import {
  BurningShip,
  BurningShipMandelbox,
} from './burningship';
import {
  Julia,
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
  Mandelbrot
} from './mandelbrot';
import {
  Phoenix,
  PhoenixBurningShip,
} from './phoenix';
import {
  Test1
} from './testing';

export const ALLFRACTALS: {[k: string]: FractalInterface<any>} = ({
  Bs: BurningShip,
  BsMbx: BurningShipMandelbox,
  JlBs: JuliaBurningShip,
  Jl1: Julia,
  Jl2: Julia2Term,
  JlExp: JuliaExp,
  JlSinh: JuliaSinh,
  Mg1: Magnet1,
  Mg2: Magnet2,
  Mbx: Mandelbox,
  Md: Mandelbrot,
  MbxBs: Mandelcorner,
  Ph: Phoenix,
  PhBs: PhoenixBurningShip,
  Test1,
});