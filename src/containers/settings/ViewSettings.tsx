import React from 'react';
import { connect } from 'react-redux';
import { State as AppState } from '../../store/types';
import { State as ViewState } from '../../store/view/types';
import * as ViewActions from '../../store/view/actions';
import { setDrawing } from '../../store/draw/actions';
import {
  Box,
  Button,
  ButtonGroup,
  InputLabel,
  NumberInput,
} from '../../components';

type Props = {
  current: ViewState
  onClose: () => void
  updateView: (update: Partial<ViewState>) => void
}

class ViewSettings extends React.Component<Props> {
  state: {
    current: ViewState,
  }
  centerStep: number

  constructor(props: Props) {
    super(props);
    this.centerStep = 10 / this.props.current.ppu;
    this.state = {
      current: props.current,
    }
  }

  hasChanged = () => {
    for (const k of ['cx', 'cy', 'w', 'h', 'ppu']) {
      if (this.props.current[k] !== this.state.current[k]) {
        return true;
      }
    }
    return false;
  }

  apply = () => {
    let {cx, cy, w, h, ppu} = this.state.current;
    ppu = ppu * h / this.props.current.h;
    this.props.updateView({cx, cy, w, h, ppu});
  }

  revert = () => {
    this.setState({...this.props.current});
  }

  setCurrent(x: Partial<ViewState>) {
    this.setState({current: {...this.state.current, ...x}});
  }

  setCX = (evt: any) => this.setCurrent({cx: +evt.target.value});
  setCY = (evt: any) => this.setCurrent({cy: +evt.target.value});
  setW = (evt: any) => this.setCurrent({w: +evt.target.value});
  setH = (evt: any) => this.setCurrent({h: +evt.target.value});
  setPPU = (evt: any) => this.setCurrent({ppu: +evt.target.value});
  setPreviewMode = (evt: any) => this.setCurrent({previewMode: evt.target.checked});

  render() {
    return (
      <>
        <Box>
          <InputLabel>Full Resolution</InputLabel>
          <div style={{
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            marginTop: '0.5em',
          }}>
            <NumberInput
              fullWidth={false}
              label="width"
              value={+this.state.current.w} 
              onChange={this.setW}
              step={1}
              min={1}
              inputProps={{style: {width: '4em'}}}
            />
            <NumberInput
              fullWidth={false}
              label="height" 
              value={+this.state.current.h} 
              onChange={this.setH} 
              step={1}
              min={1}
              inputProps={{style: {width: '4em'}}}
            />
          </div>
        </Box>

        <Box>
          <NumberInput
            label="center x-coordinate"
            value={+this.state.current.cx} 
            onChange={this.setCX} 
            step={this.centerStep}
          />
        </Box>

        <Box>
          <NumberInput
            label="center y-coordinate"
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

      <ButtonGroup fullWidth color="primary" variant="text" style={{
        marginTop: '1em'
      }}>
        <Button 
          onClick={this.apply} 
          disabled={!this.hasChanged()}
        >Apply</Button>
      </ButtonGroup>
      </>
    )
  }
  
}

export default connect(
  (state: AppState) => ({current: state.view}),
  (dispatch) => ({
    updateView: (update: Partial<ViewState>) => {
      dispatch(ViewActions.update(update));
      dispatch(setDrawing(true));
    }
  })
)(ViewSettings)