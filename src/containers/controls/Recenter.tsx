import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from '../../store/types';
import { redraw } from '../../store/ui/actions';
import { recenter } from '../../store/fractal/view/actions';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import { Icon } from '../../components';

const RecenterButton = (props: IconButtonProps) => (
  <IconButton {...props} title="recenter image at origin">
    <Icon.Recenter/>
  </IconButton>
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