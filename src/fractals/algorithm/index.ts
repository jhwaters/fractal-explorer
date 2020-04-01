import { FractalInterface } from './types';
import * as burningship from './burningship';
import * as julias from './julias';
import * as magnet from './magnet';
import * as mandelbox from './mandelbox';
import * as mandelbrot from './mandelbrot';
import * as phoenix from './phoenix';
import * as testing from './testing';

export const ALLFRACTALS: {[k: string]: FractalInterface<any>} = ({
  ...burningship,
  ...julias,
  ...magnet,
  ...mandelbox,
  ...mandelbrot,
  ...phoenix,
  ...testing,
});