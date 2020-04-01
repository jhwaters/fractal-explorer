import {
  interpolateInferno as Inferno,
  interpolateMagma as Magma,
  interpolatePlasma as Plasma,
  interpolateViridis as Viridis,
  interpolateCool as Cool,
  interpolateWarm as Warm,
  interpolateGreys as Greys,
  interpolateRainbow as Rainbow,
  interpolateSinebow as Sinebow,
  interpolateSpectral as Spectral,
  interpolateCubehelixDefault as Cubehelix,

  interpolateBlues as Blues,
  interpolateBrBG as BrBG,
  interpolateBuGn as BuGn,
  interpolateBuPu as BuPu,
  interpolateGnBu as GnBu,
  interpolateGreens as Greens,
  interpolateOrRd as OrRd,
  interpolateOranges as Oranges,
  interpolatePRGn as PRGn,
  interpolatePiYG as PiYG,
  interpolatePuBu as PuBu,
  interpolatePuBuGn as PuBuGn,
  interpolatePuOr as PuOr,
  interpolatePuRd as PuRd,
  interpolatePurples as Purples,
  interpolateRdBu as RdBu,
  interpolateRdGy as RdGy,
  interpolateRdPu as RdPu,
  interpolateRdYlBu as RdYlBu,
  interpolateRdYlGn as RdYlGn,
  interpolateReds as Reds,
  interpolateYlGn as YlGn,
  interpolateYlGnBu as YlGnBu,
  interpolateYlOrBr as YlOrBr,
  interpolateYlOrRd as YlOrRd,

} from 'd3';
import { ColorScheme } from './types';

type SchemeDict = {[k: string]: ColorScheme}

const D3_SCHEMES_1: SchemeDict = {
  Cool,
  Cubehelix,
  Greys,
  Inferno,
  Magma,
  Plasma,
  Rainbow,
  Sinebow,
  Spectral,
  Viridis,
  Warm,
}

const D3_SCHEMES_2: SchemeDict = {
  Blues,
  BrBG,
  BuGn,
  BuPu,
  GnBu,
  Greens,
  OrRd,
  Oranges,
  PRGn,
  PiYG,
  PuBu,
  PuBuGn,
  PuOr,
  PuRd,
  Purples,
  RdBu,
  RdGy,
  RdPu,
  RdYlBu,
  RdYlGn,
  Reds,
  YlGn,
  YlGnBu,
  YlOrBr,
  YlOrRd,
}

const OTHER_SCHEMES: SchemeDict = {
  Paint: ["#3db5ec", "#73c2b0", "#b9e375", "#f4bb44", "#eb591b"],
  Ink: ['#000000', '#FFDD8C'],
}

const ALL_SCHEMES: SchemeDict = {
  ...D3_SCHEMES_1,
  ...D3_SCHEMES_2,
  ...OTHER_SCHEMES,
}

export default ALL_SCHEMES
