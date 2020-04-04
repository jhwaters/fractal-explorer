import React from 'react';
import { connect } from 'react-redux';
import { State, Dispatch } from '../../store/types';
import { Nav } from '../../store/ui/types';
import { GalleryState } from '../../store/gallery/types';
import { deleteImage, uploadJson, redraw, setNav } from '../../store/actions';
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
import Toolbar from '@material-ui/core/Toolbar';
import { jsonToUrl, JsonState } from '../../fractals/json';

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
  loadJson: (data: JsonState) => void
}


enum Popup {
  None,
  Delete,
  JSON,
  Link,
}


class Gallery extends React.Component<Props> {
  state: {
    current: {
      url: string,
      title: string,
      data: JsonState,
    } | null,
    popup: Popup
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      current: null,
      popup: Popup.None,
    };
  }

  close = () => {
    this.setState({current: null, popup: Popup.None});
  }
  
  closePopup = () => {
    this.setState({popup: Popup.None})
  }

  openDelete = () => {
    this.setState({popup: Popup.Delete})
  }

  onDelete = () => {
    if (this.state.current) {
      this.props.deleteImage(this.state.current.url);
      this.close();
    }
  }

  onCopy = () => {
    if (this.state.current) {
      
    }
  }

  onLink = () => {
    if (this.state.current) {
      const q = jsonToUrl(this.state.current.data);
      navigator.clipboard.writeText(window.location.href.split('?')[0] + '?' + q);
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

  viewer = (tile: {url: string, data: JsonState, title: string}) => () => {
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
          <Toolbar>
            <IconButton onClick={this.close} title="close" edge="start">
              <Icon.Back/>
            </IconButton>
            <IconButton onClick={this.openDelete} title="delete image">
              <Icon.Delete/>
            </IconButton>
            <IconButton onClick={this.onLoad} title="load in fractal viewer">
              <Icon.Upload/>
            </IconButton>
            <IconButton onClick={this.onDownload} title="download image">
              <Icon.Save/>
            </IconButton>
          </Toolbar>
          <img 
            alt="fractal"
            src={this.state.current?.url || ''}
            style={{
              objectFit: 'contain', 
              maxWidth: '100%', 
              maxHeight: '100%'
            }}/>
          
        </Box>
        <Popover
          open={this.state.popup === Popup.Delete}
          onClose={this.close}
        >
          <Box m={2}>
            <Typography>Delete this image?</Typography>
            <ButtonGroup color="primary" variant="outlined">
              <Button onClick={this.onDelete}>Yes</Button>
              <Button onClick={this.closePopup}>No</Button>
            </ButtonGroup>
          </Box>
        </Popover>
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
    loadJson: (data: JsonState) => {
      dispatch(uploadJson(data));
      dispatch(redraw());
      dispatch(setNav(Nav.Explore))
    }
  })
)(Gallery)