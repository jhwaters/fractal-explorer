import React from 'react';
import { connect } from 'react-redux';
import { State as AppState, Dispatch } from '../../store/types';
import { Method } from '../../store/fractal/algorithm/types';
import { setAlgorithm, recenter } from '../../store/fractal/actions';
import { redraw } from '../../store/ui/actions'
import {
  SettingsContainer, 
  Select,
  Option,
  OptionLabel,
} from '../../components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';


type Props = {
  methodName: string
  params: object
  methodList: {[k: string]: Method<any>}
  setAlgorithm: <T extends object>(methodName: string, method: Method<T>, params?: T) => void
  onClose?: () => void
}


interface State {
  methodName: string,
  method: Method<any>
  params: object,
}

class AlgorithmSettings extends React.Component<Props> {
  state: State

  constructor(props: Props) {
    super(props);
    this.state = {
      methodName: props.methodName,
      method: props.methodList[props.methodName],
      params: {...props.params},
    };
  }

  selectMethod = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const methodName = evt.target.value;
    const method = this.props.methodList[methodName]
    this.setState({methodName, method, params: method.newParams()});
  }

  apply = () => {
    const {methodName, method, params} = this.state;
    this.props.setAlgorithm(methodName, method, params)
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  reset = () => {
    const {methodName, params} = this.props;
    this.setState({
      methodName,
      method: this.props.methodList[methodName],
      params: {...params},
    });
  }

  render() {
    return (
      <SettingsContainer>
        <Box m={1}>
          <Box m={1}>
            <Select select
              label="Method"
              value={this.state.methodName}
              onChange={this.selectMethod}
            >
              {Object.keys(this.props.methodList).map(k => {
                return (
                  <Option key={k} value={k}>
                    <OptionLabel
                      data={this.props.methodList[k].label}
                    />
                  </Option>
                )
              })}
            </Select>
          </Box>
          <Box m={1}>
            <ButtonGroup fullWidth color="primary" orientation="vertical">
              <Button fullWidth onClick={this.apply}>Apply</Button>
              <Button fullWidth onClick={this.reset}>Reset</Button>
            </ButtonGroup>
          </Box>
        </Box>
      </SettingsContainer>
    )
  }
}

export default connect(
  (state: AppState) => ({
    methodName: state.fractal.algorithm.methodName,
    methodList: state.ui.methodList,
    params: state.fractal.algorithm.params,
  }),
  (dispatch: Dispatch) => ({
    setAlgorithm: function<T>(methodName: string, method: Method<T>, params?: T) {
      dispatch(setAlgorithm(methodName, method, params))
      dispatch(recenter())
      dispatch(redraw())
    },
  })
)(AlgorithmSettings)