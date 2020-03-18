import React from 'react';
import { connect } from 'react-redux';
import { State as AppState } from '../../store/types';
import * as ColorTypes from '../../store/color/types';
import { update as updateColor, addScheme } from '../../store/color/actions';
import { setRecolor } from '../../store/draw/actions';
import { ColorPreview } from '../../components';
import CustomColor from './CustomColor';
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Popover,
  Slider,
  Switch,
  TextField,
} from '../../components'

type Props = {
  current: ColorTypes.State,
  onClose: () => void,
  updateColor: (update: Partial<ColorTypes.State>) => void;
  addScheme: (k: string, colors: string[]) => void;
}

class ColorSettings extends React.Component<Props> {
  state: {
    scheme: ColorTypes.SchemeName,
    reverse: boolean,
    skew: number,
    customPopup: boolean,
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      scheme: props.current.scheme,
      reverse: props.current.reverse,
      skew: props.current.skew,
      customPopup: false,
    }
  }

  openCustomPopup = () => this.setState({customPopup: true})
  closeCustomPopup = () => this.setState({customPopup: false})

  setScheme(scheme: string) {
    this.setState({scheme});
  }

  changeReverse = (evt: any) => this.setState({reverse: evt.target.checked});
  changeSkew = (evt: any, skew: number | number[]) => this.setState({skew});

  selectScheme = (evt: any) => {
    const scheme = evt.target.value;
    if (scheme === 'CUSTOM') {
      this.openCustomPopup();
    } else {
      this.setScheme(scheme);
    }
  }

  hasChanged = () => {
    if (this.state.scheme !== this.props.current.scheme) return true;
    if (this.state.reverse !== this.props.current.reverse) return true;
    if (this.state.skew !== this.props.current.skew) return true;
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
    });
  }

  render() {
    return (
      <>
        <Box>
          <TextField select
            size="small"
            label="Scheme"
            value={this.state.scheme}
            onChange={this.selectScheme}
          >
            <MenuItem value="CUSTOM">CREATE NEW SCHEME</MenuItem>
            {this.props.current.schemeList.map(k => (
              <MenuItem key={k} value={k}>{k}</MenuItem>
            ))}
            {Object.keys(this.props.current.customSchemes).map(k => (
              <MenuItem key={k} value={k}>{k}</MenuItem>
            ))}
          </TextField>
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

        <Box>
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

        <Box>
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

        <Box>
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

        <ButtonGroup fullWidth color="primary" variant="text">
        <Button 
          onClick={this.apply}
          disabled={!this.hasChanged()}
        >Apply</Button>
        </ButtonGroup>

        <Popover
          open={this.state.customPopup}
          onClose={this.closeCustomPopup}
        >
          <Box>
            <InputLabel>New Colorscheme</InputLabel>
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
  (state: AppState) => ({current: state.color}),
  (dispatch) => ({
    updateColor: (updates: Partial<ColorTypes.State>) => {
      dispatch(updateColor(updates));
      dispatch(setRecolor(true));
    },
    addScheme: (k: string, colors: string[]) => {
      dispatch(addScheme(k, colors));
    }
  }),
)(ColorSettings);