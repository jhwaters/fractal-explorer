import React from 'react';
import { connect } from 'react-redux';
import { State as AppState } from '../../store/types';
import { update as updateAlgorithm } from '../../store/algorithm/actions';
import { setDrawing } from '../../store/draw/actions';
import { DownUpButtons } from '../../components';


type Props = {
  iter: number,
  power: number,
  setPower: (n: number) => void
  setIter: (n: number) => void
}

type State = {
  iterStep: number
  powerStep: number
}

class MandelbrotControls extends React.Component<Props> {
  state: State

  constructor(props: Props) {
    super(props);
    this.state = {
      powerStep: 0.1,
      iterStep: 5,
    }
  }

  incrementIter(n: number) {
    this.props.setIter(Math.round(Math.max(this.props.iter + n, 1)));
  }
  
  incrementPower(n: number) {
    this.props.setPower(Math.round(Math.max(this.props.power + n, 1)));
  }

  iterUp = () => this.incrementIter(this.state.iterStep)
  iterDown = () => this.incrementIter(-this.state.iterStep)
  powerUp = () => this.incrementPower(this.state.powerStep)
  powerDown = () => this.incrementPower(-this.state.powerStep)

  render() {
    return (
      <>
        <DownUpButtons
          label="exp"
          onDown={this.powerDown}
          onUp={this.powerUp}
        />
        <DownUpButtons
          label="iter"
          onDown={this.iterDown}
          onUp={this.iterUp}
        />
      </>
    )
  }
}

export default connect(
  (state: AppState) => ({
    iter: state.algorithm.mandelbrot.iterations,
    power: state.algorithm.mandelbrot.power,
  }),
  (dispatch: any) => ({
    setIter: (n: number) => {
      dispatch(updateAlgorithm('mandelbrot', {iterations: n}));
      dispatch(setDrawing(true));
    },
    setPower: (n: number) => {
      dispatch(updateAlgorithm('mandelbrot', {power: n}));
      dispatch(setDrawing(true));
    },
  })
)(MandelbrotControls)
