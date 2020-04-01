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
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
  toolbar: {
    justifyContent: 'flex-start',
  },
  gallery: {
    flexGrow: 1,
    textAlign: 'center',
  },
  formula: {},
  recenter: {},
  Params: {
    '& $gallery': {display: 'none'},
  },
  Explore: {
    '& $gallery': {display: 'none'},
  },
  Capture: {
    '& $gallery': {display: 'none'},
    '& $recenter': {display: 'none'}
  },
  Gallery: {
    '& $formula': {display: 'none'},
    '& $recenter': {display: 'none'},
  },
})


function TopBar(props: {
  nav: Nav,
  disableMenu: boolean,
  openMenu: () => void,
}) {
  const classes = useStyles();
  const rootClass = 
    props.nav === Nav.Params ? 'Params' : 
    props.nav === Nav.Explore ? 'Explore' :
    props.nav === Nav.Capture ? 'Capture' :
    'Gallery';
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar className={classes.toolbar + ' ' + classes[rootClass]}>
        <IconButton onClick={props.openMenu} edge="start">
          <Icon.Menu/>
        </IconButton>
        <InfoButton className={classes.formula} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
        <Typography className={classes.gallery}>Saved Fractals</Typography>
        <RecenterButton className={classes.recenter}/>
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