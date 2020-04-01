import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from '../../store/types';
import { redraw } from '../../store/ui/actions';
import { recenter } from '../../store/fractal/view/actions';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { Icon } from '../../components';



const RecenterButton = (props: ButtonProps) => (
  <Button startIcon={<Icon.Recenter/>} {...props}>
    Recenter
  </Button>
)

export default connect(
  null,
  (dispatch: Dispatch) => ({
    onClick: () => {
      dispatch(recenter());
      dispatch(redraw());
    }
  }),
)(RecenterButton)