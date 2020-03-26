import { connect } from 'react-redux';
import { State, Dispatch } from '../../store/types';
import { updateParams } from '../../store/algorithm/actions';
import { ControlType, ControlNumber } from '../../fractals/types';
import { startDrawing, startIterating } from '../../store/ui/actions';
import { NumberIncrementer}  from '../../components';

export default connect(
  (state: State) => ({
    value: state.algorithm.params.iterations,
    controlProps: {
      type: ControlType.Number,
      param: 'iterations',
      label: 'iterations',
      step: 2,
      min: 0,
    } as ControlNumber
  }),
  (dispatch: Dispatch) => ({
    onChange: (iterations: number) => {
      dispatch(updateParams({iterations}));
      dispatch(startDrawing());
    }
  })
)(NumberIncrementer)