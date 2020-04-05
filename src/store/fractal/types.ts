import { CombinedState } from 'redux';

import {
  AlgorithmAction,
  AlgorithmState,
} from './algorithm/types';
import {
  ColorAction,
  ColorState,
} from './color/types';
import {
  ViewAction,
  ViewState,
} from './view/types';
import {
  DrawAction,
} from './drawState';

export enum DrawState {
  None,
  Draw,
  Color,
  Capture,
}

export const UPDATE_FRACTAL = 'FRACTAL_UPDATE';

export type UpdateFractal = {
  type: typeof UPDATE_FRACTAL
  payload: Partial<{
    algorithm: AlgorithmState<any>
    color: Partial<ColorState>
    view: Partial<Omit<ViewState,'pixelCount'>>
  }> | undefined
}

export type FractalState = CombinedState<{
  algorithm: AlgorithmState<any>
  color: ColorState
  view: ViewState
  drawState: DrawState
}>

export type FractalAction = AlgorithmAction<any> | ColorAction | ViewAction | UpdateFractal | DrawAction;