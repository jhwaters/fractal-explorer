import { FractalInterface } from '../types';
import * as burningship from './burningship';
import * as julias from './julias';
import * as magnet from './magnet';
import * as mandelbox from './mandelbox';
import * as mandelbrot from './mandelbrot';

const FractalList: {[k: string]: FractalInterface<any>} = ({
  ...burningship,
  ...julias,
  ...magnet,
  ...mandelbox,
  ...mandelbrot,
});

export default FractalList;