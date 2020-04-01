import { CombinedState, Dispatch as Disp } from 'redux';
import { State as FractalState, Action as FractalAction } from './fractal/types';
import { State as UIState, Action as UIAction } from './ui/types';
import { State as GalleryState, Action as GalleryAction } from './gallery/types';

export type State = CombinedState<{
  fractal: FractalState,
  ui: UIState,
  gallery: GalleryState,
}>;

export type Action = FractalAction | UIAction | GalleryAction;

export type Dispatch = Disp<Action>