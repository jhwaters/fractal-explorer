import { connect } from 'react-redux';
import { State, Dispatch } from '../../store/types';
import { updateParams } from '../../store/fractal/algorithm/actions';
import { ControlType, ControlNumber } from '../../fractals/algorithm/types';
import { redraw } from '../../store/ui/actions';
import { NumberIncrementer}  from '../../components';

export default connect(
  (state: State) => ({
    value: state.fractal.algorithm.params.iter,
    controlProps: {
      type: ControlType.Number,
      param: 'iter',
      label: 'iterations',
      step: 2,
      min: 0,
    } as ControlNumber
  }),
  (dispatch: Dispatch) => ({
    onChange: (iter: number) => {
      dispatch(updateParams({iter}));
      dispatch(redraw());
    }
  })
)(NumberIncrementer)