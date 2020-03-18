import React from 'react';
import { connect } from 'react-redux';
import { State as AppState } from '../../store/types';
import { update as updateAlgorithm } from '../../store/algorithm/actions';
import { setDrawing } from '../../store/draw/actions';
import { Button, DownUpButtons } from '../../components';
import { randomC } from '../../fractal/juliaQuadratic';


type Props = {
  x: number
  y: number
  iter: number,
  power: number,
  setC: (c: {x: number, y: number}) => void
  setIter: (n: number) => void
  setPower: (p: number) => void
}

type State = {
  angleStep: number
  radiusStep: number
  iterStep: number
  powerStep: number
}

class JuliaQuadraticControls extends React.Component<Props> {
  state: State

  constructor(props: Props) {
    super(props);
    this.state = {
      angleStep: 0.05,
      radiusStep: 0.02,
      iterStep: 5,
      powerStep: 0.05,
    }
  }

  incrementAngle(n: number) {
    const {x, y} = this.props;
    const a0 = Math.atan2(y, x);
    const r0 = Math.sqrt(x*x + y*y)
    this.props.setC({
      x: Math.round(r0 * Math.cos(a0 + n) * 100000)/100000,
      y: Math.round(r0 * Math.sin(a0 + n) * 100000)/100000,
    });
  }

  incrementRadius(n: number) {
    const {x, y} = this.props;
    const r0 = Math.sqrt(x*x + y*y)
    const f = (n + r0) / r0;
    this.props.setC({
      x: Math.round(f * x * 100000)/100000,
      y: Math.round(f * y * 100000)/100000,
    })
  }

  incrementIter(n: number) {
    this.props.setIter(Math.round(n + this.props.iter))
  }

  incrementPower(n: number) {
    this.props.setPower(+(n + this.props.power).toFixed(6))
  }

  angleUp = () => this.incrementAngle(this.state.angleStep)
  angleDown = () => this.incrementAngle(-this.state.angleStep)
  radiusUp = () => this.incrementRadius(this.state.radiusStep)
  radiusDown = () => this.incrementRadius(-this.state.radiusStep)
  iterUp = () => this.incrementIter(this.state.iterStep)
  iterDown = () => this.incrementIter(-this.state.iterStep)
  powerUp = () => this.incrementPower(this.state.powerStep)
  powerDown = () => this.incrementPower(-this.state.powerStep)

  randomize = () => {
    this.props.setC(randomC());
  }

  render() {
    return (
      <>
        <Button onClick={this.randomize}>Random</Button>
        <DownUpButtons
          label="exp"
          onDown={this.powerDown}
          onUp={this.powerUp}
        />
        <DownUpButtons
          label="θ"
          onDown={this.angleDown}
          onUp={this.angleUp}
        />
        <DownUpButtons
          label="r"
          onDown={this.radiusDown}
          onUp={this.radiusUp}
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
    x: state.algorithm["julia-quadratic"].c.x,
    y: state.algorithm["julia-quadratic"].c.y,
    iter: state.algorithm["julia-quadratic"].iterations,
    power: state.algorithm['julia-quadratic'].power,
  }),
  (dispatch: any) => ({
    setC: (c: {x: number, y: number}) => {
      dispatch(updateAlgorithm('julia-quadratic', {c}));
      dispatch(setDrawing(true));
    },
    setIter: (n: number) => {
      dispatch(updateAlgorithm('julia-quadratic', {iterations: n}));
      dispatch(setDrawing(true));
    },
    setPower: (power: number) => {
      dispatch(updateAlgorithm('julia-quadratic', {power}));
      dispatch(setDrawing(true));
    },
  })
)(JuliaQuadraticControls)




