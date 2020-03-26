import React from 'react';
import { connect } from 'react-redux';
import { State, Dispatch } from '../../store/types'; 
import { Nav } from '../../store/ui/types';
import { setNav } from '../../store/ui/actions';
import Zoom from './Zoom';
import ParamControls from './ParamControls';
import Iterator from './Iterator';
import RecenterButton from './Recenter';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { withStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


type Props = {
  nav: Nav,
  setNav: (nav: Nav) => void
}

const OuterBox = withStyles((theme: Theme) => ({
  root: {
    //position: 'absolute',
    //bottom: '0',
    width: '100%',
    backgroundColor: theme.palette.background.default + '99',
  }
}))(Paper);

const CenteringBox = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: '70px',
    justifyContent: 'space-around',
  }
})(Box)


class Controls extends React.Component<Props> {

  closeNav = () => {
    this.props.setNav(Nav.None)
  }

  render() {
    const parameters = this.props.nav === Nav.Params ? {} : {display: 'none'}
    const navigation = this.props.nav === Nav.Navigate ? {} : {display: 'none'}
    const help = this.props.nav === Nav.Help ? {padding: '1em'} : {display: 'none'}
    return (
      <OuterBox elevation={0}>
        <CenteringBox style={parameters}>
          <ParamControls/>
        </CenteringBox>
        <CenteringBox style={navigation}>
          <Iterator fontSize="large"/>
          <Zoom factor={2} fontSize="large" label="Zoom"/>
          <RecenterButton color="inherit"/>
        </CenteringBox>
        <CenteringBox style={help}>
          <Typography variant="caption">
            Double-click the fractal to re-center it.
            Click the formula at the top of the screen for information
            about how the current fractal was generated.
          </Typography>
        </CenteringBox>
      </OuterBox>
    )
  }
}

export default connect(
  (state: State) => ({nav: state.ui.nav}),
  (dispatch: Dispatch) => ({
    setNav: (nav: Nav) => dispatch(setNav(nav)),
  })
)(Controls)