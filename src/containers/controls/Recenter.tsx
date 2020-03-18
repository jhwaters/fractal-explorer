import React from 'react';
import { connect } from 'react-redux';
import { recenter as recenterView } from '../../store/view/actions';
import { setDrawing } from '../../store/draw/actions';
import { Button } from '../../components/material';

type Props = {
  recenter: () => void
}

const Recenter = ({recenter}: Props) => {
  return (
    <Button onClick={recenter}>Re-center</Button>
  )
}


export default connect(
  null,
  (dispatch: any) => ({
    recenter: () => {
      dispatch(recenterView());
      dispatch(setDrawing(true));
    }
  })
)(Recenter)