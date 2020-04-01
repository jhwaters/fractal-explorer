import { COLORSCHEMES, ALLFRACTALS } from './fractals'


//export const fractalName = 'Julia1KC';
export const methodName = 'Julia'
export const colorSchemeName = 'Rainbow'
export const pixelCount = 90000
export const captureSize = {
  w: 1920,
  h: 1080,
}

export const canvasSize = {
  w: 600,
  h: 500,
}


export const method = ALLFRACTALS[methodName]
export const colorScheme = COLORSCHEMES[colorSchemeName]
