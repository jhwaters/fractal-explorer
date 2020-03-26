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
import { ColorInterpolator } from './colorscale';

type SchemeDict = {[k: string]: ColorInterpolator}

export const D3_SCHEMES: SchemeDict = {
  Inferno,
  Magma,
  Plasma,
  Viridis,
  Cool,
  Warm,
  Rainbow,
  Spectral,
  Cubehelix,
  Greys,
}

export const OTHER_SCHEMES: SchemeDict = {
}

const ALL_SCHEMES: SchemeDict = {
  ...D3_SCHEMES,
  ...OTHER_SCHEMES,
}

export default ALL_SCHEMES
