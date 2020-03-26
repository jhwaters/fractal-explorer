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
    flexFlow: 'row wrap',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: '1em',
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
          <RecenterButton />
        </CenteringBox>
        <CenteringBox style={help}>
          <Typography >
            Move the center of the image by double-clicking.
            The buttons at the bottom of the screen will adjust the parameters of the current fractal, and the formula at the top will update to reflect any changes.
            Clicking on the formula will display more detailed information about how the fractal was generated. 
            The menu at the top left can be used to change many settings and to select different types of fractals.
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