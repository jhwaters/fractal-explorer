import React from 'react';
import SettingsDrawer from './settings/Settings';
import ControlBar from './controls/ControlBar';
import FullResolution from './controls/FullResolution';
import Stretch from './controls/Stretch';
import {
  AppBar,
  BottomNavigation,
  Paper,
} from '../components/material';
import { withTheme } from '@material-ui/core/styles';

type Props = {
  theme?: any
}

class Controls extends React.Component<Props> {

  render() {
    const barStyle: React.CSSProperties = {
      display: 'flex', 
      flexFlow: 'row wrap',
      justifyContent: 'space-evenly', 
      backgroundColor: this.props.theme.palette.background.default + 'cc'
    }
    return (
      <>
        <AppBar style={{...barStyle, top: 0}}>
          <SettingsDrawer/>
          <FullResolution />
          <Stretch />
        </AppBar>
        {this.props.children}
        <AppBar style={{
          ...barStyle, 
          float: 'left',
          position: 'absolute', 
          width: '100%',
          bottom: 0, top: 'auto'}}>
          <ControlBar />
        </AppBar>
      </>
    )
  }
}

export default withTheme(Controls);