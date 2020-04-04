import { FractalState } from '../store/fractal/types';
import { ViewState } from '../store/fractal/view/types';
import { colorScale } from './color';
import { fractal } from './index';


export function linearScale(domain: [number, number], range: [number,number]) {
  const m = (range[1] - range[0]) / (domain[1] - domain[0])
  const b = range[0] - m*domain[0]
  return (n: number) => m*n + b;
}


export function scaleDown({w, h, ppu, pixelCount}: {
  w: number,
  h: number,
  ppu: number,
  pixelCount: number,
}) {
  const pixels = w * h;
  const factor = Math.sqrt(pixelCount / pixels)
  const result = {
    w: Math.round(w * factor),
    h: Math.round(h * factor),
    ppu: Math.round(ppu * factor),
  }
  return result
}

export function rgb(color: string) {
  return [color.slice(1,3), color.slice(3,5), color.slice(5,7)].map(s => parseInt(s, 16));
}


interface Rect {
  x: [number, number]
  y: [number, number]
  w: number
  h: number
}

export type DrawerView = ViewState | Rect

interface Props extends Pick<FractalState,'algorithm'|'color'> {
  view: DrawerView
}

function isRect(view: ViewState | Rect): view is Rect {
  return 'x' in view;
}

class FractalDrawer {
  ctx: CanvasRenderingContext2D
  fullResolution: boolean
  cmap: [number,number,number][]
  image: ImageData

  constructor(fullResolution: boolean=false) {
    this.ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
    this.fullResolution = fullResolution;
    this.cmap = [];
    this.image = new ImageData(1,1);
  }

  getView(view: ViewState | Rect) {
    if (isRect(view)) {
      return view;
    } else {
      return {...view, ...scaleDown(view)}
    }
  }

  recolor(state: Props) {
    this.draw(state)
  }

  draw(state: Props) {
    const t0 = performance.now();
    this.makeCMap(state);
    this.makeImage(state);
    const t1 = performance.now();
    console.log('draw time:', t1 - t0, 'ms')
  }

  makeCMap({color, algorithm}: Props) {
    const range = fractal(algorithm).range;
    const cs = colorScale(color)(range);
    const cmap: [number,number,number][] = [];
    for (let i = 0; i <= range[1]; i++) {
      this.ctx.fillStyle = cs(i);
      const [r, g, b] = [
        this.ctx.fillStyle.slice(1,3), 
        this.ctx.fillStyle.slice(3,5),
        this.ctx.fillStyle.slice(5,7),
      ].map(n => parseInt(n, 16))
      cmap.push([r, g, b]);
    }
    this.cmap = cmap;
  }

  makeImage(state: Props) {
    const {algorithm} = state;
    const cmap = this.cmap;
    const view = this.getView(state.view);
    const {w, h} = view;
    const calc = fractal(algorithm).calc;
    const image = new ImageData(w, h);
    let xrange: [number,number]
    let yrange: [number,number]
    if (isRect(view)) {
      xrange = view.x;
      yrange = view.y
    } else {
      const {cx, cy, w, h, ppu} = view;
      const rx = w / ppu / 2;
      const ry = h / ppu / 2;
      xrange = [cx - rx, cx + rx];
      yrange = [cy + ry, cy - ry];
    }
    const xscale = linearScale([-0.5, w-0.5], xrange);
    const yscale = linearScale([-0.5, h-0.5], yrange);
    for (let r = 0; r < h; r++) {
      const y = yscale(r);
      const hh = w * r;
      for (let c = 0; c < w; c++) {
        const x = xscale(c);
        const i = 4*(c + hh);
        const color = cmap[calc(x, y)]
        image.data[i] = color[0];
        image.data[i+1] = color[1];
        image.data[i+2] = color[2];
        image.data[i+3] = 255;
      }
    }
    this.image = image;
  }

  putOnCanvas(canvas: HTMLCanvasElement) {
    canvas.width = this.image.width;
    canvas.height = this.image.height;
    canvas.getContext('2d')?.putImageData(this.image, 0, 0);
  }

}

export default FractalDrawer;