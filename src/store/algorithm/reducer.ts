import {
  State,
  Action,
  SET_FRACTAL,
  UPDATE_PARAMS,
} from './types';
import { FractalList } from '../../fractals';

const Dflt = 'Julia1KC'


const initialState: State = {
  current: Dflt,
  params: FractalList[Dflt].create(),
  defaultParams: {bound: 10, iterations: 30},
  fractals: FractalList,
  paramControls: FractalList[Dflt].controls,
}


export default function(state: State=initialState, action: Action) {
  switch (action.type) {
    case SET_FRACTAL:
      if (action.payload.params === undefined) {
        return {
          ...state, 
          current: action.payload.current, 
          params: state.fractals[action.payload.current].create(),
          paramControls: state.fractals[action.payload.current].controls,
        }
      } else {
        return {
          ...state,
          current: action.payload.current,
          params: action.payload.params,
          paramControls: state.fractals[action.payload.current].controls,
        }
      }
    case UPDATE_PARAMS:
      return {...state, params: {...state.params, ...action.payload}}
    default:
      return state
  }
}