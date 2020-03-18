import React from 'react'
import katex from 'katex'
import 'katex/dist/katex.css';


type Props = {
  math: string
  displayMode: boolean
}

class KaTeX extends React.Component<Props> {
  ref: React.RefObject<HTMLSpanElement>

  static defaultProps = {
    displayMode: false
  }

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
    return <span ref={this.ref} style={{whiteSpace: 'nowrap'}}/>
  }
}

export default KaTeX