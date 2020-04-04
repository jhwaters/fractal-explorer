import React from 'react';
import { connect } from 'react-redux';
import { State, Dispatch } from '../../store/types';
import { Modal } from '../../store/ui/types';
import { setModal } from '../../store/actions'
import AlgorithmSettings from './AlgorithmSettings';
import ColorSettings from './ColorSettings';
import ViewSettings from './ViewSettings';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import JSONInterface from './JSONInterface';
import { withStyles } from '@material-ui/core/styles';
import { Icon } from '../../components';
import { version } from '../../../package.json';

type Props = {
  open: boolean
  setModal: (modal: Modal) => void
}

const StyledMenuItem = withStyles({
  root: {
    padding: '1em',
  }
})(MenuItem)

const StyledLabel = withStyles({
  root: {
    padding: 0,
    margin: 0,
  }
})(ListItemText)


const StyledSwipeableDrawer = withStyles({
  paper: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    maxWidth: '90vw',
  }
})(SwipeableDrawer)

enum Menu {
  None,
  Algorithm,
  Color,
  View,
  JSON,
}

class SettingsDrawer extends React.Component<Props> {
  state: {
    menu: Menu,
    popup: boolean,
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      menu: Menu.None,
      popup: false,
    }
  }



  openMenu = () => this.props.setModal(Modal.Menu);
  openAlgorithm = () => this.setState({menu: Menu.Algorithm});
  openColor = () => this.setState({menu: Menu.Color});
  openView = () => this.setState({menu: Menu.View});
  openJSON = () => this.setState({menu: Menu.JSON});

  closeAll = () => {
    this.setState({menu: Menu.None});
    this.closePopup();
    this.props.setModal(Modal.None);
  }

  openPopup = () => this.setState({popup: true})
  closePopup = () => this.setState({popup: false})

  render() {
    const labelStyle = this.state.menu === Menu.None ? {} : {display: 'none'};
    const listStyle = this.state.menu === Menu.None ? {} : {width: '4em'}
    return (
      <StyledSwipeableDrawer
        open={this.props.open}
        onOpen={this.openMenu}
        onClose={this.closeAll}
      >
        <List style={listStyle}>
          <StyledMenuItem onClick={this.openAlgorithm}>
            <ListItemIcon><Icon.Functions/></ListItemIcon>
            <StyledLabel style={labelStyle}>Algorithm</StyledLabel>
          </StyledMenuItem>
          <StyledMenuItem onClick={this.openColor}>
            <ListItemIcon><Icon.Palette/></ListItemIcon>
            <StyledLabel style={labelStyle}>Colors</StyledLabel>
          </StyledMenuItem>
          <StyledMenuItem onClick={this.openView}>
            <ListItemIcon><Icon.View/></ListItemIcon>
            <StyledLabel style={labelStyle}>View</StyledLabel>
          </StyledMenuItem>
          <StyledMenuItem onClick={this.openJSON}>
            <ListItemIcon><Icon.Code/></ListItemIcon>
            <StyledLabel style={labelStyle}>Serialize</StyledLabel>
          </StyledMenuItem>
          <Divider/>
          <StyledMenuItem onClick={this.closeAll} style={{paddingTop: '2em', paddingBottom: '2em'}}>
            <ListItemIcon><Icon.Back/></ListItemIcon>
            <StyledLabel style={labelStyle}>Close</StyledLabel>
          </StyledMenuItem>
          <ListItem style={{position: 'absolute', bottom: '0', left: '0', right: '0'}}>
            <Typography style={labelStyle} variant="caption">{version}</Typography>
          </ListItem>
        </List>
        <Box>
          {this.state.menu === Menu.Algorithm ? (
            <AlgorithmSettings 
              //onClose={this.closeAll}
            />
          ) : this.state.menu === Menu.Color ? (
            <ColorSettings
              //onClose={this.closeAll}
            />
          ) : this.state.menu === Menu.View ? (
            <ViewSettings
              //onClose={this.closeAll}
            />
          ) : this.state.menu === Menu.JSON ? (
            <JSONInterface/>
          ) : null}
        </Box>
        
      </StyledSwipeableDrawer>
    )
  }
}

export default connect(
  (state: State) => ({
    open: state.ui.modal === Modal.Menu,
  }),
  (dispatch: Dispatch) => ({
    setModal: (modal: Modal) => dispatch(setModal(modal))
  })
)(SettingsDrawer)