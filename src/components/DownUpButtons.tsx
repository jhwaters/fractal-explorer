import React from 'react';
import Box from '@material-ui/core/Box';
import ButtonGroup, { ButtonGroupProps } from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import * as Icon from './icons'


const styles = ({palette}: Theme) => createStyles({
  container: {
    position: 'relative',
    marginBottom: '5px',
  },
  label: {
    textAlign: 'center',
    position: 'absolute',
    bottom: '-5px',
    width: '100%',
    userSelect: 'none',
    color: palette.text.secondary,
  },
});


export interface DownUpButtonsProps extends WithStyles<typeof styles>, Omit<ButtonGroupProps, 'classes'> {
  [k: string]: any
  onUp?: () => void
  onDown?: () => void
  disableUp?: boolean
  disableDown?: boolean
  label?: string
  fontSize?: "small" | "default" | "large" | "inherit"
  iconDown?: typeof SvgIcon
  iconUp?: typeof SvgIcon
}


const DownUpButtons = ({label, classes, onUp, onDown, fontSize, 
  disableUp, disableDown, downIcon=Icon.Minus, upIcon=Icon.Plus,
  ...rest
}: DownUpButtonsProps) => (

  <Box className={classes.container}>
      {label ? (
        <Typography variant="caption" className={classes.label}>
          {label}
        </Typography>
      ) : null}
    <ButtonGroup {...rest}>
      <IconButton
        onClick={onDown}
        disabled={disableDown}
      >{React.createElement(downIcon, {fontSize})}</IconButton> 
      <IconButton
        onClick={onUp}
        disabled={disableUp}
      >{React.createElement(upIcon, {fontSize})}</IconButton>
    </ButtonGroup>
  </Box>
)

export default withStyles(styles)(DownUpButtons)