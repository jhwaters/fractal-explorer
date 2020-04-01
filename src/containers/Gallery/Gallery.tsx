import React from 'react';
import { connect } from 'react-redux';
import { State, Dispatch } from '../../store/types';
import { Nav } from '../../store/ui/types';
import { State as GalleryState } from '../../store/gallery/types';
import { deleteImage } from '../../store/gallery/actions';
import { uploadJson } from '../../store/fractal/actions';
import { redraw, setNav } from '../../store/ui/actions';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Box from '@material-ui/core/Box';
import { Icon } from '../../components';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { JSONState, shortName } from '../../fractals/json';

const StyledGridList = withStyles({
  root: {
    padding: '3px',
    paddingTop: '20px',
  },
})(GridList)

const StyledGridListTile = withStyles({
  root: {
    maxWidth: '200px',
    maxHeight: '200px',
    margin: '1mm',
  },
  tile: {
    width: '200px',
    height: '200px',
  },
})(GridListTile);

const StyledIconButton = withStyles({
  root: {
    color: 'rgba(255,255,255,0.5)',
    '& :hover': {
      color: 'rgba(255,255,255,1)',
    }
  }
})(IconButton)


interface TileProps {
  data: JSONState, 
  title: string,
  url: string,
  onView: () => void,
}

function ImageTile(props: TileProps) {
  const title = props.title;
  return (
    <StyledGridListTile key={title} cols={1}>
      <img 
        src={props.url}
        alt={title} 
        style={{objectFit: 'cover'}}/>
      <GridListTileBar
        title={title}
        actionIcon={
          <>
            <StyledIconButton onClick={props.onView}>
              <Icon.ViewImage/>
            </StyledIconButton>
          </>
        }
      />
    </StyledGridListTile>
  )
}


interface Props {
  images: GalleryState
  visible: boolean
  deleteImage: (url: string | null) => void
  loadJson: (data: JSONState) => void
}


class Gallery extends React.Component<Props> {
  state: {
    current: {
      url: string,
      title: string,
      data: JSONState,
    } | null,
    deletePopup: boolean
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      current: null,
      deletePopup: false,
    };
  }

  close = () => {
    this.setState({current: null, deletePopup: false});
  }

  onDelete = () => {
    this.setState({deletePopup: true})
  }

  closeDelete = () => {
    this.setState({deletePopup: false})
  }

  deleteCurrent = () => {
    if (this.state.current) {
      this.props.deleteImage(this.state.current.url);
      this.close();
    }
  }

  onCopy = () => {
    if (this.state.current) {
      navigator.clipboard.writeText(JSON.stringify(this.state.current.data));
    }
  }

  onDownload = () => {
    if (this.state.current) {
      const a = document.createElement('a')
      a.download = this.state.current.title + '.png';
      a.href = this.state.current.url;
      a.click();
    }
  }

  onLoad = () => {
    if (this.state.current) {
      this.props.loadJson(this.state.current.data);
      this.close();
    }
  }

  viewer = (tile: {url: string, data: JSONState, title: string}) => () => {
    this.setState({current: tile});
  }

  render() {

    return (
      <>
      <StyledGridList 
        cellHeight={180} 
        style={this.props.visible ? {} : {display: 'none'}}
      >
        {this.props.images.map((tile, index) => {
          return React.createElement(ImageTile, {
            ...tile,
            key: tile.url,
            onView: this.viewer(tile),
          });
        })}
      </StyledGridList>
      <Popover
        open={this.state.current !== null}
        onClose={this.close}>
        <Box style={{position: 'relative'}}>
          <IconButton onClick={this.close} title="close">
            <Icon.Back/>
          </IconButton>
          <IconButton onClick={this.onDelete} title="delete image">
            <Icon.Delete/>
          </IconButton>
          <IconButton onClick={this.onCopy} title="copy data to clipboard">
            <Icon.Copy/>
          </IconButton>
          <IconButton onClick={this.onLoad} title="load in fractal viewer">
            <Icon.Upload/>
          </IconButton>
          <IconButton onClick={this.onDownload} title="download image">
            <Icon.Save/>
          </IconButton>
          <img 
            alt="fractal"
            src={this.state.current?.url || ''}
            style={{
              objectFit: 'contain', 
              maxWidth: '100%', 
              maxHeight: '100%'
            }}/>
          
        </Box>
      </Popover>
      <Popover
        open={this.state.deletePopup}
        onClose={this.close}
      >
        <Box m={2}>
          <Typography>Delete this image?</Typography>
          <ButtonGroup color="primary" variant="outlined">
            <Button onClick={this.deleteCurrent}>Yes</Button>
            <Button onClick={this.closeDelete}>No</Button>
          </ButtonGroup>
        </Box>
      </Popover>

      </>
    )
  }
}


export default connect(
  (state: State) => ({
    visible: state.ui.nav === Nav.Gallery,
    images: state.gallery,
  }),
  (dispatch: Dispatch) => ({
    deleteImage: (url: string | null) => {
      if (url) dispatch(deleteImage(url));
    },
    loadJson: (data: JSONState) => {
      dispatch(uploadJson(data));
      dispatch(redraw());
      dispatch(setNav(Nav.Explore))
    }
  })
)(Gallery)