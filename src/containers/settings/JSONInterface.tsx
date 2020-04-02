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
import { stateToJson, jsonToState, jsonToUrl, AppState } from '../../fractals/json';


const JSONTextField = withStyles({
  root: {
    maxWidth: '240px',
    '& textarea, input': {
      fontFamily: 'roboto mono, monospace',
      '&[readonly]': {fontSize: '0.7em'},
    },
  },
})(TextField)


interface Props {
  currentJson: string,
  currentURL: string,
  uploadData: (data: AppState) => void,
}

class JSONInterface extends React.Component<Props> {
  state: {
    jsonInput: string
    parsedJson: AppState | undefined
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      jsonInput: '',
      parsedJson: undefined,
    }
  }

  onCopyJson = () => {
    navigator.clipboard.writeText(this.props.currentJson);
  }

  onCopyLink = () => {
    navigator.clipboard.writeText(this.props.currentURL);
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

  onUploadJson = () => {
    if (this.state.parsedJson) {
      this.props.uploadData(this.state.parsedJson);
    }
  }

  selectText = (evt: any) => {
    evt.target.select();
  }

  render() {
    return (
      <Box m={2}>
        <Box>
          <JSONTextField
            label="Link to Current Fractal"
            value={this.props.currentURL}
            InputProps={{
              onClick: this.selectText,
              readOnly: true,
              /*
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={this.onCopyLink} title="copy to clipboard">
                    <Icon.Copy/>
                  </IconButton>
                </InputAdornment>
              )
              */
            }}
          />
        </Box>
        <Box>
          <JSONTextField
            label="Current JSON"
            value={this.props.currentJson}
            InputProps={{
              onClick: this.selectText,
              readOnly: true,
              /*
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={this.onCopyJson} title="copy to clipboard">
                    <Icon.Copy/>
                  </IconButton>
                </InputAdornment>
              )
              */
            }}
          />
        </Box>
        <Box>
          <JSONTextField 
            label="Load JSON"
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

      </Box>
    )
  }
}



export default connect(
  (state: State) => {
    const data = stateToJson(state.fractal);
    return ({
      currentJson: JSON.stringify(data),
      currentURL: window.location.href.split('?')[0] + '?' + jsonToUrl(data),
    });
  },
  (dispatch: Dispatch) => ({
    uploadData: (data: AppState) => {
      dispatch(uploadData(data));
      dispatch(redraw());
    },
  })
)(JSONInterface)