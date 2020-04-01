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
import { stateToJSON, jsonToState, UploadState, toBase64, fromBase64 } from '../../fractals/json';


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
  currentJson: string,
  currentBase64: string,
  uploadData: (json: UploadState) => void,
}

class JSONInterface extends React.Component<Props> {
  state: {
    jsonInput: string
    base64Input: string
    parsedJson: UploadState | undefined
    parsedBase64: UploadState | undefined
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      jsonInput: '',
      base64Input: '',
      parsedJson: undefined,
      parsedBase64: undefined,
    }
  }

  onCopyJson = () => {
    navigator.clipboard.writeText(this.props.currentJson);
  }

  onCopyBase64 = () => {
    navigator.clipboard.writeText(this.props.currentBase64);
  }

  onChangeJson = (evt: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const parsedJson = jsonToState(JSON.parse(evt.target.value));
      this.setState({
        jsonInput: evt.target.value,
        parsedJson,
      })
    } catch {
      this.setState({jsonInput: evt.target.value, parsedJson: undefined});
    }
  }

  onChangeBase64 = (evt: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const parsedBase64 = jsonToState(JSON.parse(fromBase64(evt.target.value)));
      this.setState({
        base64Input: evt.target.value,
        parsedBase64,
      })
    } catch {
      this.setState({base64Input: evt.target.value, parsedBase64: undefined});
    }
  }

  onUploadJson = () => {
    if (this.state.parsedJson) {
      this.props.uploadData(this.state.parsedJson);
    }
  }

  onUploadBase64 = () => {
    if (this.state.parsedBase64) {
      this.props.uploadData(this.state.parsedBase64);
    }
  }

  render() {
    return (
      <Box m={2}>
        <Box>
          <JSONTextField
            label="Current JSON"
            disabled
            value={this.props.currentJson}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={this.onCopyJson} title="copy to clipboard">
                    <Icon.Copy/>
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
        <Box>
          <JSONTextField 
            label="Current Base64"
            disabled
            value={this.props.currentBase64}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={this.onCopyBase64} title="copy to clipboard">
                    <Icon.Copy/>
                  </IconButton>
                </InputAdornment>
              )
            }}/>
        </Box>
        <Box>
          <JSONTextField 
            label="Upload JSON"
            onChange={this.onChangeJson}
            value={this.state.jsonInput}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={this.onUploadJson} disabled={!this.state.parsedJson} title="load data into viewer">
                    <Icon.Upload/>
                  </IconButton>
                </InputAdornment>
              )
            }}
            />
        </Box>
        <Box>
          <JSONTextField 
            label="Upload Base64"
            onChange={this.onChangeBase64}
            value={this.state.base64Input}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={this.onUploadBase64} disabled={!this.state.parsedBase64} title="load data into viewer">
                    <Icon.Upload/>
                  </IconButton>
                </InputAdornment>
              )
            }}
            />
        </Box>

      </Box>
    )
  }
}



export default connect(
  (state: State) => {
    const jsonstr = JSON.stringify(stateToJSON(state));
    return ({
      currentJson: jsonstr,
      currentBase64: toBase64(jsonstr),
    });
  },
  (dispatch: Dispatch) => ({
    uploadData: (data: UploadState) => {
      dispatch(uploadData(data));
      dispatch(redraw());
    },
  })
)(JSONInterface)