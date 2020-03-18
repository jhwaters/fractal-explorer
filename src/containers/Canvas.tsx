import React from 'react';
import { connect } from 'react-redux';
import CanvasDrawer from '../fractal/canvasdrawer';
import { State as AppState } from '../store/types';
import { State as AlgState } from '../store/algorithm/types';
import { State as ColorState } from '../store/color/types';
import { setCenter } from '../store/view/actions';
import { setDrawing } from '../store/draw/actions';
import { makeAlgorithm } from '../fractal';
import { colorScale } from '../fractal';
import styles from './App.module.css';


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

function linearScale(domain: [number, number], range: [number,number]) {
  const m = (range[1] - range[0]) / (domain[1] - domain[0])
  const b = range[0] - m*domain[0]
  return (n: number) => m*n + b;
}

function coordScale(size: number, center: number, ppu: number, rev: boolean=false) {
  const radius = size / 2 / ppu;
  if (rev) {
    return linearScale([size-1, 0], [center-radius, center+radius])
  }
  return linearScale([0, size-1], [center-radius, center+radius])
}

type Props = {
  view: {
    w: number
    h: number
    ppu: number
    cx: number
    cy: number
  }
  color: ColorState
  algorithm: AlgState
  stretch: boolean
  shouldDraw: boolean
  shouldColor: boolean
  setCenter: (x: number, y: number) => void
  finishDrawing: () => void
}

class Canvas extends React.Component<Props> {
  drawer: CanvasDrawer
  canvasRef: React.RefObject<HTMLCanvasElement>

  constructor(props: Props) {
    super(props);
    this.drawer = new CanvasDrawer();
    this.canvasRef = React.createRef();
  }

  get canvas() {
    return this.canvasRef.current
  }

  resize() {
    this.drawer.resize({w: this.props.view.w, h: this.props.view.h});
  }

  colorScale() {
    return colorScale(this.props.color);
  }

  draw() {
    this.resize()
    const {algorithm} = this.props;
    const X = makeAlgorithm(algorithm)
    if (X) {
      const {f, range} = X;
      const cmap = this.colorScale().createMap(range);
      this.drawer.clear();
      const {cx, cy, w, h, ppu} = this.props.view;
      const xscale = coordScale(w, cx, ppu);
      const yscale = coordScale(h, cy, ppu, true);
      for (let r = 0; r < h; r++) {
        const y = yscale(r);
        for (let c = 0; c < w; c++) {
          const x = xscale(c);
          const v = f(x, y);
          this.drawer.setValue(c, r, v)
        }
      }
      this.drawer.applyColors((n: number) => cmap[n]);
      this.props.finishDrawing();
    }
  }

  recolor() {
    const {algorithm} = this.props;
    const X = makeAlgorithm(algorithm)
    if (X) {
      const cmap = this.colorScale().createMap(X.range);
      this.drawer.applyColors((n: number) => cmap[n]);
    }
  }

  changeIterations() {
    const {algorithm} = this.props;
    const {iterations} = algorithm;
    const X = makeAlgorithm(algorithm)
    if (X) {
      const {f, range} = X;
      const cmap = this.colorScale().createMap(range);
      for (const val in this.drawer.values) {
        if (val > iterations) {
          this.drawer.values[iterations].push(...this.drawer.values[val]);
          this.drawer.values[val] = []
        }
      }
      const {cx, cy, w, h, ppu} = this.props.view;
      const xscale = coordScale(w, cx, ppu);
      const yscale = coordScale(h, cy, ppu, true);
      /* TODO
      for (const [r, c] of this.drawer.values[previousIterMax]) {
        const y = yscale(r);
        const x = xscale(c);
        const v = f(x, y);
        this.drawer.setValue(c, r, v)
      }
      */
      this.drawer.applyColors((n: number) => cmap[n]);
      this.props.finishDrawing();
    }
  }

  componentDidMount() {
    if (this.canvas) {
      this.drawer.attach(this.canvas)
      this.resize()
      this.draw()
    }
  }

  componentDidUpdate() {
    if (this.props.shouldDraw) {
      this.resize();
      this.draw();
    }
    else if (this.props.shouldColor) {
      this.recolor();
    }
  }

  centerOnClick = (evt: any) => {
    if (this.props.setCenter) {
      if (this.canvas) {
        const {h, w, ppu, cx, cy} = this.props.view;
        const rect = this.canvas.getBoundingClientRect();
        const pixel_x = (evt.nativeEvent.offsetX / rect.width) * w;
        const pixel_y = (evt.nativeEvent.offsetY / rect.height) * h;
        const dx = (pixel_x - (w / 2)) / ppu;
        const dy = (pixel_y - (h / 2)) / ppu;
        this.props.setCenter(cx + dx, cy - dy);
      }
    }
  }

  render() {
    const classNames = [styles.Canvas]
    if (this.props.stretch) {
      classNames.push(styles.Stretch)
    }
    return (
      <canvas
        className={classNames.join(' ')}
        ref={this.canvasRef}
        onDoubleClick={this.centerOnClick}
      />
    )
  }
}


export default connect(
  (state: AppState) => {
    const {w, h, ppu, cx, cy, previewPixels, stretch} = state.view;
    let result = {
      algorithm: {...state.algorithm},
      color: state.color,
      shouldDraw: state.draw.drawing,
      shouldColor: !state.draw.drawing && state.draw.recolor,
      stretch: stretch,
      view: {w, h, ppu, cx, cy},
    }
    if (!state.draw.fullResolution) {
      Object.assign(result.view, scaleDown({w, h, ppu, previewPixels}))
    }
    return result;
  },
  (dispatch) => ({
    setCenter: (x: number, y: number) => {
      dispatch(setCenter(x, y));
      dispatch(setDrawing(true));
    },
    finishDrawing: () => dispatch(setDrawing(false)),
  })
)(Canvas)