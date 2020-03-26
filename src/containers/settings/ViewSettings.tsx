import React from 'react';
import { connect } from 'react-redux';
import { State as AppState } from '../../store/types';
import { State as ViewState } from '../../store/view/types';
import * as ViewActions from '../../store/view/actions';
import { startDrawing } from '../../store/ui/actions';
import { NumberInput, SettingsContainer } from '../../components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';

type Props = {
  current: ViewState
  updateView: (update: Partial<ViewState>) => void
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
    for (const k in this.props.current) {
      if (this.props.current[k] !== this.state.current[k]) {
        return true;
      }
    }
    return false;
  }

  apply = () => {
    let {h, ppu, ...rest} = this.state.current;
    this.props.updateView({h, ppu, ...rest});
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
  setPreviewPixels = (evt: Evt) => this.setCurrent({previewPixels: +evt.target.value});


  render() {
    return (
      <SettingsContainer
      >
        <Box m={1}>
        <Box m={1}>
          <InputLabel>Full Resolution</InputLabel>
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
              label="Preview pixel count"
              value={+this.state.current.previewPixels} 
              onChange={this.setPreviewPixels} 
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

          <ButtonGroup fullWidth color="primary">
            <Button
              onClick={this.revert}
              disabled={!this.hasChanged()}
            >Reset</Button>
            <Button 
              onClick={this.apply}
              disabled={!this.hasChanged()}
            >Apply</Button>
          </ButtonGroup>
        </Box>
      </Box>
      </SettingsContainer>
    )
  }
  
}

export default connect(
  (state: AppState) => ({
    current: state.view,
  }),
  (dispatch) => ({
    updateView: (update: Partial<ViewState>) => {
      dispatch(ViewActions.update(update));
      dispatch(startDrawing());
    },
  })
)(ViewSettings)