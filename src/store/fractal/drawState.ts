import { DrawState } from './types';

export const SET_DRAW_STATE = 'FRACTAL_SET_DRAW'
export const FINISH_DRAWING = 'FRACTAL_FINISH_DRAW'

export type SetDrawState = {
  type: typeof SET_DRAW_STATE
  payload: DrawState
}

export type FinishDrawing = {
  type: typeof FINISH_DRAWING
}

export type DrawAction = SetDrawState | FinishDrawing;

export function reducer(state: DrawState=DrawState.None, action: DrawAction) {
  switch(action.type) {
    case SET_DRAW_STATE:
      return action.payload;
    case FINISH_DRAWING:
      return DrawState.None
    default:
      return state;
  }
}

export const redraw = (): SetDrawState => ({
  type: SET_DRAW_STATE,
  payload: DrawState.Draw,
})

export const recolor = (): SetDrawState => ({
  type: SET_DRAW_STATE,
  payload: DrawState.Color,
})

export const capture = (): SetDrawState => ({
  type: SET_DRAW_STATE,
  payload: DrawState.Capture,
})

export const finish = (): FinishDrawing => ({
  type: FINISH_DRAWING,
})