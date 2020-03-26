import React from 'react';
import { ControlNumber } from '../fractals/types'
import DownUpButtons, { DownUpButtonsProps } from './DownUpButtons';


interface NewProps {
  controlProps: ControlNumber
  value: number
  onChange: (x: number) => void
}

interface Props extends NewProps, Omit<DownUpButtonsProps, 'label' | 'onDown' | 'onUp'> {}

class NumberIncrementer extends React.Component<Props> {

  setValue(v: number) {
    this.props.onChange(v)
  }

  incrementDown() {
    const {min, step} = this.props.controlProps;
    const v = this.props.value - step;
    if (min !== undefined) {
      return Math.max(min, v)
    }
    return v;
  }

  incrementUp() {
    const {max, step} = this.props.controlProps;
    const v = this.props.value + step;
    if (max !== undefined) {
      return Math.min(max, v)
    }
    return v;
  }

  onClickDown = () => {
    this.setValue(this.incrementDown())
  }

  onClickUp = () => {
    this.setValue(this.incrementUp())
  }


  render() {
    const {controlProps, params, onChange, ...rest} = this.props;
    return (
      <DownUpButtons
        {...rest}
        label={controlProps.label}
        onDown={this.onClickDown}
        onUp={this.onClickUp}
      />
    )
  }
}

export default NumberIncrementer
