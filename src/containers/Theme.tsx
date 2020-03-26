import React from 'react';
import {
  ThemeProvider as Provider, 
  createMuiTheme, 
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {amber, pink, blue, lightGreen} from '@material-ui/core/colors';


type Props = {
  type: 'light' | 'dark' | 'detect'
  lightPalette?: any
  darkPalette?: any
  theme: any
}

class Theme extends React.Component<Props> {
  state: {type: 'light' | 'dark'}

  static defaultProps = {
    type: 'detect',

    lightPalette: {
      primary: blue,
      secondary: pink,
    },

    darkPalette: {
      primary: lightGreen,
      secondary: amber,
    },

    theme: {
      props: {
        MuiAppBar: {color: 'inherit'},
        MuiBackdrop: {
          invisible: true
        },
        MuiButton: {
          variant: 'outlined',
          color: 'primary',
        },
        MuiButtonGroup: {
          variant: 'outlined',
          color: 'inherit',
        },
        MuiIconButton: {color: 'inherit'},
        MuiTextField: {
          variant: 'outlined',
          size: 'small',
          fullWidth: true,
          margin: 'normal',
        },
        MuiTypography: {color: 'inherit'},
      },
      style: {
        MuiButton: {
          margin: '0.5em',
        },
      }
    }
  }

  constructor(props: React.PropsWithChildren<Props>) {
    super(props);
    this.state = {
      type: this.props.type === 'detect' ? 'light' : this.props.type
    }
  }

  setDark(dark: boolean) {
    this.setState({type: dark ? 'dark' : 'light'})
  }

  componentDidMount() {
    if (this.props.type === 'detect') {
      this.setDark(window.matchMedia("(prefers-color-scheme:dark)").matches)
      window.matchMedia("(prefers-color-scheme:dark)").addListener(x => {
        this.setDark(x.matches)
      })
    }
  }

  render() {
    const theme = {
      ...this.props.theme,
      palette: {
        ...this.props.theme.palette,
        ...this.state,
        ...(this.state.type === 'dark' ? this.props.darkPalette : this.props.lightPalette)
      }
    }
    return (
      <Provider theme={createMuiTheme(theme)}>
        <CssBaseline/>
        {this.props.children}
      </Provider>
    )
  }
}

export default Theme;