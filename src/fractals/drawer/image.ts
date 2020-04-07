import { Fractal } from './types';
import {
  linearScale,
  fixView,
} from './view';
import { transformed, invert } from './transform';


export default function(fractal: Fractal): ImageData {
  const {w, h, xdom, ydom} = fixView(fractal.view);
  const xscale = linearScale([0, w], xdom);
  const yscale = linearScale([0, h], ydom);
  const calc = transformed(fractal.pixel, fractal.transform ? invert(fractal.transform) : undefined);
  const image = new ImageData(w, h);
  for (let r = 0; r < h; r++) {
    const y = yscale(r);
    const hh = w * r;
    for (let c = 0; c < w; c++) {
      const x = xscale(c);
      const i = 4*(c + hh);
      const color = fractal.colors[calc(x, y) % fractal.colors.length]; 
      image.data[i] = color[0];
      image.data[i+1] = color[1];
      image.data[i+2] = color[2];
      image.data[i+3] = color[3];
    }
  }
  return image;
}