import React from 'react';
import BottomBar from './Bottombar';
import Settings from './settings';
import Display from './Display';
import TopBar from './TopBar';
import Info from './Info';
import Waiting from './Waiting';
import { makeStyles, Theme } from '@material-ui/core/styles';


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    flexDirection: 'column',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    overflow: 'hidden',
    justifyContent: 'space-between',
  }
}))


export default function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Waiting/>
      <Display/>
      <TopBar />
      <Settings />
      <Info />
      <BottomBar />
    </div>
  )
}