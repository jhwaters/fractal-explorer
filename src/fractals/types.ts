import { Color } from './color/types'
import { FractalInterface } from './algorithm/types';


export interface Algorithm<T> {
  method: FractalInterface<T>,
  params: T
}
