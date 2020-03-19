import {
  State as AlgState,
} from '../store/algorithm/types';
import {burningship, mandelbrot, juliaSimple, escapeTime} from './fractal';

export default function(alg: AlgState) {
  const {method} = alg;
  const {bound, iterations} = alg[method];
  const esc = escapeTime({bound, iterations});
  const {z0, f} = 
    alg.method === 'julia-quadratic' ? juliaSimple(alg['julia-quadratic'])
    : alg.method === 'mandelbrot' ? mandelbrot(alg.mandelbrot)
    : alg.method === 'burningship' ? burningship(alg.burningship) 
    //: alg.method === 'julia' ? julia(alg.julia)
    : {z0: null, f: null};
  if (f && z0)  {
    return (x: number, y: number) => {
      return esc({z0: z0(x, y), f: f(x, y)})
    }
  }
}