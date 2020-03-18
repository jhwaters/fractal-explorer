import React from 'react';
import {
  Box,
  Drawer,
  Button,
  Popover,
} from '../../components';
import AlgorithmSettings from './AlgorithmSettings';
import ColorSettings from './ColorSettings';
import ViewSettings from './ViewSettings';
import Info from '../Info';
import styles from '../App.module.css';

type WhichMenu = 'menu' | 'algorithm' | 'color' | 'view' | 'info' | null

class SettingsDrawer extends React.Component {
  state: {
    visible: WhichMenu
    compact: boolean
  }

  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = {
      visible: null,
      compact: false,
    }
  }

  setVisible(visible: WhichMenu) {
    this.setState({visible})
  }

  openMenu = () => this.setVisible('menu');
  openAlgorithm = () => this.setVisible('algorithm');
  openColor = () => this.setVisible('color');
  openView = () => this.setVisible('view');
  openInfo = () => this.setVisible('info');
  closeAll = () => this.setVisible(null);


  render() {
    return (
      <>
        <Button className={styles.OpenMenuButton} onClick={this.openMenu}>Settings</Button>
        <Button className={styles.SettingsButton} onClick={this.openAlgorithm}>Algorithm</Button>
        <Button className={styles.SettingsButton} onClick={this.openColor}>Colors</Button>
        <Button className={styles.SettingsButton} onClick={this.openView}>View</Button>
        <Button onClick={this.openInfo}>Info</Button>

        <Drawer className={styles.SettingsDrawer}
          open={this.state.visible === 'menu'} 
          onClose={this.closeAll}
        >
          <Button onClick={this.openAlgorithm}>Algorithm</Button>
          <Button onClick={this.openColor}>Colors</Button>
          <Button onClick={this.openView}>View</Button>
        </Drawer>
        <Drawer className={styles.SettingsDrawer}
          open={this.state.visible === 'algorithm'}
          onClose={this.closeAll}
        >
          <Box>
            <AlgorithmSettings onClose={this.closeAll}/>
          </Box>
        </Drawer>
        <Drawer className={styles.SettingsDrawer}
          open={this.state.visible === 'color'}
          onClose={this.closeAll}
        >
          <Box>
            <ColorSettings onClose={this.closeAll}/>
          </Box>
        </Drawer>
        <Drawer className={styles.SettingsDrawer}
          open={this.state.visible === 'view'}
          onClose={this.closeAll}
        >
          <Box>
            <ViewSettings onClose={this.closeAll}/>
          </Box>
        </Drawer>
        <Popover
          open={this.state.visible === 'info'}
          onClose={this.closeAll}
        >
          <Box p={1} onClick={this.closeAll}>
            <Info />
          </Box>
        </Popover>
      </>
    )
  }
}

export default SettingsDrawer