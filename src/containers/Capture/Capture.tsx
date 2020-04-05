import React from 'react';
import { connect } from 'react-redux';
import { State, Dispatch } from '../../store/types';
import { FractalState, DrawState } from '../../store/fractal/types';
import { capture, finish, addToGallery, startWaiting } from '../../store/actions';
import { Nav } from '../../store/ui/types';
import Cropper from 'react-easy-crop';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import ControlPanel from '../Controls/ControlPanel';
import IconButton from '@material-ui/core/IconButton';
import FractalDrawer, { linearScale, scaleDown, DrawerView } from '../../fractals/FractalDrawer';
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
  drawer: FractalDrawer
  data: JsonState
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
    this.drawer = new FractalDrawer();
    this.drawer.fullResolution = true;
    this.data = stateToJson(props.fractal);
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

  determineView(): DrawerView {
    const {cx, cy, w, h, ppu} = {...this.props.fractal.view, ...scaleDown(this.props.fractal.view)};
    const rx = w / ppu / 2;
    const ry = h / ppu / 2;
    const xscale = linearScale([0, w], [cx - rx, cx + rx]);
    const yscale = linearScale([h, 0], [cy - ry, cy + ry]);

    const {x, y, width, height} = this.cropPixels;

    return {
      x: [xscale(x), xscale(x+width)] as [number,number],
      y: [yscale(y), yscale(y+height)] as [number,number],
      w: this.state.w,
      h: this.state.h,
    }
  }

  setData(view: any) {
    const newview = {
      cx: (view.x[0] + view.x[1]) / 2,
      cy: (view.y[0] + view.y[1]) / 2,
      w: view.w,
      h: view.h,
      ppu: Math.round(view.w / (view.x[1] - view.x[0]))
    };

    this.data = stateToJson({
      ...this.props.fractal,
      view: {...this.props.fractal.view, ...newview},
    })
  }


  saveImage() {
    this.drawer.toURL(url => {
      const title = 'fract' + Math.floor((Date.now() - new Date(2020,0,25).getTime())/1000).toString(16)
      this.props.addToGallery(url, this.data, title);
    })
  }

  capture = () => {
    const view = this.determineView();
    this.drawer.draw({
      ...this.props.fractal,
      view,
    })
    this.setData(view);
    this.saveImage();
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