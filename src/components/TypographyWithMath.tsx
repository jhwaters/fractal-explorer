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

export interface TypographyWithMathProps extends TypographyProps {
  data: StringWithMath
  className?: string
}

const TextWithMath = ({data, ...props}: TypographyWithMathProps) => {
  if (Array.isArray(data)) {
    return React.createElement(Typography, props, ...data.map(RenderStringOrMath))
  }
  if (typeof data === 'string') {
    return React.createElement(Typography, props, data);
  }
  return React.createElement(Typography, props, React.createElement(Katex, data));
}

export default TextWithMath