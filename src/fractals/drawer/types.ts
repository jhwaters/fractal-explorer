
export type ColorRGBA = [number,number,number,number] & Uint8ClampedArray; // [r, g, b, a], 0-255

export type Vector = [number, number]

export type Transform = [number, number, number, number]; 
/**
 * transform matrix [a, b, c, d]
 * this should be the INVERSE transform, e.g. if the image is 
 * rotated DEG degrees counter-clockwise:
 * RAD = DEG * pi / 180
 * [-cos(RAD), -sin(RAD), sin(RAD), -cos(RAD)]
 * 
 * Or, with javascript: T = new DOMMatrix().rotate(DEG)
 * [T.a, T.b, T.c, T.d]
 */

interface VW {
  cx: number // center x coordinate
  cy: number // center y coordinate
  w: number // pixels
  h: number // pixels
}

export interface ViewPPU extends VW {
  ppu: number // pixels per unit
}

export interface ViewRect extends VW {
  xdom: [number, number] // x domain
  ydom: [number, number] // y domain
}

export type View = ViewPPU | ViewRect;

export interface WithTransform {
  t?: Transform
}

export function isViewRect(v: View): v is ViewRect {
  return 'xdom' in v;
}

export type FractalViewState = View & WithTransform


export interface Fractal {
  pixel: (x: number, y: number) => number
  transform?: Transform
  colors: ColorRGBA[]
  view: View
}