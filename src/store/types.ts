import { CombinedState, Dispatch as Disp } from 'redux';
import { FractalState, FractalAction } from './fractal/types';
import { UIState, UIAction } from './ui/types';
import { GalleryState, GalleryAction } from './gallery/types';

export type State = CombinedState<{
  fractal: FractalState,
  ui: UIState,
  gallery: GalleryState,
}>;

export type Action = FractalAction | UIAction | GalleryAction;

export type Dispatch = Disp<Action>