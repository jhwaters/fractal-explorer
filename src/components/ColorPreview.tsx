import React from 'react';
import { SchemeName } from '../store/color/types';
import { colorScale } from '../fractal';
import styles from './components.module.css';

type Props = {
  width: number,
  height: number,
  orientation: string,
  scheme: SchemeName,
  customSchemes: {[k: string]: string[]}
  reverse: boolean,
  skew: number,
  style?: any,
}

class ColorPreview extends React.Component<Props> {
  ref: React.RefObject<HTMLCanvasElement>

  static defaultProps = {
    width: 200,
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
        const { scheme, reverse, skew, customSchemes, width, height, orientation } = this.props;
        if (orientation === 'horizontal') {
          const cm = colorScale({scheme, reverse, skew, customSchemes}).createMap([0,width]);
          cm.forEach((color, i) => {
            context.fillStyle = color;
            context.fillRect(i, 0, 1, height);
          })
        } else {
          const cm = colorScale({scheme, reverse, skew, customSchemes}).createMap([height,0]);
          cm.forEach((color, i) => {
            context.fillStyle = color;
            context.fillRect(0, i, width, 1);
          })
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
        className={styles.ColorPreview}
      />
    )
  }
}

export default ColorPreview;