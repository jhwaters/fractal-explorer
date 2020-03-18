import React from 'react';
import {Button, ButtonGroup } from './material';
import { withTheme } from './material';

import {
  FormControl,
  FormControlLabel,
  OutlinedInput,
  InputLabel,
  Box,
} from '@material-ui/core'


type Props = {
  [k: string]: any
  onUp?: () => void
  onDown?: () => void
  disableUp?: boolean
  disableDown?: boolean
  label?: string
  theme?: any
}

const DownUpButtons = ({onUp, onDown, label, disableUp, disableDown, theme, ...rest}: Props) => {
  return (
    <ButtonGroup>
      <Button 
        onClick={onDown} 
        disabled={disableDown}
      >
        {label}-
      </Button>
      
      <Button 
        onClick={onUp}
        disabled={disableUp}
      >
        {label}+
      </Button>
    </ButtonGroup>
  )
}

export default withTheme(DownUpButtons)