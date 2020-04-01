import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';

type Props = {
  visible: boolean
}

const Outside = withStyles((theme: Theme) => ({
  root: {
    //position: 'absolute',
    bottom: '0',
    width: '100%',
    backgroundColor: theme.palette.background.default + '99',
  }
}))(Paper);

const Inside = withStyles({
  root: {
    display: 'flex',
    flexFlow: 'row wrap',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: '0.7em',
    paddingTop: '0.3em',
  }
})(Toolbar)


function ControlPanel(props: React.PropsWithChildren<Props>) {

  return (
    <Outside elevation={0} style={props.visible ? {} : {display: 'none'}}>
      <Inside>
        {props.children}
      </Inside>
    </Outside>
  )
}

export default ControlPanel