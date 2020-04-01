import { Complex, ControlType, FractalInterface } from './types';
import { EscapeParams, describeEscapeFunction } from './mixers/escape';
import { BurningShipParams } from './burningship';
import { MandelboxParams } from './mandelbox';
import * as mix from './mixers';
import {
  complex,
  add,
  exp,
  mult,
  multReal,
  abs2,
  powInt,
  powFloat,
  powReal,
} from '../math/complex';
import { R as Math } from '../math';
import { isInt } from '../math/util';
import * as fmt from '../formatting'
import { mandelbox, burningship } from '../math/fractals';