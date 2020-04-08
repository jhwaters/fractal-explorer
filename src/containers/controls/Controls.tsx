import React from 'react';
import { connect } from 'react-redux';
import { State } from '../../store/types'; 
import { Nav } from '../../store/ui/types';
import Zoom from './Zoom';
import Rotator from './Rotator';
import ParamControls from './ParamControls';
import Iterator from './Iterator';
import ControlPanel from './ControlPanel';

type Props = {
  nav: Nav,
}

class Controls extends React.Component<Props> {

  render() {
    return (
      <>
        <ControlPanel visible={this.props.nav === Nav.Params}>
          <ParamControls/>
        </ControlPanel>
        <ControlPanel visible={this.props.nav === Nav.Explore}>
          <Iterator fontSize="large"/>
          <Zoom factor={2} fontSize="large"/>
          <Rotator fontSize="large"/>
        </ControlPanel>
      </>
    )
  }
}

export default connect(
  (state: State) => ({nav: state.ui.nav}),
)(Controls)