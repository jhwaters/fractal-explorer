import { PixelCalculator } from './types'
import { colorScale } from './colors';


function linearScale(domain: [number, number], range: [number,number]) {
  const m = (range[1] - range[0]) / (domain[1] - domain[0])
  const b = range[0] - m*domain[0]
  return (n: number) => m*n + b;
}


class CanvasDrawer {
  canvas: HTMLCanvasElement
  values: {[k: number]: [number, number][]}
  scale: number
  size: {w: number, h: number}

  constructor(size: {
    w: number
    h: number
  }) {
    this.size = size
    this.canvas = document.createElement('canvas');
    this.values = {};
    this.scale = 1;
    this.resize();
  }

  attach(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.resize();
    this.clear();
  }

  resize(size?: {w: number, h: number}) {
    if (size) {
      this.size = {...this.size, ...size}
      this.resize()
    } else {
      this.canvas.width = this.size.w * this.scale;
      this.canvas.height = this.size.h * this.scale;
    }
  }

  clear() {
    const ctx = this.canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, this.size.w, this.size.h);
    this.values = {};
  }

  _setValue(x: number, y: number, value: number) {
    if (!this.values[value]) this.values[value] = [];
    this.values[value].push([x, y]);
  }

  calculatePixels(f: PixelCalculator, x: [number,number], y: [number,number]) {
    this.values = {};
    const {w, h} = this.size;
    const xscale = linearScale([0, w], x);
    const yscale = linearScale([h, 0], y);
    for (let r = 0; r < h; r++) {
      const y = yscale(r);
      for (let c = 0; c < w; c++) {
        const x = xscale(c);
        this._setValue(c, r, f(x, y))
      }
    }
  }

  changeIterations(f: PixelCalculator, x: [number,number], y: [number,number], iterations: number) {
    const tocalc: [number,number][] = [];
    const max = Math.max(...Object.keys(this.values).map(n => +n));
    if (max < iterations) {
      tocalc.push(...this.values[max])
      this.values[max] = [];
    } else if (max > iterations) {
      for (const v in this.values) {
        if (+v > iterations) {
          this.values[iterations].push(...this.values[v]);
          this.values[v] = [];
        }
      }
    }
    if (tocalc.length) {
      const {w, h} = this.size;
      const xscale = linearScale([0, w], x);
      const yscale = linearScale([h, 0], y);
      for (const [r, c] of tocalc) {
        this._setValue(c, r, f(xscale(r), yscale(c)))
      }
    }
  }

  _applyColors(cmap: (n: number) => string) {
    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    if (this.scale !== 1) {
      ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0)
    }
    ctx.clearRect(0, 0, this.size.w, this.size.h)
    for (const value in this.values) {
      ctx.beginPath();
      for (const pt of this.values[value]) {
        ctx.rect(pt[0], pt[1], 1, 1);
      }
      ctx.fillStyle = cmap(+value);
      ctx.fill();
    }
  }

  
  colorPixels(colors: Parameters<typeof colorScale>[0], domain: [number,number] | 'auto'='auto') {
    if (domain === 'auto') {
      const vals = Object.keys(this.values).map(n => +n);
      domain = [Math.min(...vals), Math.max(...vals)]
    }
    this._applyColors(colorScale(colors).scale(domain))
  }

}

export default CanvasDrawer;