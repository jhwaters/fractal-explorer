import React from 'react';
import TextField, { 
  StandardTextFieldProps,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
} from '@material-ui/core/TextField';


interface NewProps {
  value?: number
  step?: number
  min?: number
  max?: number
  emptyValue?: number
}

interface StandardNumberInputProps
  extends NewProps, Omit<StandardTextFieldProps, 'value' | 'type'> {}

interface FilledNumberInputProps
  extends NewProps, Omit<FilledTextFieldProps, 'value' | 'type'> {}

interface OutlinedNumberInputProps
  extends NewProps, Omit<OutlinedTextFieldProps, 'value' | 'type'> {}

type NumberInputProps = 
  StandardNumberInputProps | 
  FilledNumberInputProps | 
  OutlinedNumberInputProps;


class NumberInput extends React.Component<NumberInputProps> {
  state: {isEmpty: boolean}

  constructor(props: NumberInputProps) {
    super(props);
    this.state = {
      isEmpty: false
    }
  }

  onChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  onBlur = (evt: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (this.props.onBlur) {
      this.props.onBlur(evt);
    }
    this.setState({isEmpty: false});
  }


  render() {
    const {step, min, max, inputProps, onChange, onBlur, value='', emptyValue=0, ...rest} = this.props;
    return React.createElement(TextField, {
      type: 'number',
      value: value ? +value : this.state.isEmpty ? '' : emptyValue,
      inputProps: {step, min, max, ...inputProps},
      onChange: this.onChange,
      onBlur: this.onBlur,
      ...rest, 
    })
  }
}


export default NumberInput