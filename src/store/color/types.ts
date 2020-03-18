export const ADD_SCHEME = 'COLOR_ADD_SCHEME';
export const UPDATE = 'COLOR_UPDATE';

export type SchemeName = string

export type State = {
  scheme: SchemeName,
  reverse: boolean,
  skew: number,
  schemeList: string[],
  customSchemes: {[k: string]: string[]}
}

export type Update = {
  type: typeof UPDATE,
  payload: Partial<State>,
}

export type AddScheme = {
  type: typeof ADD_SCHEME,
  payload: {
    name: string,
    colors: string[],
  }
}

export type Action = Update | AddScheme