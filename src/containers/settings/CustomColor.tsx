import React from 'react';
import ColorPreview from '../../components/ColorPreview';
import {
  Box,
  Button,
  TextField,
  DownUpButtons,
} from '../../components';

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
        <input type="color"
          value={this.state.colors[i]}
          onChange={this.changeColor(i)}
        />
      )
    }
    return null;
  }

  render() {
    return (
      <>
        <Box>
          <TextField
            label="Name"
            variant="filled"
            value={this.state.name}
            onChange={this.changeName}
            inputProps={{type: 'text'}}
          />
        </Box>
        <Box>
          <ColorPreview
            style={{width: '100%', height: '4mm'}}
            scheme="CUSTOM"
            customSchemes={{CUSTOM: this.state.colors}}
            reverse={false}
            skew={0}
            width={100}
            height={10}
          />
        </Box>
        <Button 
          fullWidth color="primary"
          disabled={!this.validName()}
          onClick={this.save}
        >Save</Button>
        <Box>
          <div style={{display: 'flex', 'flexDirection': 'column'}}>
          {this.state.colors.map((color: string, i: number) => {
            if (i < this.state.colors.length-1) {
              return <Box>{this.renderColorInput(i)}</Box>;
            } else {
              return (
              <Box>
                {this.renderColorInput(i)}
                <DownUpButtons
                  onDown={this.removeColor}
                  disableDown={this.state.colors.length < 3}
                  onUp={this.addColor}
                />
              </Box>
              )
            }
          })}
          </div>
        </Box>
      </>
    )
  }
}

export default CustomColor