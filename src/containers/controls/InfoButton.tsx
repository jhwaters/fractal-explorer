import React from 'react';
import { connect } from 'react-redux';
import { State as AppState, Dispatch } from '../../store/types';
import { setModal } from '../../store/actions';
import { Modal } from '../../store/ui/types';
import { TypographyWithMath } from '../../components';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { fractal } from '../../fractals';


const KatexButton = withStyles({
  label: {textTransform: 'none'},
})(Button)

const InfoButton = ({formula, ...rest}: {
  formula: string | {math: string} | (string | {math: string})[]
} & ButtonProps) => (
  <KatexButton {...rest}>
    <TypographyWithMath data={formula}/>
  </KatexButton>
)

export default connect(
  (state: AppState) => {
    const formula = fractal(state.fractal.algorithm).label;
    return {
      disabled: state.ui.modal === Modal.Info,
      formula,
    }
  },
  (dispatch: Dispatch) => ({
    onClick: () => dispatch(setModal(Modal.Info))
  })
)(InfoButton)