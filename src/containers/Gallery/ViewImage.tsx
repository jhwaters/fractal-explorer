import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'scroll',
  },
})


interface Props {
  url: string
  open: boolean
  onClose: () => void
}

function ViewImage(props: Props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.imageContainer}>
        <Button onClick={props.onClose}>Close</Button>
        <img src={props.url} style={{objectFit: 'contain'}}/>
      </div>
    </div>
  )
}

export default ViewImage;