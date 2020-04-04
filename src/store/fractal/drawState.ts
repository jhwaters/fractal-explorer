import { DrawState } from './types';

export const SET_DRAW_STATE = 'FRACTAL_SET_DRAW'


export type SetDrawState = {
  type: typeof SET_DRAW_STATE
  payload: DrawState
}

export type DrawAction = SetDrawState;

export function reducer(state: DrawState=DrawState.None, action: DrawAction) {
  switch(action.type) {
    case SET_DRAW_STATE:
      return action.payload;
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

export const finish = (): SetDrawState => ({
  type: SET_DRAW_STATE,
  payload: DrawState.None,
})