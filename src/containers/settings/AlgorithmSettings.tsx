import React from 'react';
import { connect } from 'react-redux';
import { State as AppState } from '../../store/types';
import {
  State,
  MethodName,
  MethodParams,
  JuliaParams,
  JuliaQuadraticParams,
  BurningShipParams,
  MandelbrotParams,
} from '../../store/algorithm/types';
import { update as updateAlgorithm } from '../../store/algorithm/actions';
import { update as updateView, recenter as recenterView } from '../../store/view/actions';
import { setDrawing } from '../../store/draw/actions';
import JuliaSettings from './Julia';
import JuliaQuadraticSettings from './JuliaQuadratic';
import MandelbrotSettings from './Mandelbrot';
import BurningShipSettings from './BurningShip';
import {
  Box,
  Button,
  ButtonGroup,
  MenuItem,
  TextField,
} from '../../components/material';

type Props = {
  value: State,
  onClose: () => void,
  onChange: (method: MethodName, params: MethodParams, x?: {recenter?: boolean, previewPixels?: number}) => void,
}

interface MyState extends State {
  previewPixels?: number
}

class AlgorithmSettings extends React.Component<Props> {
  state: MyState

  constructor(props: Props) {
    super(props);
    this.state = {
      ...props.value,
    };
  }

  apply = () => {
    const {method} = this.state;
    const opts: {recenter: boolean, previewPixels?: number} = {
      recenter: (method !== this.props.value.method) || (method === 'julia'),
    };
    if (this.state.previewPixels) {
      opts.previewPixels = this.state.previewPixels;
    } else {
      opts.previewPixels = 160000
    }
    this.props.onChange(method, this.state[method], opts);
  }

  revert = () => {
    const method = this.state.method;
    this.setState({
      [method]: {...this.props.value[method]},
    });
  }

  changedParams() {
    for (const m of ['julia', 'julia-quadratic', 'mandelbrot', 'burningship']) {
      for (const k in this.state[m]) {
        if (this.state[m][k] !== this.props.value[m][k]) {
          return true;
        }
      }
    }
    return false;
  }

  changedMethod() {
    return this.state.method !== this.props.value.method;
  }

  hasChanged() {
    if (this.changedMethod()) return true;
    if (this.changedParams()) return true;
    return false;
  }

  selectMethod = (evt: any) => this.setState({
    method: evt.target.value,
  });

  updateJulia = (x: Partial<JuliaParams>, p?: {previewPixels?: number}) => {
    this.setState({
      ...p,
      julia: {...this.state.julia, ...x},
    })
  }

  updateJuliaQuadratic = (x: Partial<JuliaQuadraticParams>) => {
    this.setState({
      'julia-quadratic': {...this.state['julia-quadratic'], ...x},
    })
  }

  updateMandelbrot = (x: Partial<MandelbrotParams>) => {
    this.setState({
      mandelbrot: {...this.state.mandelbrot, ...x},
    })
  }

  updateBurningShip = (x: Partial<BurningShipParams>) => {
    this.setState({
      burningship: {...this.state.burningship, ...x},
    })
  }

  renderMethodSettings() {
    if (this.state.method === 'julia') {
      return (
        <JuliaSettings
          onApply={this.apply}
          onChange={this.updateJulia}
          value={this.state['julia']}
        />
      )
    }
    if (this.state.method === 'julia-quadratic') {
      return (
        <JuliaQuadraticSettings
          onApply={this.apply}
          onChange={this.updateJuliaQuadratic}
          value={this.state['julia-quadratic']}
        />
      )
    }
    if (this.state.method === 'mandelbrot') {
      return (
        <MandelbrotSettings
          onApply={this.apply}
          onChange={this.updateMandelbrot}
          value={this.state['mandelbrot']}
        />
      )
    }
    if (this.state.method === 'burningship') {
      return (
        <BurningShipSettings
          onApply={this.apply}
          onChange={this.updateBurningShip}
          value={this.state['burningship']}
        />
      )
    }
  }

  render() {
    const disabled = !this.hasChanged();
    return (
      <>
        <Box>
          <TextField select
            label="Method"
            value={this.state.method}
            onChange={this.selectMethod}
          >
            <MenuItem value="burningship">Burning Ship</MenuItem>
            <MenuItem value="julia-quadratic">Julia (1 term)</MenuItem>
            <MenuItem value="mandelbrot">Mandelbrot</MenuItem>
            <MenuItem value="julia">Other</MenuItem>
          </TextField>
        </Box>
        {this.renderMethodSettings()}

      <ButtonGroup fullWidth color="primary" variant="text">
        <Button 
          onClick={this.apply} 
          disabled={disabled}
        >Apply</Button>
      </ButtonGroup>
      </>
    )
  }
}

export default connect(
  (state: AppState) => ({
    value: state.algorithm,
  }),
  (dispatch) => ({
    onChange: (method: MethodName, params: MethodParams, opts?: {
      recenter?: boolean,
      previewPixels?: number,
    }) => {
      if (opts) {
        if (opts.previewPixels) dispatch(updateView({previewPixels: opts.previewPixels}));
        if (opts.recenter) dispatch(recenterView());
      }
      dispatch(updateAlgorithm(method, params));
      dispatch(setDrawing(true));
    },
  })
)(AlgorithmSettings)