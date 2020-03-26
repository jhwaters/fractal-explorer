import React from 'react';
import { connect } from 'react-redux';
import { startDrawing } from '../../store/ui/actions';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

type Props = {
  open: boolean
  onClose: () => void
  startDrawing: (fullRes?: boolean) => void
}

const FullResolutionPopup = (props: Props) => {
  const drawFull = () => {
    props.startDrawing(true);
    props.onClose();
  }

  return (
    <Popover 
      open={props.open} 
      onClose={props.onClose}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Box m={2}>
        <Box m={1}>
          <Typography>
            Are you sure you want to render in full resolution?
            This may take a long time.
          </Typography>
        </Box>
      <ButtonGroup
        fullWidth
        color="primary"
        variant="outlined">
        <Button onClick={drawFull}>
          Yes! Render in full resolution
        </Button>
        <Button onClick={props.onClose} >
          Cancel
        </Button>
      </ButtonGroup>
      </Box>
    </Popover>
  )
}


export default connect(
  null,
  (dispatch: any) => ({
    startDrawing: (fullResolution: boolean=false) => dispatch(startDrawing(fullResolution))
  })
)(FullResolutionPopup);