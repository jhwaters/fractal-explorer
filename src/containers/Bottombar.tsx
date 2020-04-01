import React from 'react';
import { connect } from 'react-redux';
import { State, Dispatch } from '../store/types';
import { Nav } from '../store/ui/types';
import { setNav } from '../store/ui/actions';
import BottomNavigation, { BottomNavigationProps } from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Badge from '@material-ui/core/Badge';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Icon } from '../components';


const styles = createStyles(({palette}: Theme) => ({
  root: {
    position: 'absolute',
    //top: 'auto',
    bottom: 0,
    width: '100%',
    borderTop: '1px solid ' + palette.divider,
  },
}))

const StyledBottomNav = withStyles(styles)(BottomNavigation)

const BottomNav = (p: BottomNavigationProps & {galleryBadge: number}) => {
  const {galleryBadge, ...props} = p;
  return (
    <StyledBottomNav {...props}>
      
      <BottomNavigationAction
        value={Nav.Params}
        label="Parameters"
        icon={<Icon.Tune/>}
      />
      <BottomNavigationAction
        value={Nav.Explore}
        label="Explore"
        icon={<Icon.Explore/>}
      />
      <BottomNavigationAction
        value={Nav.Capture}
        label="Capture"
        icon={<Icon.Capture/>}
      />
      <BottomNavigationAction
        value={Nav.Gallery}
        label="Saved"
        icon={
          <Badge badgeContent={galleryBadge} color="primary">
            <Icon.Gallery/>
          </Badge>
        }
      />
    </StyledBottomNav>
  )
};

export default connect(
  (state: State) => ({
    value: state.ui.nav,
    galleryBadge: state.ui.galleryBadge,
  }),
  (dispatch: Dispatch) => ({
    onChange: (evt: any, x: Nav) => dispatch(setNav(x)),
  })
)(BottomNav)