import React from 'react';
import { connect } from 'react-redux';
import { State } from '../store/types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typography: {
    color: 'white',
  },
  progress: {
    outline: 'none',
  }
})

interface Props {
  open: boolean
}

function Waiting({open}: Props) {
  const classes = useStyles();
  return (
    <Modal open={open} className={classes.root}>
      <>
      <CircularProgress className={classes.progress}/>
      <Typography className={classes.typography}>Rendering Image</Typography>
      </>
    </Modal>
  )
}

export default connect(
  (state: State) => ({open: state.ui.waiting}),
)(Waiting);