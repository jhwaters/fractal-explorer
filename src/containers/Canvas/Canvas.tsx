import React from 'react';
import { connect } from 'react-redux';
import { State as AppState, Dispatch } from '../../store/types';
import { FractalState, DrawState } from '../../store/fractal/types';
import { setCenter, redraw, finish } from '../../store/actions';
import { StretchMode, Nav } from '../../store/ui/types';
import createImageData from '../../fractals/drawer/drawer';
import Box from '@material-ui/core/Box';
import styles from './Canvas.module.css';
import { invert, apply } from '../../fractals/drawer/transform';


type Props = {
  visible: boolean
  fractal: FractalState
  stretch: StretchMode
  setCenter: (x: number, y: number) => void
  finishDrawing: () => void
}

class Canvas extends React.Component<Props> {
  fullResolution: boolean
  canvasRef: React.RefObject<HTMLCanvasElement>

  constructor(props: Props) {
    super(props);
    this.fullResolution = false;
    this.canvasRef = React.createRef();
  }

  get canvas() {
    return this.canvasRef.current as HTMLCanvasElement
  }

  draw() {
    const image = createImageData(this.props.fractal);
    if (image) {
      this.canvas.width = image.width;
      this.canvas.height = image.height;
      this.canvas.getContext('2d')?.putImageData(image, 0, 0);
    }
    this.props.finishDrawing();
  }

  componentDidMount() {
    if (this.canvas) {
      this.draw()
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.fractal.drawState === DrawState.Draw) {
      this.draw()
    }
    else if (this.props.fractal.drawState === DrawState.Color) {
      // cant recolor without recalculating anymore
      this.draw();
    }
  }

  centerOnClick = (evt: any) => {
    if (this.props.setCenter) {
      if (this.canvas) {
        const {h, w, ppu, cx, cy, t} = this.props.fractal.view;
        let {width, height} = this.canvas.getBoundingClientRect();
        let {offsetX, offsetY} = evt.nativeEvent;

        if (this.props.stretch === StretchMode.Contain) {
          const ww = width / w;
          const hh = height / h;
          if (hh > ww) {
            const imageH = h * ww;
            offsetY -= (height - imageH) / 2
            height = imageH
          } else if (ww > hh) {
            const imageW = w * hh;
            offsetX -= (width - imageW) / 2
            width = imageW
          }
        }

        const pixel_x = Math.round((offsetX / width) * w);
        const pixel_y = Math.round((offsetY / height) * h);
        let dx = (pixel_x - (w / 2)) / ppu;
        let dy = (pixel_y - (h / 2)) / ppu;
        if (t) {
          const inv = invert(t);
          if (inv) {
            [dx, dy] = apply(inv, [dx, dy]);
          }
        }
        this.props.setCenter(cx + dx, cy + dy);
      }
    }
  }

  render() {
    const outerClasses = [styles.Outer]
    let objectFit: 'contain' | 'cover' | undefined
    const outerstyle = this.props.visible ? {} : {display: 'none'}
    switch (this.props.stretch) {
      case StretchMode.Contain:
        objectFit = 'contain';
        outerClasses.push(styles.Stretch);
        break;
      case StretchMode.Cover:
        objectFit = 'cover';
        outerClasses.push(styles.Stretch);
        break;
    }

    return (
      <Box m={0} className={outerClasses.join(' ')} style={outerstyle}>

          <canvas
            id="fractal-preview-canvas"
            className={styles.Canvas}
            ref={this.canvasRef}
            onDoubleClick={this.centerOnClick}
            style={{objectFit}}
          />
      </Box>
    )
  }
}


export default connect(
  (state: AppState) => ({
    visible: (state.ui.nav === Nav.Params || state.ui.nav === Nav.Explore),
    fractal: state.fractal,
    stretch: state.ui.canvasStretch,
  }),
  (dispatch: Dispatch) => ({
    setCenter: (x: number, y: number) => {
      dispatch(setCenter(x, y));
      dispatch(redraw());
    },
    finishDrawing: () => dispatch(finish()),
  })
)(Canvas)