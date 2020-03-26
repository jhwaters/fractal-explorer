import React from 'react';
import { connect } from 'react-redux';
import Katex from '../components/Katex';
import { State as AppState, Dispatch } from '../store/types';
import { setModal } from '../store/ui/actions';
import { Modal } from '../store/ui/types';
import { State as AlgState } from '../store/algorithm/types';
import { TypographyWithMath } from '../components';
import Box from '@material-ui/core/Box';
import Button, { ButtonProps } from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { fractal } from '../fractals';


const KatexButton = withStyles({
  label: {textTransform: 'none'},
})(Button)

const InfoButton_ = ({formula, ...rest}: {
  formula: string | {math: string} | (string | {math: string})[]
} & ButtonProps) => (
  <KatexButton {...rest}>
    <TextWithMath data={formula}/>
  </KatexButton>
)

export const InfoButton = connect(
  (state: AppState) => {
    const {formula} = fractal(state.algorithm);
    return {
      disabled: state.ui.modal === Modal.Info,
      formula,
    }
  },
  (dispatch: Dispatch) => ({
    onClick: () => dispatch(setModal(Modal.Info))
  })
)(InfoButton_)


//////////////////////////////////////////////////
////////////////////////////////////////////////


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

type Props = {
  visible: boolean,
  anchorEl?: HTMLElement,
  onClose: () => void,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  algorithm: AlgState,
}


const FractalInfo = (props: Props) => {

  const {algorithm} = props;
  const fractalinfo = fractal(algorithm).description;

  const round = rounder(3-Math.floor(Math.log10(props.rx)))

  const cx = round(props.cx)
  const cy = round(props.cy)

  const rx = science(Math.abs(props.rx))
  const ry = science(Math.abs(props.ry))

  const centerx = 'x_c = ' + cx
  const centery = 'y_c = ' + cy
  const domainx = '|x - x_c| \\leq ' + rx 
  const domainy = '|y - y_c| \\leq ' + ry 

  /*
  const center = (
    '\\begin{aligned}'
    + centerx
    + '\\\\' 
    + centery
    + '\\end{aligned}'
  );

  const domain = (
    //'\\begin{aligned}' 
    + domainx
    //+ '\\\\' 
    + domainy
    //+ '\\end{aligned}'
  );
  */

  return (
    <Popover
      PaperProps={{square: true}}
      open={props.visible}
      onClose={props.onClose}
      anchorEl={props.anchorEl}
    >
      <Box p={1.5} onClick={props.onClose}>
        <TextWithMath data={fractalinfo}/>
        <Typography style={{marginTop: '1em'}}>
          The currently displayed portion of this fractal is centered
          at <Katex math="(x_c, y_c)"/>, where
        </Typography>
        <Katex math={centerx + '\\text{ and }' + centery} displayMode={true}/>
        <Typography>
          and plotted over <Katex math="(x, y)"/> such that 
        </Typography>
        <Katex math={domainx + '\\text{ and }' + domainy} displayMode={true}/>
      </Box>
    </Popover>
  )
}

export default connect(
  (state: AppState) => {
    const {cx, cy, ppu, w, h} = state.view;
    const rx = w/ppu/2, ry = h/ppu/2;
    return {
      visible: state.ui.modal === Modal.Info,
      cx: cx,
      cy: cy,
      rx: rx,
      ry: ry,
      algorithm: state.algorithm,
    }
  },
  (dispatch: Dispatch) => ({
    onClose: () => dispatch(setModal(Modal.None))
  })
)(FractalInfo)