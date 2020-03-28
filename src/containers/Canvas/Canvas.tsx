import React from 'react';
import { connect } from 'react-redux';
import { State as AppState, Dispatch } from '../../store/types';
import { State as AlgState } from '../../store/algorithm/types';
import { State as ColorState } from '../../store/color/types';
import { setCenter } from '../../store/view/actions';
import { setCanvasAction } from '../../store/ui/actions';
import { StretchMode, CanvasAction } from '../../store/ui/types';
import { CanvasDrawer, fractal } from '../../fractals';
import Box from '@material-ui/core/Box';
import styles from './Canvas.module.css';


type Props = {
  view: {
    w: number
    h: number
    ppu: number
    cx: number
    cy: number
    previewPixels: number
  }
  color: ColorState
  algorithm: AlgState
  canvasAction: CanvasAction
  stretch: StretchMode
  setCenter: (x: number, y: number) => void
  finishDrawing: () => void
}

class Canvas extends React.Component<Props> {
  drawer: CanvasDrawer
  canvasRef: React.RefObject<HTMLCanvasElement>

  isFullResolution: boolean

  constructor(props: Props) {
    super(props);
    this.drawer = new CanvasDrawer({w: this.props.view.w, h: this.props.view.h});
    this.canvasRef = React.createRef();
    this.isFullResolution = false;
  }

  get canvas() {
    return this.canvasRef.current
  }

  resize() {
    this.drawer.resize(this.view());
  }

  view() {
    if (this.isFullResolution) {
      return this.props.view;
    } else {
      return {...this.props.view, ...scaleDown(this.props.view)}
    }
  }

  calculateImage() {
    const {algorithm} = this.props;
    const view = this.view();
    console.log('calculating:', algorithm.current, algorithm.params);
    const f = fractal(algorithm).pixel;
    const rx = view.w / view.ppu / 2;
    const ry = view.h / view.ppu / 2;
    this.drawer.calculatePixels(
      f, 
      [view.cx - rx, view.cx + rx],
      [view.cy - ry, view.cy + ry],
    );
  }

  changeIterations() {
    const {iterations} = this.props.algorithm.params;
    const {algorithm} = this.props;
    const view = this.view();
    const f = fractal(algorithm).pixel;
    const rx = view.w / view.ppu / 2;
    const ry = view.h / view.ppu / 2;
    if (iterations) {
      this.drawer.changeIterations(
        f, 
        [view.cx - rx, view.cx + rx],
        [view.cy - ry, view.cy + ry],
        iterations,
      );
    }
  }

  colorCanvas() {
    if (this.props.color.adaptiveScale) {
      this.drawer.colorPixels(this.props.color);
    } else {
      const {iterations} = this.props.algorithm.params;
      this.drawer.colorPixels(this.props.color, [0, iterations]);
    }
  }

  draw() {
    this.resize()
    this.calculateImage()
    this.colorCanvas()
    this.props.finishDrawing()
  }

  reiterate() {
    this.changeIterations()
    this.colorCanvas()
    this.props.finishDrawing()
  }

  recolor() {
    this.colorCanvas()
    this.props.finishDrawing()
  }

  componentDidMount() {
    if (this.canvas) {
      this.drawer.attach(this.canvas)
      this.isFullResolution = false;
      this.draw()
    }
  }

  componentDidUpdate() {
    if (this.props.canvasAction === CanvasAction.Draw) {
      this.isFullResolution = false;
      this.draw()
    }
    else if (this.props.canvasAction === CanvasAction.DrawFullResolution) {
      this.isFullResolution = true;
      this.draw()
    }
    else if (this.props.canvasAction === CanvasAction.Iterate) {
      this.changeIterations()
    }
    else if (this.props.canvasAction === CanvasAction.Color) {
      this.recolor();
    }
  }

  centerOnClick = (evt: any) => {
    if (this.props.setCenter) {
      if (this.canvas) {
        const {h, w, ppu, cx, cy} = this.props.view;
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

    if (this.isFullResolution) {
      outerClasses.push(styles.FullResolution)
    }
    return (
      <Box m={0} className={outerClasses.join(' ')}>
        <div className={styles.Inner}>
          <canvas
            className={styles.Canvas}
            ref={this.canvasRef}
            onDoubleClick={this.centerOnClick}
            style={{objectFit}}
          />
        </div>
      </Box>
    )
  }
}


export default connect(
  (state: AppState) => ({
    algorithm: {...state.algorithm},
    color: state.color,
    canvasAction: state.ui.canvasAction,
    view: {...state.view},
    stretch: state.ui.canvasStretch,
  }),
  (dispatch: Dispatch) => ({
    setCenter: (x: number, y: number) => {
      dispatch(setCenter(x, y));
      dispatch(setCanvasAction(CanvasAction.Draw));
    },
    finishDrawing: () => dispatch(setCanvasAction(CanvasAction.None)),
  })
)(Canvas)





function scaleDown({w, h, ppu, previewPixels}: {
  w: number,
  h: number,
  ppu: number,
  previewPixels: number,
}) {
  const pixelcount = w * h;
  const factor = Math.min(1, Math.sqrt(previewPixels / pixelcount))
  const result = {
    w: Math.round(w * factor),
    h: Math.round(h * factor),
    ppu: Math.round(ppu * factor),
  }
  return result
}