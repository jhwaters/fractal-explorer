import React from 'react';
import { connect } from 'react-redux';
import { zoomIn, zoomOut, redraw } from '../../store/actions';
import DownUpButtons, { DownUpButtonsProps } from '../../components/DownUpButtons';
import { Icon } from '../../components';

interface NewProps {
  factor?: number
  label?: string
  fontSize?: 'small' | 'default' | 'large' | 'inherit'
  zoomIn: (n: number) => void
  zoomOut: (n: number) => void
}

interface Props extends NewProps, Omit<DownUpButtonsProps, 'onUp' | 'onDown'> {}

const Zoom = ({factor=2, zoomIn, zoomOut, ...rest}: Props) => {
  const zin = () => zoomIn(factor);
  const zout = () => zoomOut(factor);
  
  return (
    <DownUpButtons 
      {...rest}
      onUp={zin} 
      onDown={zout} 
      downIcon={Icon.ZoomOut} 
      upIcon={Icon.ZoomIn}
    />
  )
}



export default connect(
  null,
  (dispatch: any) => ({
    zoomIn: (n: number) => {
      dispatch(zoomIn(n));
      dispatch(redraw());
    },
    zoomOut: (n: number) => {
      dispatch(zoomOut(n));
      dispatch(redraw());
    }
  })
)(Zoom)