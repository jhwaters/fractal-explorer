import { ALLFRACTALS } from './algorithm';
import { Algorithm } from './types';
import { colorScale, COLORSCHEMES } from './color';
import drawImage from './drawer/drawer';


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



export { ALLFRACTALS, COLORSCHEMES, fractal, drawImage }
