import { CombinedState } from 'redux';
import { State as ColorState, Action as ColorAction } from './color/types';
import { State as ViewState, Action as ViewAction } from './view/types';
import { State as AlgorithmState, Action as AlgorithmAction } from './algorithm/types';
import { State as DrawState, Action as DrawAction } from './draw/types';

export type State = CombinedState<{
  algorithm: AlgorithmState,
  draw: DrawState,
  color: ColorState,
  view: ViewState,
}>;

export type Action = AlgorithmAction | ColorAction | ViewAction | DrawAction;