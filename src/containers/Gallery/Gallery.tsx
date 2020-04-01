import React from 'react';
import { connect } from 'react-redux';
import { State, Dispatch } from '../../store/types';
import { Nav } from '../../store/ui/types';
import { State as GalleryState } from '../../store/gallery/types';
import { deleteImage } from '../../store/gallery/actions';
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


function ImageTile(props: {
  title: string, 
  url: string,
  onView: () => void,
  onDelete: () => void,
}) {
  return (
    <StyledGridListTile key={props.title} cols={1}>
      <img 
        src={props.url}
        alt={props.title} 
        style={{objectFit: 'cover'}}/>
      <GridListTileBar
        //title={<TypographyWithMath data={props.title}/>}
        actionIcon={
          <>
          <StyledIconButton onClick={props.onDelete}>
            <Icon.Delete/>
          </StyledIconButton>
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
}


class Gallery extends React.Component<Props> {
  state: {
    viewURL: string | null
    deleteURL: string | null
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      viewURL: null,
      deleteURL: null
    };
  }

  closePopup = () => {
    this.setState({viewURL: null, deleteURL: null});
  }

  delete = () => {
    this.props.deleteImage(this.state.deleteURL);
    this.setState({deleteURL: null})
  }

  viewer = (img: string) => () => {
    this.setState({viewURL: img});
  }

  deleter = (img: string) => () => {
    this.setState({deleteURL: img});
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
            onView: this.viewer(tile.url),
            onDelete: this.deleter(tile.url),
          });
        })}
      </StyledGridList>
      <Popover
        style={{overflow: 'hidden'}}
        open={this.state.viewURL !== null}
        onClick={this.closePopup}
        onClose={this.closePopup}>
        <div style={{width: '100%', height: '100%', overflow: 'scroll'}}>
          <img 
            alt="fractal"
            src={this.state.viewURL || ''}
            style={{objectFit: 'contain'}}/>
        </div>
      </Popover>
      <Popover
        open={this.state.deleteURL !== null}
        onClose={this.closePopup}
      >
        <Box m={2}>
          <Typography>Delete this image?</Typography>
          <ButtonGroup color="primary" variant="outlined">
            <Button onClick={this.delete}>Yes</Button>
            <Button onClick={this.closePopup}>No</Button>
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
    }
  })
)(Gallery)