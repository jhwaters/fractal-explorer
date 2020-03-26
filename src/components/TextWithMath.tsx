import React from 'react';
import Katex, { KatexProps } from './Katex';
import Typography, {TypographyProps} from '@material-ui/core/Typography';


export type StringOrMath = string | KatexProps

const RenderStringOrMath = (data: StringOrMath) => {
  if (typeof data === 'string') {
    return data;
  } else {
    return React.createElement(Katex, data);
  }
}

export type StringWithMath = StringOrMath | StringOrMath[]

export type TextWithMathProps = {
  data: StringWithMath
  typographyProps?: TypographyProps
}

const TextWithMath = ({data, typographyProps}: TextWithMathProps) => {
  if (Array.isArray(data)) {
    return React.createElement(Typography, typographyProps, ...data.map(RenderStringOrMath))
  }
  if (typeof data === 'string') {
    return React.createElement(Typography, typographyProps, data);
  }
  return React.createElement(Katex, data);
}

export default TextWithMath