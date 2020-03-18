import React from 'react';
import { TextField } from './material';


function checkNumber(s: string) {
  if (s === '') {
    return true
  }
  if (!isNaN(+s)) {
    return true
  }
  return false
}

type Props = {
  [k: string]: any,
  step?: number,
  min?: number,
  max?: number,
  inputProps?: any,
  value?: number | string,
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void,
}

class NumberInput extends React.Component<Props> {
  state: {isEmpty: boolean}

  constructor(props: Props) {
    super(props);
    this.state = {
      isEmpty: false
    }
  }

  onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const s = evt.target.value;
    if (s === '') {
      this.setState({isEmpty: true})
    } else {
      this.setState({isEmpty: false})
    }
    if (this.props.onChange) {
      if (!isNaN(+s)) {
        this.props.onChange(evt)
      }
    }
  }

  render() {
    const {step, min, max, inputProps, onChange, value, ...rest} = this.props;
    return React.createElement(TextField, {
      type: 'number',
      value: value ? value : this.state.isEmpty ? '' : value,
      inputProps: {step, min, max, ...inputProps},
      onChange: this.onChange,
      ...rest, 
    })
  }
}


export default NumberInput