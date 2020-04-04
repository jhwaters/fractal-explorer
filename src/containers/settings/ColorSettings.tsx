import React from 'react';
import { connect } from 'react-redux';
import { State as AppState } from '../../store/types';
import { ColorState, ColorScheme } from '../../store/fractal/color/types';
import { updateColor, recolor, addColorScheme } from '../../store/actions';
import {
  ColorPreview,
  SettingsContainer,
  Select,
  Option,
  OptionLabel,
  CustomColor,
} from '../../components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Popover from '@material-ui/core/Popover';
import Slider from '@material-ui/core/Slider';
import Switch from '@material-ui/core/Switch';


interface Colors {
  schemeName: string
  reverse: boolean
  skew: number
}


type Props = {
  current: Colors
  updateColor: (update: Partial<ColorState>) => void
  addScheme: (name: string, scheme: string[]) => void
  onClose?: () => void
  schemeList: {[k: string]: ColorScheme}
}


type Evt = React.ChangeEvent<HTMLInputElement>

class ColorSettings extends React.Component<Props> {
  state: {
    current: Colors
    customPopup: boolean
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      current: {
        schemeName: props.current.schemeName,
        reverse: props.current.reverse,
        skew: props.current.skew,
      },
      customPopup: false,
    }
  }

  openCustomPopup = () => this.setState({customPopup: true})
  closeCustomPopup = () => this.setState({customPopup: false})

  setCurrent(x: Partial<Colors>) {
    this.setState({...this.state, current: {...this.state.current, ...x}});
  }

  setScheme(schemeName: string) {
    this.setCurrent({schemeName});
  }

  changeReverse = (evt: Evt) => this.setCurrent({reverse: evt.target.checked});
  changeSkew = (evt: any, skew: number | number[]) => {
    if (typeof skew === 'number') this.setCurrent({skew});
    else console.log(skew);
  }

  selectScheme = (evt: any) => {
    const scheme = evt.target.value;
    if (scheme === 'CUSTOM') {
      this.openCustomPopup();
    } else {
      this.setScheme(scheme);
    }
  }

  hasChanged = () => {
    if (this.state.current.schemeName !== this.props.current.schemeName
      || this.state.current.reverse !== this.props.current.reverse
      || this.state.current.skew !== this.props.current.skew) {
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
      schemeName: this.state.current.schemeName,
      scheme: this.props.schemeList[this.state.current.schemeName],
      reverse: this.state.current.reverse,
      skew: this.state.current.skew,
    });
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  revert = () => {
    this.setState({
      schemeName: this.props.current.schemeName,
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
                value={this.state.current.schemeName}
                onChange={this.selectScheme}
              >
                <Option value="CUSTOM">
                  <OptionLabel data="CREATE NEW SCHEME"/>
                </Option>
                {Object.keys(this.props.schemeList).sort().map(k => (
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
                  <Switch checked={this.state.current.reverse}
                    onChange={this.changeReverse}
                    edge="end"
                  />
                }
              />
            </Box>

            <Box m={2}>
              <FormControl fullWidth>
                <InputLabel shrink>Skew</InputLabel>
                <Slider
                  color="secondary"
                  value={this.state.current.skew}
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
                scheme={this.props.schemeList[this.state.current.schemeName]}
                reverse={this.state.current.reverse}
                skew={this.state.current.skew}
                width={100}
                height={10}
              />
            </Box>

            <Box m={1}>
              <ColorPreview 
                style={{width: '100%', height: '4mm'}}
                scheme={this.props.schemeList[this.state.current.schemeName]}
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
              takenNames={Object.keys(this.props.schemeList)}
            />
          </Box>
        </Popover>
      </>
    )
  }
}

export default connect(
  (state: AppState) => ({
    current: {...state.fractal.color},
    schemeList: state.ui.colorSchemeList,
  }),
  (dispatch) => ({
    updateColor: (updates: Partial<ColorState>) => {
      dispatch(updateColor(updates));
      dispatch(recolor());
    },
    addScheme: (k: string, colors: string[]) => {
      dispatch(addColorScheme(k, colors));
    },
  }),
)(ColorSettings);