import { CombinedState } from 'redux';

import {
  Action as AlgorithmAction,
  State as AlgorithmState,
} from './algorithm/types';
import {
  Action as ColorAction,
  State as ColorState,
} from './color/types';
import {
  Action as ViewAction,
  State as ViewState,
} from './view/types';



export type State = CombinedState<{
  algorithm: AlgorithmState<any>
  color: ColorState
  view: ViewState
}>

export type Action = AlgorithmAction<any> | ColorAction | ViewAction