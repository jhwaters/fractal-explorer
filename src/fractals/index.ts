import FractalDrawer from './FractalDrawer';
import { ALLFRACTALS } from './algorithm';
import { Algorithm } from './types';
import { colorScale, COLORSCHEMES } from './color';
import drawImage from './drawer/image';


function fractal<T>({method, params}: Algorithm<T>) {
  return {
    label: method.label,
    calc: method.calc(params),
    range: method.range(params),
    describe: method.describe(params),
    controls: method.controls,
  }
}

export { colorScale }



export { FractalDrawer, ALLFRACTALS, COLORSCHEMES, fractal, drawImage }
