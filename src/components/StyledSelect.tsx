import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import TypographyWithMath from './TypographyWithMath';
import { withStyles, Theme } from '@material-ui/core/styles';


export const Select = withStyles((theme: Theme) => ({
  root: {
    width: '200px',
  },
}))(TextField)

export const Option = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
  }
}))(MenuItem)


export const OptionLabel = withStyles((theme: Theme) => ({
  root: {
    fontSize: '0.8em',
  }
}))(TypographyWithMath)
