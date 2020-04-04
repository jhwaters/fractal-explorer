import React from 'react';
import { connect } from 'react-redux';
import Katex from '../components/Katex';
import { State as AppState, Dispatch } from '../store/types';
import { setModal } from '../store/ui/actions';
import { Modal } from '../store/ui/types';
import { AlgorithmState } from '../store/fractal/algorithm/types';
import { TypographyWithMath } from '../components';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { fractal } from '../fractals';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles';


const styles = createStyles((theme: Theme) => ({
  text: {
    fontSize: '1em',
  }
}))


function rounder(p: number) {
  const d = Math.pow(10, p);
  return (n: number) => Math.round(n * d) / d;
}

function science(n: number, p: number=4) {
  const a = n.toPrecision(4);
  const b = a.split('e')
  if (b.length === 1) {
    return a;
  } else {
    return b[0] + '\\times 10^{' + b[1] + '}'
  }
}

interface Props {
  visible: boolean
  anchorEl?: HTMLElement
  onClose: () => void
  cx: number
  cy: number
  rx: number
  ry: number
  algorithm: AlgorithmState<object>
}

interface PP extends Props, WithStyles<typeof styles> {}


const FractalInfo = (props: PP) => {

  const {algorithm} = props;
  const fractalinfo = fractal(algorithm).describe;

  const round = rounder(3-Math.floor(Math.log10(props.rx)))

  const cx = round(props.cx)
  const cy = round(props.cy)

  const rx = science(Math.abs(props.rx))
  const ry = science(Math.abs(props.ry))

  const centerx = 'x_c = ' + cx
  const centery = 'y_c = ' + cy
  const domainx = '|x - x_c| \\leq ' + rx 
  const domainy = '|y - y_c| \\leq ' + ry 

  const classes = props.classes as {text: string};

  return (
    <Popover
      open={props.visible}
      onClose={props.onClose}
      marginThreshold={10}
    >
      <Paper >
        <Box p={2} onClick={props.onClose}>
          <TypographyWithMath data={fractalinfo} className={classes.text}/>
          <Typography style={{marginTop: '1em'}} className={classes.text}>
            The currently displayed portion of this fractal is centered
            at <Katex math="(x_c, y_c)"/>, where
          </Typography>
          <Katex math={centerx + '\\text{ and }' + centery} displayMode={true} className={classes.text}/>
          <Typography className={classes.text}>
            and plotted over <Katex math="(x, y)"/> such that 
          </Typography>
          <Katex math={domainx + '\\text{ and }' + domainy} displayMode={true} className={classes.text}/>
        </Box>
      </Paper>
    </Popover>
  )
}

export default connect(
  (state: AppState) => {
    const {cx, cy, ppu, w, h} = state.fractal.view;
    const rx = w/ppu/2, ry = h/ppu/2;
    return {
      visible: state.ui.modal === Modal.Info,
      cx: cx,
      cy: cy,
      rx: rx,
      ry: ry,
      algorithm: state.fractal.algorithm,
    }
  },
  (dispatch: Dispatch) => ({
    onClose: () => dispatch(setModal(Modal.None))
  })
)(withStyles(styles)(FractalInfo))