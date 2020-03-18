import React from 'react';
import { connect } from 'react-redux';
import { zoomIn, zoomOut } from '../../store/view/actions';
import { setDrawing } from '../../store/draw/actions';
import { DownUpButtons } from '../../components';

type Props = {
  factor: number
  zoomIn: (n: number) => void
  zoomOut: (n: number) => void
}

const Zoom = ({factor, zoomIn, zoomOut}: Props) => {
  const zin = () => zoomIn(factor);
  const zout = () => zoomOut(factor);
  return (
    <DownUpButtons
      label="zoom"
      onDown={zout}
      onUp={zin}
    />
  )
}



export default connect(
  null,
  (dispatch: any) => ({
    zoomIn: (n: number) => {
      dispatch(zoomIn(n));
      dispatch(setDrawing(true));
    },
    zoomOut: (n: number) => {
      dispatch(zoomOut(n));
      dispatch(setDrawing(true));
    }
  })
)(Zoom)