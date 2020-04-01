import {
  interpolateInferno as Inferno,
  interpolateMagma as Magma,
  interpolatePlasma as Plasma,
  interpolateViridis as Viridis,
  interpolateCool as Cool,
  interpolateWarm as Warm,
  interpolateGreys as Greys,
  interpolateRainbow as Rainbow,
  interpolateSpectral as Spectral,
  interpolateCubehelixDefault as Cubehelix
} from 'd3';
import { ColorScheme } from './types';

type SchemeDict = {[k: string]: ColorScheme}

export const D3_SCHEMES: SchemeDict = {
  Cool,
  Cubehelix,
  Greys,
  Inferno,
  Magma,
  Plasma,
  Rainbow,
  Spectral,
  Viridis,
  Warm,
}

export const OTHER_SCHEMES: SchemeDict = {
  Paint: ["#3db5ec", "#73c2b0", "#b9e375", "#f4bb44", "#eb591b"],
  Ink: ['#000000', '#FFDD8C'],
}

const ALL_SCHEMES: SchemeDict = {
  ...D3_SCHEMES,
  ...OTHER_SCHEMES,
}

export default ALL_SCHEMES
