import {
  View,
  ViewRect,
  isViewRect,
} from './types';

export function linearScale(domain: [number, number], range: [number,number]) {
  const m = (range[1] - range[0]) / (domain[1] - domain[0])
  const b = range[0] - m*domain[0]
  return (n: number) => m*n + b;
}

export function scaleFactor(
  w: number,
  h: number,
  pixelCount: number,
) {
  const pixels = w * h;
  const factor = Math.sqrt(pixelCount / pixels)
  return factor;
  /*
  return {
    w: Math.round(w * factor),
    h: Math.round(h * factor),
    ppu: Math.round(ppu * factor),
  };
  */
}

export function fixView(view: View, pixelCount?: number): ViewRect {
  if (isViewRect(view)) {
    if (pixelCount) {
      const f = scaleFactor(view.w, view.h, pixelCount);
      return {w: view.w*f, h: view.h*f, ...view}
    }
    return view;
  }
  else {
    let {w, h, cx, cy, ppu} = view;
    if (pixelCount) {
      const f = scaleFactor(view.w, view.h, pixelCount);
      w = Math.round(w*f);
      h = Math.round(h*f);
      ppu *= f;
    }
    const rx = w / 2 / ppu;
    const ry = h / 2 / ppu;
    return {
      cx, cy,
      w, h,
      xdom: [cx-rx, cx+rx],
      ydom: [cy-ry, cy+ry],
    }
  }
}