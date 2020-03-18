import ColorScale from './colorscale';
import COLORSCHEMES from './schemes';


export function customScale(colors: string[], opts: {
  reverse?: boolean,
  skew?: number,
}={}) {
  return ColorScale.piecewise(colors, opts);
}

export function builtinScale(scheme: string, opts: {
  reverse?: boolean,
  skew?: number,
}={}) {
  return new ColorScale(COLORSCHEMES[scheme], opts);
}

export function colorScale({scheme, reverse, skew, customSchemes}: {
  scheme: string
  reverse: boolean,
  skew: number,
  customSchemes: {[k: string]: string[]}
}) {
  if (customSchemes[scheme]) {
    return customScale(customSchemes[scheme], {reverse, skew});
  } else {
    return builtinScale(scheme, {reverse, skew});
  }
}