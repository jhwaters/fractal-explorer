import React from 'react';
import {
  ThemeProvider as Provider, 
  createMuiTheme, 
} from '@material-ui/core/styles';
import { } from '@material-ui/core/styles/'
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  amber, teal, pink, lime, blueGrey, grey,
} from '@material-ui/core/colors';


const LIGHT = {
  type: 'light',
  primary: teal,
  secondary: pink,
};

const DARK = {
  type: 'dark',
  primary: teal,
  secondary: amber,
};

type Props = {}

class Theme extends React.Component<Props> {
  state: {
    theme: any
  }

  constructor(props: React.PropsWithChildren<Props>) {
    super(props);
    this.state = {
      theme: {
        palette: {
          type: 'light',
          primary: teal,
          secondary: pink,
        },
        props: {
          MuiTextField: {
            variant: 'outlined',
            size: 'small',
            fullWidth: true,
            margin: 'dense',
          },
          MuiButtonGroup: {
            variant: 'text',
          }
        },
        style: {
          MuiBox: {
            margin: '1em',
          },
        }
      }
    }
  }

  setDark(dark: boolean) {
    this.setState({
      theme: {
        ...this.state.theme,
        palette: {
          ...this.state.theme.palette,
          ...(dark ? DARK : LIGHT),
        }
      }
    })
  }

  componentDidMount() {
    this.setDark(window.matchMedia("(prefers-color-scheme:dark)").matches)
    window.matchMedia("(prefers-color-scheme:dark)").addListener(x => {
      this.setDark(x.matches)
    })
  }

  render() {
    return (
      <Provider theme={createMuiTheme(this.state.theme)}>
        <CssBaseline/>
        {this.props.children}
      </Provider>
    )
  }
}

export default Theme;