import React from 'react';
import { connect } from 'react-redux';
import { State } from '../store/types';
import { Nav } from '../store/ui/types';
import BottomBar from './Bottombar';
import Settings from './Settings';
import { Controls } from './Controls';
import Display from './Display';
import TopBar from './TopBar';
import Info from './Info';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import styles from './App.module.css';


type Props = {
  nav: Nav,
}

const WithBottomNav = withStyles({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column-reverse',
  }
})(Box)

const AboveBox = withStyles({
  root: {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column-reverse',
    flexGrow: 1,
  }
})(Box)

class App extends React.Component<Props> {

  render() {

    return (
      <div className={styles.App}>
        <TopBar />
        <Info />
        <Settings />
        <WithBottomNav>
          <BottomBar />
            <Controls/>
          <AboveBox>
            <Display/>
          </AboveBox>
        </WithBottomNav>
      </div>
    )
  }
}

export default connect(
  (state: State) => ({nav: state.ui.nav})
)(App);