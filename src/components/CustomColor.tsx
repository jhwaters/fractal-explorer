import React from 'react';
import { ColorPreview, DownUpButtons } from '.';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';


type Props = {
  takenNames: string[],
  onSave: (name: string, colors: string[]) => void;
  onClose: () => void;
}

type State = {
  name: string,
  num: number,
  colors: string[],
}

class CustomColor extends React.Component<Props> {
  state: State

  static defaultProps = {
    takenNames: [],
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      num: 2,
      colors: ['#FF0055', '#0055FF'],
    }
  }

  changeName = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const name = evt.target.value;
    this.setState({name});
  }

  setNum(n: number) {
    const num = Math.max(2, n)
    let colors = [...this.state.colors];
    if (num > colors.length) {
      const x = colors[colors.length-1];
      while (colors.length < num) {
        colors.push(x);
      }
    } else {
      colors = colors.slice(0,num);
    }
    this.setState({num, colors});
  }

  changeNum = (evt: React.ChangeEvent<HTMLInputElement>) => this.setNum(+evt.target.value)

  changeColor = (i: number) => {
    return (evt: React.ChangeEvent<HTMLInputElement>) => {
      const colors = [...this.state.colors];
      colors[i] = evt.target.value;
      this.setState({colors});
    }
  }

  addColor = () => this.setNum(this.state.num + 1);
  removeColor = () => this.setNum(this.state.num - 1);

  save = () => {
    this.props.onSave(this.state.name, this.state.colors);
    this.props.onClose();
  }

  validName = () => {
    if (this.state.name === '') {
      return false;
    }
    this.props.takenNames.forEach(k => {
      if (k.toLowerCase() === this.state.name.toLowerCase()) {
        return false;
      }
    })
    return true;
  }

  renderColorInput(i: number) {
    if (i < this.state.colors.length) {
      return (
        <Grid item xs={1}>
          <input type="color"
            value={this.state.colors[i]}
            onChange={this.changeColor(i)}
            style={{width: '40px', borderRadius: 0, padding: 0}}
          />
        </Grid>
      )
    }
    return null;
  }

  render() {
    return (
      <>

        <InputLabel>New Colorscheme</InputLabel>

        <Box>
        <TextField
              label="Name"
              variant="filled"
              value={this.state.name}
              onChange={this.changeName}
              inputProps={{type: 'text'}}
            />
        </Box>
        <Box p={1}>
          <ColorPreview
            style={{width: '100%', height: '4mm'}}
            scheme={this.state.colors}
            reverse={false}
            skew={0}
            width={100}
            height={10}
          />
        </Box>
        <Box>
          <Grid container>
            {this.state.colors.map((color: string, i: number) => (
              <Box m={0.5}>{this.renderColorInput(i)}</Box>
            ))}
          </Grid>
          <Box m={1}>
            <DownUpButtons
              variant="contained"
              style={{alignSelf: 'center'}}
              onDown={this.removeColor}
              disableDown={this.state.colors.length < 3}
              onUp={this.addColor}
            />
          </Box>
          <Box>
          <Button 
              fullWidth color="primary"
              disabled={!this.validName()}
              onClick={this.save}
            >Save</Button>
          </Box>
        </Box>
      </>
    )
  }
}

export default CustomColor