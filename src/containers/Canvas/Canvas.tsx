import React from 'react';
import { connect } from 'react-redux';
import { State as AppState, Dispatch } from '../../store/types';
import { State as FractalState } from '../../store/fractal/types';
import { setCenter } from '../../store/fractal/actions';
import { redraw, finish } from '../../store/ui/actions';
import { StretchMode, CanvasAction, Nav } from '../../store/ui/types';
import { CanvasDrawer } from '../../fractals';
import Box from '@material-ui/core/Box';
import styles from './Canvas.module.css';


type Props = {
  visible: boolean
  fractal: FractalState
  canvasAction: CanvasAction
  stretch: StretchMode
  setCenter: (x: number, y: number) => void
  finishDrawing: () => void
}

class Canvas extends React.Component<Props> {
  drawer: CanvasDrawer
  canvasRef: React.RefObject<HTMLCanvasElement>

  constructor(props: Props) {
    super(props);
    this.drawer = new CanvasDrawer();
    this.drawer.fullResolution = false;
    this.canvasRef = React.createRef();
  }

  get canvas() {
    return this.canvasRef.current as HTMLCanvasElement
  }

  draw() {
    this.drawer.draw(this.props.fractal);
    this.drawer.putOnCanvas(this.canvas)
    this.props.finishDrawing()
  }

  componentDidMount() {
    if (this.canvas) {
      this.draw()
    }
  }

  componentDidUpdate() {
    if (this.props.canvasAction === CanvasAction.Draw) {
      this.draw()
    }
    else if (this.props.canvasAction === CanvasAction.Color) {
      this.draw();
    }
  }

  centerOnClick = (evt: any) => {
    if (this.props.setCenter) {
      if (this.canvas) {
        const {h, w, ppu, cx, cy} = this.props.fractal.view;
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
        const dx = (pixel_x - (w / 2)) / ppu;
        const dy = (pixel_y - (h / 2)) / ppu;
        this.props.setCenter(cx + dx, cy - dy);
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
    canvasAction: state.ui.canvasAction,
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