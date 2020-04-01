import React from 'react';
import { connect } from 'react-redux';
import { State, Dispatch } from '../store/types';
import { setModal } from '../store/ui/actions';
import { Modal, Nav } from '../store/ui/types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { Icon } from '../components'
import InfoButton from './Controls/InfoButton';
import RecenterButton from './Controls/Recenter';
import Typography from '@material-ui/core/Typography';


const TopBar = (props: {
  nav: Nav,
  disableMenu: boolean,
  openMenu: () => void,
}) => {
  const isGallery = props.nav === Nav.Gallery;
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar style={{justifyContent: 'space-between'}}>
        <IconButton onClick={props.openMenu} edge="start">
          <Icon.Menu/>
        </IconButton>
        <InfoButton
          style={isGallery ? {display: 'none'} : {}}
        />
        <Typography
          style={isGallery ? {} : {display: 'none'}}
        >Saved Fractals</Typography>
        <RecenterButton />
      </Toolbar>
    </AppBar>
  );
}

export default connect(
  (state: State) => ({
    nav: state.ui.nav,
    disableMenu: state.ui.modal === Modal.Menu,
  }),
  (dispatch: Dispatch) => ({
    openMenu: () => dispatch(setModal(Modal.Menu)),
  }),
)(TopBar);