import React from 'react';
import { connect } from 'react-redux';
import { State as AppState } from '../store/types';
import Canvas from './Canvas';
import UI from './UI';
import styles from './App.module.css';

type Props = {
  fullResolution: boolean,
  stretch: boolean
}

type State = {
}

class App extends React.Component<Props> {
  
  render() {
    const classNames = [styles.CanvasContainer]
    if (this.props.stretch) {
      classNames.push(styles.Stretch)
    }
    if (this.props.fullResolution) {
      classNames.push(styles.FullResolution)
    }

    return (
      <>
      <UI />
      <div className={classNames.join(' ')}>
        <Canvas />
      </div>
      </>
    )
  }
}

export default connect(
  (state: AppState) => ({
    fullResolution: state.draw.fullResolution,
    stretch: state.view.stretch,
  })
)(App);