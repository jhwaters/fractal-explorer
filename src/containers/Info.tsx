import React from 'react';
import { connect } from 'react-redux';
import Katex from '../components/katex';
import {State as AppState} from '../store/types';
import {State as AlgState} from '../store/algorithm/types';
import { FORMULAS } from './settings/Julia';
import {
  Typography,
} from '../components';


type Props = {
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  algorithm: AlgState,
}

function withSign(n: number, p: number=4) {
  if (n < 0) {
    return n.toPrecision(p)
  } else {
    return '+' + n.toPrecision(p)
  }
}

function fff(alg: AlgState) {
  const {method} = alg;
  const params = alg[method];
  if (method === 'burningship') {
    const exp = Math.round(params.power * 10000) / 10000
    return {
      f: `(|Re(z_n)| + i|Im(z_n)|)^{${exp}} + x + yi`,
      z: '0',
    }
  }
  if (method === 'mandelbrot') {
    const exp = Math.round(params.power * 10000) / 10000
    return {
      f: `z_n^{${exp}} + x + yi`,
      z: 'z_0 = 0',
    }
  }
  if (method === 'julia-quadratic') {
    const exp = Math.round(params.power * 10000) / 10000
    const {x, y} = params.c;
    return {
      f: `z_n^{${exp}}${withSign(x)}${withSign(y)}i`,
      z: 'x + yi',
    }
  }
  if (method === 'julia') {
    const f = FORMULAS[params.f];
    if (f.latex) {
      return {
        f: f.latex.replace(/z/g, 'z_{n}'),
        z: 'x + yi',
      }
    } else {
      return {
        f: params.f,
        z: 'x + yi',
        nolatex: true,
      }
    }
  }
}


function rounder(p: number) {
  const d = Math.pow(10, p);
  return (n: number) => Math.round(n * d) / d;
}


function science(n: number, p: number=4) {
  const a = n.toPrecision(4);
  const b = a.split('e')
  if (b.length === 1) {
    return a;
  } else {
    return b[0] + '\\times 10^{' + b[1] + '}'
  }
}

const FractalInfo = (props: Props) => {

  const {algorithm} = props;
  const {method} = algorithm;
  const params = algorithm[method];

  const round = rounder(3-Math.floor(Math.log10(props.rx)))

  const cx = round(props.cx)
  const cy = round(method === 'burningship' && params.flip ? -props.cy : props.cy)

  const rx = science(Math.abs(props.rx))
  const ry = science(Math.abs(props.ry))

  const center = (
    '\\begin{aligned}'
    + 'x_c &= ' + cx 
    + '\\\\' 
    + 'y_c &= ' + cy + 
    '\\end{aligned}'
  );

  const domain = (
    '\\begin{aligned}' 
    + '|x - x_c| &< ' + rx 
    + '\\\\' 
    + '|y - y_c| &< ' + ry 
    + '\\end{aligned}'
  );

  const {f, z, nolatex=false} = fff(algorithm) as {f: string, z: string, nolatex?: boolean};

  const fmla = (
    '\\begin{aligned}'
    + 'z_0 &= ' + z
    + '\\\\' 
    + 'z_{n+1} &= ' + f 
    + '\\end{aligned}'
  );

  return (
    <>
      {nolatex ? (
        <p>{f}</p>
      ) : (
        <Katex math={fmla} displayMode={true}/>
      )}

      <Typography>
        The color of the pixel located at <Katex math="(x, y)"/> corresponds 
        to <Katex math="k"/>, where <Katex math="z_k"/> is the first term of
        the above sequence such that <Katex math={"|z_k| \\geq " + params.bound}/>.
        If this does not occur in the first {params.iterations} terms of the sequence,
        then <Katex math={"k = " + params.iterations}/>.
      </Typography>
      <Typography>
        The currently displayed portion of this fractal is centered
        at <Katex math="(x_c, y_c)"/>, where
      </Typography>
      <Katex math={center} displayMode={true}/>
      <Typography>
        and plotted over <Katex math="(x, y)"/> such that
      </Typography>
      <Katex math={domain} displayMode={true}/>
    </>
  )
}

export default connect(
  (state: AppState) => {
    const {cx, cy, ppu, w, h} = state.view;
    const rx = w/ppu/2, ry = h/ppu/2;
    return {
      cx: cx,
      cy: cy,
      rx: rx,
      ry: ry,
      algorithm: state.algorithm,
    }
  }
)(FractalInfo)