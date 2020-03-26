import { CombinedState, Dispatch as Disp } from 'redux';
import { State as ColorState, Action as ColorAction } from './color/types';
import { State as ViewState, Action as ViewAction } from './view/types';
import { State as AlgorithmState, Action as AlgorithmAction } from './algorithm/types';
import { State as UIState, Action as UIAction } from './ui/types';

export type State = CombinedState<{
  algorithm: AlgorithmState,
  color: ColorState,
  view: ViewState,
  ui: UIState,
}>;

export type Action = AlgorithmAction | ColorAction | ViewAction | UIAction;

export type Dispatch = Disp<Action>