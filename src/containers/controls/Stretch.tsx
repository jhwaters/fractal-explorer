import React from 'react';
import { connect } from 'react-redux'
import { FormControlLabel, Switch } from '../../components/material';
import { withTheme } from '@material-ui/core/styles'
import { State as AppState } from '../../store/types';
import { update as updateView } from '../../store/view/actions';

type Props = {
  stretch: boolean,
  theme?: any,
  setStretch: (stretch: boolean) => void
}

const Stretch = ({stretch, setStretch, theme}: Props) => {
  const f = (evt: React.ChangeEvent<HTMLInputElement>) => setStretch(evt.target.checked);
  return (
    <FormControlLabel
      label="Stretch"
      style={{color: theme.palette.text.primary}}
      control={
        <Switch
          checked={stretch}
          onChange={f}
        />
      }
    />
  )
}


export default withTheme(connect(
  (state: AppState) => ({stretch: state.view.stretch}),
  (dispatch: any) => ({setStretch: (stretch: boolean) => dispatch(updateView({stretch}))})
)(Stretch))