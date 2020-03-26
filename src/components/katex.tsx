import React from 'react'
import katex from 'katex'
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import 'katex/dist/katex.css';


const styles = createStyles({
  root: {
    whiteSpace: 'nowrap',
  }
})

export interface KatexProps {
  math: string
  displayMode?: boolean
  style?: React.CSSProperties
}

interface Props extends KatexProps, WithStyles<typeof styles> {}

class Katex extends React.PureComponent<Props> {
  ref: React.RefObject<HTMLSpanElement>

  constructor(props: Props) {
    super(props);
    this.ref = React.createRef();
  }

  renderMath() {
    if (this.ref.current) {
      katex.render(this.props.math, this.ref.current, {
        displayMode: this.props.displayMode
      })
    }
  }

  componentDidMount() {
    this.renderMath()
  }

  componentDidUpdate() {
    this.renderMath()
  }

  render() {
    const { classes } = this.props;
    return React.createElement('span', {
      ref: this.ref,
      className: classes.root,
    })
  }
}

export default withStyles(styles)(Katex)