
class CanvasDrawer {
  canvas: HTMLCanvasElement
  values: {[k: number]: [number, number][]}
  scale: number

  constructor(canvas?: HTMLCanvasElement) {
    this.canvas = canvas || document.createElement('canvas');
    this.values = {};
    this.scale = 1;
  }

  attach(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.clear();
  }

  resize({w, h}: {w: number, h: number}) {
    if (w) this.canvas.width = w*this.scale;
    if (h) this.canvas.height = h*this.scale;
  }

  clear() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, w, h);
    this.values = {};
  }

  setValue(x: number, y: number, value: number) {
    if (!this.values[value]) this.values[value] = [];
    this.values[value].push([x, y]);
  }

  applyColors(cmap: (n: number) => string) {
    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    if (this.scale !== 1) {
      ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0)
    }
    for (const value in this.values) {
      ctx.beginPath();
      for (const pt of this.values[value]) {
        ctx.rect(pt[0], pt[1], 1, 1);
      }
      ctx.fillStyle = cmap(+value);
      ctx.fill();
    }
  }

}

export default CanvasDrawer;