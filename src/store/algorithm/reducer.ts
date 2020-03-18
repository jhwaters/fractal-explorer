import { randomC } from '../../fractal/juliaQuadratic'
import {
  State,
  Action,
  UPDATE,
  SET_METHOD,
} from './types';



const initialState: State = {
  method: 'julia-quadratic',
  'julia-quadratic': {
    bound: 10,
    iterations: 30,
    power: 2,
    c: randomC(),
  },
  julia: {
    f: 'e^(z^3)-0.6',
    //f: 'A',
    bound: 10,
    iterations: 30,
  },
  mandelbrot: {
    power: 2,
    bound: 10,
    iterations: 30,
  },
  burningship: {
    power: 2,
    bound: 10,
    iterations: 30,
    flip: true,
  }
}

export default function(state: State=initialState, action: Action) {
  switch(action.type) {
    case SET_METHOD:
      return {...state, method: action.payload}
    case UPDATE:
      const {method, params} = action.payload;
      const i = params.iterations;
      if (i !== undefined) {
        params.iterations = Math.max(2, i);
      }
      return {
        ...state,
        method: method,
        [method]: {...state[method], ...params},
      }
    default:
      return state;
  }
}