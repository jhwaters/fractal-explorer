import React from 'react';
import { connect } from 'react-redux';
import { State, Dispatch } from '../../store/types';
import { FractalState, DrawState } from '../../store/fractal/types';
import { capture, finish, addToGallery, startWaiting } from '../../store/actions';
import { Nav } from '../../store/ui/types';
import Cropper from 'react-easy-crop';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import ControlPanel from '../controls/ControlPanel';
import IconButton from '@material-ui/core/IconButton';
import { linearScale, scaleFactor } from '../../fractals/drawer/view';
import createImageData from '../../fractals/drawer/drawer';
import { stateToJson, JsonState } from '../../fractals/json';
import { Icon, NumberInput } from '../../components';
import { captureSize } from '../../defaults';
import Fab from '@material-ui/core/Fab';

const CropContainer = withStyles({
  root: {
    position: 'relative',
    display: 'flex',
    height: '100%',
    width: '100%',
  }
})(Box);

interface Crop {x: number, y: number}
interface Area extends Crop {width: number, height: number}

interface CropperProps {
  crop: Crop
  zoom: number
}

interface Props {
  visible: boolean
  fractal: FractalState
  addToGallery: (image: string, data: JsonState, title: string) => void
  startCapture: () => void
  finishCapture: () => void
}


class Capture extends React.Component<Props> {
  state: CropperProps & {
    image: string | null,
    w: number,
    h: number,
  }
  cropPixels: Area
  shouldRedraw: boolean

  constructor(props: Props) {
    super(props);
    this.state = {
      ...captureSize,
      crop: {x: 0, y: 0},
      zoom: 1,
      image: null,
    }
    this.cropPixels = {x: 0, y: 0, width: captureSize.w, height: captureSize.h}
    this.shouldRedraw = false;
  }

  setW = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const w = +evt.target.value;
    this.setState({w, aspect: w / this.state.h});
  }

  setH = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const h = +evt.target.value;
    this.setState({h, aspect: this.state.w / h});
  }

  swapWH = () => {
    this.setState({
      w: this.state.h,
      h: this.state.w,
    })
  }

  getImage = () => {
    const cvs = document.getElementById('fractal-preview-canvas') as HTMLCanvasElement;
    if (cvs) {
      const image =  cvs.toDataURL();
      this.setState({ image })
    }
  }

  onCropChange = (crop: Crop) => this.setState({crop});
  onCropComplete = (area: Area, areaPixels: Area) => {
    this.cropPixels = areaPixels;
  }
  onZoomChange = (zoom: number) => this.setState({zoom});


  componentDidUpdate(prevProps: Props) {
    if (this.props.visible) {
      if (!prevProps.visible || (this.shouldRedraw && this.props.fractal.drawState === DrawState.None)) {
        this.getImage();
        this.shouldRedraw = false;
      }
      else if (this.props.fractal.drawState === DrawState.Draw || this.props.fractal.drawState === DrawState.Color) {
        this.shouldRedraw = true;
      }
    }
    if (this.props.fractal.drawState === DrawState.Capture) {
      setTimeout(this.capture, 500);
    }
  }

  determineView() {
    let {cx, cy, w, h, ppu, pixelCount, t} = this.props.fractal.view;
    const f = scaleFactor(w, h, pixelCount)
    const rx = w / ppu / 2;
    const ry = h / ppu / 2;
    const xscale = linearScale([0, f*w], [cx - rx, cx + rx]);
    const yscale = linearScale([0, f*h], [cy - ry, cy + ry]);

    const {x, y, width, height} = this.cropPixels;
    const xdom = [xscale(x), xscale(x+width)] as [number,number];
    const ydom = [yscale(y), yscale(y+height)] as [number,number];

    return {
      cx: (xdom[0] + xdom[1]) / 2,
      cy: (ydom[1] - ydom[1]) / 2,
      xdom,
      ydom,
      w: this.state.w,
      h: this.state.h,
      t
    }
  }

  getData(view: any) {
    const ppu = Math.round(view.w / (view.xdom[1] - view.xdom[0]))
    return stateToJson({
      ...this.props.fractal,
      view: {
        cx: view.cx,
        cy: view.cy,
        w: view.w,
        h: view.h,
        ppu: ppu,
        t: view.t,
      },
    })
  }

  capture = () => {
    const title = 'fract' + Math.floor((Date.now() - new Date(2020,0,25).getTime())/1000).toString(16);
    const view = this.determineView();
    const data = this.getData(view)
    const image = createImageData({
      ...this.props.fractal,
      view,
    })
    if (image) {
      const cvs = document.createElement('canvas')
      const ctx = cvs.getContext('2d')!
      cvs.width = image.width;
      cvs.height = image.height;
      ctx.putImageData(image, 0, 0);
      cvs.toBlob(blob => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          this.props.addToGallery(url, data, title)
        }
      })
    }
    this.props.finishCapture();
  }

  onClick = () => {
    this.props.startCapture();
  }

  render() {    
    return (
      <>
      <CropContainer style={this.props.visible ? {} : {display: 'none'}} >
        <Cropper
          image={this.state.image || ''}
          crop={this.state.crop}
          zoom={this.state.zoom}
          aspect={this.state.w / this.state.h}
          onCropChange={this.onCropChange}
          onCropComplete={this.onCropComplete}
          onZoomChange={this.onZoomChange}
        />
      </CropContainer>
      <ControlPanel visible={this.props.visible}>

          <Box>
            <NumberInput
              value={this.state.w}
              label="width"
              onChange={this.setW}
              min={0}
              step={10}
              inputProps={{style: {maxWidth: '4em'}}}
            />
          </Box>

          <IconButton onClick={this.swapWH} title="swap width and height">
            <Icon.SwapHoriz />
          </IconButton>

          <Box>
            <NumberInput
              value={this.state.h}
              label="height"
              onChange={this.setH}
              min={0}
              step={10}
              inputProps={{style: {maxWidth: '4em'}}}
            />
          </Box>

          <Fab onClick={this.onClick} color="primary" title="render selected area">
            <Icon.AddAPhoto/>
          </Fab>

      </ControlPanel>
      </>
    )
  }
}


export default connect(
  (state: State) => ({
    visible: state.ui.nav === Nav.Capture,
    fractal: state.fractal,
  }),
  (dispatch: Dispatch) => ({
    addToGallery: (image:string, data: JsonState, title: string) => dispatch(addToGallery(image, data, title)),
    startCapture: () => {
      dispatch(startWaiting());
      dispatch(capture());
    },
    finishCapture: () => dispatch(finish()),
  }),
)(Capture);