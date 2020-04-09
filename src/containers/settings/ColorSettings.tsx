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
  NumberInput,
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
  mirror: boolean
  reverse: boolean
  skew: number
  count: 'iter' | number
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
    schemeName: string
    mirror: boolean
    reverse: boolean
    skew: number
    count: 'iter' | number

    customPopup: boolean
    showCount: boolean
    countInput: number
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      schemeName: props.current.schemeName,
      mirror: props.current.mirror,
      reverse: props.current.reverse,
      skew: props.current.skew,
      count: props.current.count,

      showCount: props.current.count !== 'iter',
      countInput: props.current.count === 'iter' ? 60 : props.current.count,
      customPopup: false,
    }
  }

  openCustomPopup = () => this.setState({customPopup: true})
  closeCustomPopup = () => this.setState({customPopup: false})


  setScheme(schemeName: string) {
    this.setState({schemeName});
  }

  changeMirror = (evt: Evt) => this.setState({mirror: evt.target.checked});
  changeReverse = (evt: Evt) => this.setState({reverse: evt.target.checked});
  changeSkew = (evt: any, skew: number | number[]) => {
    if (typeof skew === 'number') this.setState({skew});
    else console.log(skew);
  }
  checkCount = (evt: Evt) => {
    if (evt.target.checked) {
      this.setState({
        showCount: false,
        count: 'iter',
        mirror: false,
      })
    } else {
      this.setState({
        showCount: true,
        count: this.state.countInput,
        mirror: true
      })
    }
  }

  changeCount = (evt: Evt) => {
    if (this.state.showCount) {
      const count = +evt.target.value;
      this.setState({count, countInput: count});
    } else {
      this.setState({countInput: +evt.target.value});
    }
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
    if (this.state.schemeName !== this.props.current.schemeName
      || this.state.mirror !== this.props.current.mirror
      || this.state.reverse !== this.props.current.reverse
      || this.state.skew !== this.props.current.skew
      || this.state.count !== this.props.current.count) {
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
      schemeName: this.state.schemeName,
      scheme: this.props.schemeList[this.state.schemeName],
      mirror: this.state.mirror,
      reverse: this.state.reverse,
      skew: this.state.skew,
      count: this.state.count === 'iter' ? 0 : this.state.count,
    });
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  revert = () => {
    this.setState({
      schemeName: this.props.current.schemeName,
      mirror: this.props.current.mirror,
      reverse: this.props.current.reverse,
      skew: this.props.current.skew,
      count: this.props.current.count,
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
                value={this.state.schemeName}
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
                  <Switch checked={this.state.reverse}
                    onChange={this.changeReverse}
                    edge="end"
                  />
                }
              />
            </Box>

            <Box m={2}>
              <FormControlLabel
                label="Match Iterations"
                control={
                  <Switch checked={!this.state.showCount}
                    onChange={this.checkCount}
                    edge="end"
                  />
                }
              />
            </Box>

            <Box m={2} style={this.state.showCount ? {} : {display: 'none'}}>
              <FormControlLabel
                label="Mirror"
                control={
                  <Switch checked={this.state.mirror}
                    onChange={this.changeMirror}
                    edge="end"
                  />
                }
              />
            </Box>

            <Box m={2} style={this.state.showCount ? {} : {display: 'none'}}>
              <NumberInput
                label="Count"
                value={this.state.countInput}
                onChange={this.changeCount}
                min={2}
                step={1}
                emptyValue={2}
              />
            </Box>

            <Box m={2}>
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
                scheme={this.props.schemeList[this.state.schemeName]}
                mirror={this.state.mirror}
                reverse={this.state.reverse}
                skew={this.state.skew}
                width={100}
                height={10}
              />
            </Box>

            <Box m={1}>
              <ColorPreview 
                style={{width: '100%', height: '4mm'}}
                scheme={this.props.schemeList[this.state.schemeName]}
                mirror={this.props.current.mirror}
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
    current: {
      ...state.fractal.color,
      count: state.fractal.color.count === 0 ? 'iter' : state.fractal.color.count
    } as Colors,
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