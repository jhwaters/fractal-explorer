import React from 'react';
import { connect } from 'react-redux'
import { State as AppState } from '../../store/types';
import { StretchMode } from '../../store/ui/types';
import { setStretch } from '../../store/actions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

type Props = {
  stretch: StretchMode,
  mode?: StretchMode,
  setStretch: (stretch: StretchMode) => void
}

const StretchToggle = ({stretch, setStretch, mode=StretchMode.Contain}: Props) => {

  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.target.checked) setStretch(mode)
    else setStretch(StretchMode.None)
  }
  return (
    <FormControlLabel
      label="Fit"
      labelPlacement="end"
      control={
        <Switch
          checked={stretch === mode}
          onChange={onChange}
        />
      }
    />
  )
}


export default connect(
  (state: AppState) => ({stretch: state.ui.canvasStretch}),
  (dispatch: any) => ({
    setStretch: (mode: StretchMode) => dispatch(setStretch(mode)),
  })
)(StretchToggle)