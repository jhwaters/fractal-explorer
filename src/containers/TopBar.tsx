import React from 'react';
import { connect } from 'react-redux';
import { State, Dispatch } from '../store/types';
import { setModal } from '../store/ui/actions';
import { Modal } from '../store/ui/types';
import StretchToggle from './Controls/StretchToggle';
import _Box from '@material-ui/core/Box';
import _AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import { Icon } from '../components'
import InfoButton from './Controls/InfoButton';


const Box = withStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2em',
    paddingLeft: '1em',
    paddingRight: '1em',
  }
})(_Box)

const AppBar = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default + 'AA'
  },
}))(_AppBar)

const TopBar = (props: {
  disableMenu: boolean,
  openMenu: () => void,
}) => (
  <AppBar color="transparent">
    <Box>
      <IconButton onClick={props.openMenu} color="inherit">
        <Icon.Menu/>
      </IconButton>
      <InfoButton variant="text" fullWidth/>
      <StretchToggle />
    </Box>
  </AppBar>
);

export default connect(
  (state: State) => ({
    disableMenu: state.ui.modal === Modal.Menu,
  }),
  (dispatch: Dispatch) => ({
    openMenu: () => dispatch(setModal(Modal.Menu)),
  }),
)(TopBar);