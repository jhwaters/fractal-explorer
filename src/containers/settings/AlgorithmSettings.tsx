import React from 'react';
import { connect } from 'react-redux';
import { State as AppState, Dispatch } from '../../store/types';
import { State as AlgState, FractalKey, Params } from '../../store/algorithm/types';
import { setFractal } from '../../store/algorithm/actions';
import { startDrawing } from '../../store/ui/actions'
import { recenter } from '../../store/view/actions';
import { SettingsContainer, TextWithMath } from '../../components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

type Props = {
  algorithm: AlgState
  setFractal: (key: FractalKey) => void
  onClose?: () => void
}

const StyledMenuItem = withStyles({
})(MenuItem)

interface State {
  current: FractalKey,
  params: Params,
}

class AlgorithmSettings extends React.Component<Props> {
  state: State

  constructor(props: Props) {
    super(props);
    this.state = {
      current: props.algorithm.current,
      params: {...props.algorithm.params},
    };
  }

  selectMethod = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({current: evt.target.value});
  }

  apply = () => {
    this.props.setFractal(this.state.current)
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  reset = () => {
    this.setState({
      current: this.props.algorithm.current,
      params: {...this.props.algorithm.params},
    })
  }

  render() {
    return (
      <SettingsContainer>
        <Box m={1}>
          <Box m={1}>
            <TextField select
              label="Method"
              value={this.state.current}
              onChange={this.selectMethod}
              style={{maxWidth: '300px'}}
            >
              {Object.keys(this.props.algorithm.fractals).sort().map(k => {
                return (
                  <StyledMenuItem key={k} value={k}>
                      <TextWithMath 
                        data={this.props.algorithm.fractals[k].label}
                        typographyProps={{
                          variant: 'caption',
                        }}
                      />
                  </StyledMenuItem>
                )
              })}
            </TextField>
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
    algorithm: state.algorithm,
  }),
  (dispatch: Dispatch) => ({
    setFractal: (key: FractalKey) => {
      dispatch(setFractal(key))
      dispatch(recenter())
      dispatch(startDrawing())
    },
  })
)(AlgorithmSettings)