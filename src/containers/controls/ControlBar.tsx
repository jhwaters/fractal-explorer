import React from 'react';
import { connect } from 'react-redux';
import { State } from '../../store/types';
import Zoom from './Zoom';
import Recenter from './Recenter';
import Julia from './Julia';
import JuliaQuadratic from './JuliaQ';
import Mandelbrot from './Mandelbrot';
import BurningShip from './BurningShipControls';

const ControlBar = ({method}: {method: string}) => {
  return (
    <>
      {
        method === 'julia' ? <Julia /> :
        method === 'julia-quadratic' ? <JuliaQuadratic /> :
        method === 'mandelbrot' ? <Mandelbrot/> :
        method === 'burningship' ? <BurningShip/> :
        null
      }
      <Zoom factor={2} />
      <Recenter />
    </>
  )
}

export default connect(
  (state: State) => ({ method: state.algorithm.method })
)(ControlBar);