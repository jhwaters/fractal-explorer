import { State as AlgState } from '../store/algorithm/types';
import CanvasDrawer from './CanvasDrawer';
import FractalList from './FractalList';



function fractal(alg: AlgState) {
  const fr = alg.fractals[alg.current];
  const params = alg.params;
  return {
    label: fr.label,
    pixel: fr.pixel(params),
    formula: fr.formula(params),
    description: fr.description(params),
    settings: fr.settings,
    controls: fr.controls,
  }
}


export { CanvasDrawer, FractalList, fractal }
