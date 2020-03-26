import React from 'react';
import { connect } from 'react-redux';
import { State as AppState } from '../../store/types';
import * as ColorTypes from '../../store/color/types';
import { update as updateColor, addScheme } from '../../store/color/actions';
import { setCanvasAction } from '../../store/ui/actions';
import { CanvasAction } from '../../store/ui/types';
import {
  ColorPreview,
  SettingsContainer,
  Select,
  Option,
  OptionLabel,
} from '../../components';
import CustomColor from './CustomColor';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Popover from '@material-ui/core/Popover';
import Slider from '@material-ui/core/Slider';
import Switch from '@material-ui/core/Switch';


type Props = {
  current: ColorTypes.State,
  updateColor: (update: Partial<ColorTypes.State>) => void
  addScheme: (k: string, colors: string[]) => void
  onClose?: () => void
}


type Evt = any

class ColorSettings extends React.Component<Props> {
  state: {
    scheme: ColorTypes.SchemeName,
    reverse: boolean,
    skew: number,
    adaptiveScale: boolean,
    customPopup: boolean,
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      scheme: props.current.scheme,
      reverse: props.current.reverse,
      skew: props.current.skew,
      adaptiveScale: props.current.adaptiveScale,
      customPopup: false,
    }
  }

  openCustomPopup = () => this.setState({customPopup: true})
  closeCustomPopup = () => this.setState({customPopup: false})

  setScheme(scheme: string) {
    this.setState({scheme});
  }

  changeReverse = (evt: Evt) => this.setState({reverse: evt.target.checked});
  changeSkew = (evt: Evt, skew: number | number[]) => this.setState({skew});

  changeAdaptiveScale = (evt: Evt) => this.setState({adaptiveScale: evt.target.checked})

  selectScheme = (evt: any) => {
    const scheme = evt.target.value;
    if (scheme === 'CUSTOM') {
      this.openCustomPopup();
    } else {
      this.setScheme(scheme);
    }
  }

  hasChanged = () => {
    if (this.state.scheme !== this.props.current.scheme
      || this.state.reverse !== this.props.current.reverse
      || this.state.adaptiveScale !== this.props.current.adaptiveScale
      || this.state.skew !== this.props.current.skew) {
      return true;
    }
    return false;
  }

  saveScheme = (k: string, colors: string[]) => {
    this.props.addScheme(k, colors);
    this.setScheme(k);
  }

  apply = () => {
    this.props.updateColor({
      scheme: this.state.scheme,
      reverse: this.state.reverse,
      skew: this.state.skew,
      adaptiveScale: this.state.adaptiveScale,
    });
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  revert = () => {
    this.setState({
      scheme: this.props.current.scheme,
      reverse: this.props.current.reverse,
      skew: this.props.current.skew,
    })
  }

  render() {
    return (
      <>
        <SettingsContainer>
          <Box m={1}>
            <Box m={1}>
              <Select select
                label="Scheme"
                value={this.state.scheme}
                onChange={this.selectScheme}
              >
                <Option value="CUSTOM">
                  <OptionLabel data="CREATE NEW SCHEME"/>
                </Option>
                {this.props.current.schemeList.sort().map(k => (
                  <Option key={k} value={k}>
                    <OptionLabel data={k}/>
                  </Option>
                ))}
                {Object.keys(this.props.current.customSchemes).sort().map(k => (
                  <Option key={k} value={k}>
                    <OptionLabel data={k}/>
                  </Option>
                ))}
              </Select>
            </Box>
            <Box m={2}>
              <FormControlLabel
                label="Reversed"
                control={
                  <Switch checked={this.state.reverse}
                    onChange={this.changeReverse}
                    edge="end"
                  />
                }
              />
            </Box>

            <Box m={2}>
              <FormControlLabel
                label="Adaptive Scale"
                control={
                  <Switch checked={this.state.adaptiveScale}
                    onChange={this.changeAdaptiveScale}
                    edge="end"
                  />
                }
              />
            </Box>

            <Box m={2} style={this.state.adaptiveScale ? {display: 'none'} : {}}>
              <FormControl fullWidth>
                <InputLabel shrink>Skew</InputLabel>
                <Slider
                  color="secondary"
                  value={this.state.skew}
                  onChange={this.changeSkew}
                  min={-5}
                  max={5}
                  step={0.1}
                />
              </FormControl>
            </Box>

            <Box m={1}>
              <ColorPreview 
                style={{width: '100%', height: '4mm'}}
                scheme={this.state.scheme}
                customSchemes={this.props.current.customSchemes}
                reverse={this.state.reverse}
                skew={this.state.skew}
                width={100}
                height={10}
              />
            </Box>

            <Box m={1}>
              <ColorPreview 
                style={{width: '100%', height: '4mm'}}
                scheme={this.props.current.scheme}
                customSchemes={this.props.current.customSchemes}
                reverse={this.props.current.reverse}
                skew={this.props.current.skew}
                width={100}
                height={10}
              />
              <InputLabel>Current</InputLabel>
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
        </SettingsContainer>

        <Popover
          open={this.state.customPopup}
          onClose={this.closeCustomPopup}
        >
          <Box m={2}>
            <CustomColor
              onSave={this.saveScheme}
              onClose={this.closeCustomPopup}
              takenNames={[
                ...this.props.current.schemeList,
                ...Object.keys(this.props.current.customSchemes)
              ]}
            />
          </Box>
        </Popover>
      </>
    )
  }
}

export default connect(
  (state: AppState) => ({
    current: {...state.color},
  }),
  (dispatch) => ({
    updateColor: (updates: Partial<ColorTypes.State>) => {
      dispatch(updateColor(updates));
      dispatch(setCanvasAction(CanvasAction.Color));
    },
    addScheme: (k: string, colors: string[]) => {
      dispatch(addScheme(k, colors));
    },
  }),
)(ColorSettings);