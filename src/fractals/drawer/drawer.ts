import { ViewState } from '../../store/fractal/view/types';
import { FractalState } from '../../store/fractal/types';
import { FractalViewState, ViewRect } from './types';
import makeImage from './image';
import { colorMap } from '../color';
import { fixView } from './view';
import { ALLFRACTALS } from '../algorithm';

export const OPTS = ({
  logDrawTime: false,
});

interface Fractal extends Pick<FractalState,'algorithm'|'color'> {
  view: FractalViewState
}


function drawImage(fractal: Fractal): ImageData | undefined {
  const method = ALLFRACTALS[fractal.algorithm.methodName];
  if (method) {
    const pixel = method.calc(fractal.algorithm.params);
    const range = method.range(fractal.algorithm.params);
    const t = fractal.view.t;
    let view: ViewRect
    if ('pixelCount' in fractal.view) {
      const {t, pixelCount, ...rest} = fractal.view;
      view = fixView(rest, pixelCount)
    } else {
      view = fixView(fractal.view);
    }
    const colors = colorMap(fractal.color)(range);
    return makeImage({
      pixel,
      colors,
      view,
      transform: t,
    });
  }
}

export default function(fractal: Fractal): ImageData | undefined {
  if (OPTS.logDrawTime) {
    const t0 = performance.now();
    const image = drawImage(fractal);
    const t1 = performance.now();
    console.log('draw time:', t1 - t0);
    return image;
  }
  return drawImage(fractal);
}