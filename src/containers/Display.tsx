import React from 'react'
import Canvas from './canvas';
import Capture from './capture';
import Controls from './controls';
import Box from '@material-ui/core/Box';
import Gallery from './gallery';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
  root: {
    position: 'absolute',
    overflow: 'clip',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    top: '50px',
    bottom: '55px',
    width: '100%',
    //paddingTop: '50px'
  }
});

export default function Display() {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Canvas/>
      <Capture/>
      <Gallery/>
      <Controls/>
    </Box>
  )
};