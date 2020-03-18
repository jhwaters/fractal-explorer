import React from 'react'
import Box_ from '@material-ui/core/Box';

export const Box = ({m=1, ...rest}: {[k: string]: any}) => React.createElement(Box_, {m, ...rest});

export { default as withTheme } from '@material-ui/core/styles/withTheme';
export { default as Button } from '@material-ui/core/Button';
export { default as ButtonGroup } from '@material-ui/core/ButtonGroup';
export { default as FormControl } from '@material-ui/core/FormControl';
export { default as Input } from '@material-ui/core/Input';
export { default as InputLabel } from '@material-ui/core/InputLabel';
export { default as TextField } from '@material-ui/core/TextField';

export { default as Slider } from '@material-ui/core/Slider';
export { default as Switch } from '@material-ui/core/Switch';
export { default as Typography } from '@material-ui/core/Typography';

export {
  AppBar,
  BottomNavigation,
  Card,
  Container,
  Drawer,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Popover,
  Select,
} from '@material-ui/core'
