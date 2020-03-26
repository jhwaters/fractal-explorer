import React from 'react'
import Canvas from './Canvas';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';


const MyBox = withStyles({
  root: {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column-reverse',
    flexGrow: 1,
    paddingTop: '50px'
  }
})(Box)

const Display = () => (
  <MyBox>
    <Canvas/>
  </MyBox>
)

export default Display