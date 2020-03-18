import React from 'react';
import { connect } from 'react-redux';
import { State as AppState } from '../../store/types';
import { update as updateAlgorithm } from '../../store/algorithm/actions';
import { setDrawing } from '../../store/draw/actions';
import { DownUpButtons } from '../../components';


type Props = {
  iter: number,
  power: number,
  setIter: (n: number) => void
  setPower: (n: number) => void
}

type State = {
  iterStep: number
  powerStep: number
}

class BurningShipControls extends React.Component<Props> {
  state: State

  constructor(props: Props) {
    super(props);
    this.state = {
      powerStep: 0.05,
      iterStep: 5,
    }
  }

  incrementIter(n: number) {
    this.props.setIter(Math.max(this.props.iter + n, 1));
  }
  incrementPower(n: number) {
    this.props.setPower(Math.max(this.props.power + n, 1))
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
    iter: state.algorithm.burningship.iterations,
    power: state.algorithm.burningship.power,
  }),
  (dispatch: any) => ({
    setIter: (iterations: number) => {
      dispatch(updateAlgorithm('burningship', {iterations}));
      dispatch(setDrawing(true));
    },
    setPower: (power: number) => {
      dispatch(updateAlgorithm('burningship', {power}));
      dispatch(setDrawing(true));
    },
  })
)(BurningShipControls)
