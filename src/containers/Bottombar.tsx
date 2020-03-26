import React from 'react';
import { connect } from 'react-redux';
import { State, Dispatch } from '../store/types';
import { Nav } from '../store/ui/types';
import { setNav } from '../store/ui/actions';
import BottomNavigation, { BottomNavigationProps } from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Icon } from '../components';


const styles = createStyles(({palette}: Theme) => ({
  root: {
    //position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTop: '1px solid ' + palette.divider,
  },
}))

const StyledBottomNav = withStyles(styles)(BottomNavigation)

const BottomNav = (props: BottomNavigationProps) => (
  <StyledBottomNav {...props}>
    
    <BottomNavigationAction
      value={Nav.Params}
      label="Parameters"
      icon={<Icon.Tune/>}
    />
    <BottomNavigationAction
      value={Nav.Navigate}
      label="Explore"
      icon={<Icon.Navigate/>}
    />
    <BottomNavigationAction
      value={Nav.Help}
      label="Help"
      icon={<Icon.Help/>}
    />
  </StyledBottomNav>
);

export default connect(
  (state: State) => ({
    value: state.ui.nav,
  }),
  (dispatch: Dispatch) => ({
    onChange: (evt: any, x: Nav) => dispatch(setNav(x)),
  })
)(BottomNav)