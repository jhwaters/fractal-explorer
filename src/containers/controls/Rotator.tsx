import React from 'react';
import { connect } from 'react-redux';
import { rotateDeg, redraw } from '../../store/actions';
import DownUpButtons, { DownUpButtonsProps } from '../../components/DownUpButtons';
import { Icon } from '../../components';

interface NewProps {
  step?: number
  label?: string
  value: [number,number,number,number]
  fontSize?: 'small' | 'default' | 'large' | 'inherit'
  setTransform: (t: [number,number,number,number]) => void
}

interface Props extends NewProps, Omit<DownUpButtonsProps, 'onUp' | 'onDown'> {}

const Rotator = ({step=15, onRotate, ...rest}: Props) => {
  const rotateCCW = () => onRotate(step);
  const rotateCW = () => onRotate(-step);
  
  return (
    <DownUpButtons 
      {...rest}
      onUp={rotateCCW} 
      onDown={rotateCW} 
      downIcon={Icon.RotateRight} 
      upIcon={Icon.RotateLeft}
    />
  )
}



export default connect(
  null,
  (dispatch: any) => ({
    onRotate: (deg: number) => {
      dispatch(rotateDeg(deg));
      dispatch(redraw());
    },
  })
)(Rotator)