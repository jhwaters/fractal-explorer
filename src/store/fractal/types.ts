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


export const UPDATE_FRACTAL = 'FRACTAL_UPDATE';

export type UpdateFractal = {
  type: typeof UPDATE_FRACTAL
  payload: {
    algorithm: AlgorithmState<any>
    color: ColorState
    view: Omit<ViewState,'pixelCount'>
  } | undefined
}

export interface FractalState {
  algorithm: AlgorithmState<any>
  color: ColorState
  view: ViewState
}

export type FractalAction = AlgorithmAction<any> | ColorAction | ViewAction | UpdateFractal