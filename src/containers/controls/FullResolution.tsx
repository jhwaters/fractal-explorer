import React from 'react';
import { connect } from 'react-redux';
import { State as AppState } from '../../store/types';
import { setDrawing } from '../../store/draw/actions';
import {
  Button,
} from '../../components/material';

type Props = {
  fullResolution: boolean
  drawing: boolean
  setDrawing: (d: boolean, f?: boolean) => void
}

class FullResolution extends React.Component<Props> {

  draw = () => this.props.setDrawing(true);
  drawFull = () => this.props.setDrawing(true, true);

  render() {
    if (this.props.fullResolution) {
      return (
        <Button 
          onClick={this.draw}
          disabled={this.props.drawing}
        >Exit Full Resolution</Button>
      )
    } else {
      return (
        <Button 
          onClick={this.drawFull}
          disabled={this.props.drawing}
        >Render Full Resolution</Button>
      )
    }
  }
}

export default connect(
  (state: AppState) => ({
    drawing: state.draw.drawing,
    fullResolution: state.draw.fullResolution,
  }),
  (dispatch: any) => ({
    setDrawing: (x: boolean, y?: boolean) => dispatch(setDrawing(x, y)),
  })
)(FullResolution);