import React from 'react';
import { connect } from 'react-redux';
import {
  NumberIncrementer,
  ComplexIncrementer,
 } from '../../components';
import {
  ControlProps, ControlType, Params, 
  ControlNumber, ControlComplex, ControlCall,
} from '../../fractals/algorithm/types'
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { Icon } from '../../components';
import { State, Dispatch } from '../../store/types';
import { fractal } from '../../fractals';
import { updateParams, redraw } from '../../store/actions';


interface Props {
  controls: ControlProps[]
  params: Params
  onChange: (x: Params) => void
}

class ParamControls extends React.Component<Props> {

  paramUpdater = (k: string) => {
    return (v: any) => {
      //console.log("setting " + k + ' => ' + v);
      this.props.onChange({[k]: v});
    }
  }

  renderNumberIncrementer(x: ControlNumber) {
    const {param} = x;
    return (
      <NumberIncrementer
        key={'number-'+param}
        controlProps={x}
        value={this.props.params[param]}
        onChange={this.paramUpdater(param)}
      />
    )
  }

  renderComplexIncrementer(x: ControlComplex) {
    const {param} = x;
    return (
      <ComplexIncrementer
        key={'complex-'+param}
        controlProps={x}
        value={this.props.params[param]}
        onChange={this.paramUpdater(param)}
      />
    )
  }

  renderCall(x: ControlCall) {
    const {icon, label} = x;
    if (label && icon === 'Random') {
      return (
        <Button
          key={'action-'+label}
          variant="outlined"
          color="inherit"
          size="small"
          onClick={() => this.props.onChange(x.onCall())}
          startIcon={<Icon.Random/>}
        >{x.label}</Button>
      )
    }
    if (!label && icon === 'Random') {
      return (
        <IconButton key={'action-'+icon} onClick={() => this.props.onChange(x.onCall())}>
          <Icon.Random/>
        </IconButton>
      )
    }
    if (label) {
      return (
        <Button
          key={'action-'+label}
          variant="outlined"
          size="small"
          onClick={() => this.props.onChange(x.onCall())}
        >{x.label}</Button>
      )
    }
  }

  renderControl(x: ControlProps) {
    if (x.type === ControlType.Number) {
      return this.renderNumberIncrementer(x);
    }
    if (x.type === ControlType.Complex) {
      return this.renderComplexIncrementer(x);
    }
    if (x.type === ControlType.Call) {
      return this.renderCall(x);
    }
    return null;
  }


  render() {
    return (
      <>
        {this.props.controls.map(x => this.renderControl(x))}
      </>
    )
  }
}

export default connect(
  (state: State) => ({
    controls: [...fractal(state.fractal.algorithm).controls],
    params: {...state.fractal.algorithm.params},
  }),
  (dispatch: Dispatch) => ({
    onChange: (x: Params) => {
      dispatch(updateParams(x));
      dispatch(redraw());
    },
  })
)(ParamControls)