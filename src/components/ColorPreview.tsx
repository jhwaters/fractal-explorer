import React from 'react';
import { ColorScheme } from '../fractals/color/types';
import { colorScale } from '../fractals/color';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
//import { CSSProperties } from '@material-ui/core'


export interface ColorPreviewProps {
  width: number
  height: number
  orientation: string
  scheme: ColorScheme
  reverse: boolean
  skew: number
  style?: React.CSSProperties
}

const styles = createStyles({
  root: {
    borderRadius: '8px',
    boxShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  }
})

interface Props extends ColorPreviewProps, WithStyles<typeof styles> {}

class ColorPreview extends React.Component<Props> {
  ref: React.RefObject<HTMLCanvasElement>

  static defaultProps = {
    width: 400,
    height: 10,
    orientation: 'horizontal',
  }

  constructor(props: Props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.docolors();
  }

  componentDidUpdate() {
    this.docolors();
  }

  docolors() {
    const canvas = this.ref.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        const { scheme, reverse, skew, width, height, orientation } = this.props;
        if (orientation === 'horizontal') {
          const cm = colorScale({scheme, reverse, skew})([0,width]);
          let i = width + 1;
          while (i--) {
            context.fillStyle = cm(i);
            context.fillRect(i, 0, 1, height);
          }
        } else {
          const cm = colorScale({scheme, reverse, skew})([height,0]);
          let i = height + 1;
          while (i--) {
            context.fillStyle = cm(i);
            context.fillRect(0, i, width, 1);
          }
        }
      }
    }
  }

  render() {
    return (
      <canvas ref={this.ref} 
        width={this.props.width} 
        height={this.props.height} 
        style={this.props.style}
        className={this.props.classes.root}
      />
    )
  }
}

export default withStyles(styles)(ColorPreview)