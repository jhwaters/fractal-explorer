import React from 'react';
import { connect } from 'react-redux';
import { State, Dispatch } from '../../store/types';
import { uploadData } from '../../store/fractal/actions';
import { redraw } from '../../store/ui/actions';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Icon } from '../../components';
import { withStyles } from '@material-ui/core/styles';
import { stateToJSON, jsonToState, UploadState } from '../../fractals/json';


const JSONTextField = withStyles({
  root: {
    maxWidth: '240px',
    '& textarea, input': {
      fontFamily: 'roboto mono, monospace',
      //fontSize: '0.7em',
    },
  },
})(TextField)


interface Props {
  current: string,
  uploadData: (json: UploadState) => void,
}

class JSONInterface extends React.Component<Props> {
  state: {
    json: string,
    parsed: UploadState | undefined,
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      json: '',
      parsed: undefined,
    }
  }

  onCopy = () => {
    navigator.clipboard.writeText(this.props.current);
  }

  onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const parsed = jsonToState(JSON.parse(evt.target.value));
      this.setState({
        json: evt.target.value,
        parsed,
      })
    } catch {
      this.setState({json: evt.target.value, parsed: undefined});
    }
  }

  onUpload = () => {
    if (this.state.parsed) {
      this.props.uploadData(this.state.parsed);
    }
  }

  render() {
    return (
      <Box m={2}>
        <Box style={{display: 'flex',}}>
          <JSONTextField
            label="Current"
            disabled
            value={this.props.current}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={this.onCopy}>
                    <Icon.Copy/>
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
        <JSONTextField 
          label="Upload"
          onChange={this.onChange}
          value={this.state.json}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={this.onUpload} disabled={!this.state.parsed}>
                  <Icon.Upload/>
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>
    )
  }
}



export default connect(
  (state: State) => ({
    current: JSON.stringify(stateToJSON(state)),
  }),
  (dispatch: Dispatch) => ({
    uploadData: (data: UploadState) => {
      dispatch(uploadData(data));
      dispatch(redraw());
    },
  })
)(JSONInterface)