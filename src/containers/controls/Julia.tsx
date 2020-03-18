import React from 'react';
import { connect } from 'react-redux';
import { State as AppState } from '../../store/types';
import { update as updateAlgorithm } from '../../store/algorithm/actions';
import { setDrawing } from '../../store/draw/actions';
import { DownUpButtons } from '../../components';



type Props = {
  iter: number,
  setIter: (n: number) => void
}

type State = {
  iterStep: number
}

class JuliaControls extends React.Component<Props> {
  state: State

  constructor(props: Props) {
    super(props);
    this.state = {
      iterStep: 5,
    }
  }

  incrementIter(n: number) {
    const x = n + this.props.iter;
    //const x = Math.round(Math.pow(this.props.iter, 1+n))
    this.props.setIter(x);
  }

  iterUp = () => this.incrementIter(this.state.iterStep)
  iterDown = () => this.incrementIter(-this.state.iterStep)

  render() {
    return (
      <DownUpButtons
        label="iter"
        onDown={this.iterDown}
        onUp={this.iterUp}
      />
    )
  }
}

export default connect(
  (state: AppState) => ({
    iter: state.algorithm["julia"].iterations,
  }),
  (dispatch: any) => ({
    setIter: (n: number) => {
      dispatch(updateAlgorithm('julia', {iterations: n}));
      dispatch(setDrawing(true));
    },
  })
)(JuliaControls)
