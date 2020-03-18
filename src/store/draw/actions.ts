import {
  SetDrawing,
  SetRecolor,
  SET_DRAWING,
  SET_RECOLOR,
} from './types';

export const setDrawing = (drawing: boolean, fullRes?: boolean): SetDrawing => {
  const pl: {drawing: boolean, fullResolution?: boolean} = {drawing};
  if (fullRes !== undefined) {
    pl.fullResolution = fullRes;
  } else if (drawing) {
    pl.fullResolution = false;
  }
  return ({
    type: SET_DRAWING,
    payload: pl
  })
}

export const setRecolor = (recolor: boolean): SetRecolor => {
  return {
    type: SET_RECOLOR,
    payload: recolor
  }
}