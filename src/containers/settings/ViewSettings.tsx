import React from 'react';
import { connect } from 'react-redux';
import { State, Dispatch } from '../../store/types';
import { ViewState } from '../../store/fractal/view/types';
import { updateView } from '../../store/fractal/actions';
import { redraw } from '../../store/ui/actions';
import { NumberInput, SettingsContainer } from '../../components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';

type Props = {
  current: ViewState
  updateView: (update: Partial<ViewState>) => void
  onClose?: () => void
}

type Evt = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

class ViewSettings extends React.Component<Props> {
  state: {
    current: ViewState,
  }
  centerStep: number

  constructor(props: Props) {
    super(props);
    this.centerStep = 10 / this.props.current.ppu;
    this.state = {
      current: {...props.current},
    }
  }

  hasChanged = () => {
    if (this.props.current.cx !== this.state.current.cx) return true;
    if (this.props.current.cy !== this.state.current.cy) return true;
    if (this.props.current.w !== this.state.current.w) return true;
    if (this.props.current.h !== this.state.current.h) return true;
    if (this.props.current.ppu !== this.state.current.ppu) return true;
    if (this.props.current.pixelCount !== this.state.current.pixelCount) return true;
    return false;
  }

  apply = () => {
    this.props.updateView(this.state.current);
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  revert = () => {
    this.setState({current: {...this.props.current}});
  }

  setCurrent(x: Partial<ViewState>) {
    this.setState({current: {...this.state.current, ...x}});
  }

  setCX = (evt: Evt) => this.setCurrent({cx: +evt.target.value});
  setCY = (evt: Evt) => this.setCurrent({cy: +evt.target.value});
  setW = (evt: Evt) => this.setCurrent({w: +evt.target.value});
  setH = (evt: Evt) => this.setCurrent({h: +evt.target.value});
  setPPU = (evt: Evt) => this.setCurrent({ppu: +evt.target.value});
  setPixelCount = (evt: Evt) => this.setCurrent({pixelCount: +evt.target.value});


  render() {
    return (
      <SettingsContainer
      >
        <Box m={1}>
        <Box m={1}>
          <InputLabel>Relative Dimensions</InputLabel>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <NumberInput
                fullWidth={false}
                label="Width"
                value={+this.state.current.w} 
                onChange={this.setW}
                step={1}
                min={1}
                inputProps={{style: {maxWidth: '5em'}}}
              />
            </Grid>
            <Grid item xs={6}>
              <NumberInput
                fullWidth={false}
                label="Height" 
                value={+this.state.current.h} 
                onChange={this.setH} 
                step={1}
                min={1}
                inputProps={{style: {maxWidth: '5em'}}}
              />
            </Grid>
          </Grid>

          <Box>
            <NumberInput
              label="Pixel count"
              value={+this.state.current.pixelCount} 
              onChange={this.setPixelCount} 
              step={10000}
              min={10000}
            />
          </Box>

          <Box>
            <NumberInput
              label="Center x-coordinate"
              value={+this.state.current.cx} 
              onChange={this.setCX} 
              step={this.centerStep}
            />
          </Box>

          <Box>
            <NumberInput
              label="Center y-coordinate"
              value={+this.state.current.cy} 
              onChange={this.setCY} 
              step={this.centerStep}
            />
          </Box>

          <Box>
            <NumberInput
              label="Scale (pixels per unit)"
              value={+this.state.current.ppu} 
              onChange={this.setPPU} 
              step={10}
              min={0}
            />
          </Box>

          <ButtonGroup fullWidth color="primary" orientation="vertical">
            <Button 
              onClick={this.apply}
              disabled={!this.hasChanged()}
            >Apply</Button>
            <Button
              onClick={this.revert}
              disabled={!this.hasChanged()}
            >Reset</Button>

          </ButtonGroup>
        </Box>
      </Box>
      </SettingsContainer>
    )
  }
  
}

export default connect(
  (state: State) => ({
    current: state.fractal.view,
  }),
  (dispatch: Dispatch) => ({
    updateView: (update: Partial<ViewState>) => {
      dispatch(updateView(update));
      dispatch(redraw());
    },
  })
)(ViewSettings)