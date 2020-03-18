import React from 'react';
import { Provider } from 'react-redux';
import Theme from './Theme';
import { Store } from 'redux';
import App from './App';
import { State as AppState, Action as AppAction } from '../store/types';

type Props = {
  store: Store<Partial<AppState>, AppAction>
}

export default class Root extends React.Component<Props> {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <Theme>
          <App/>
        </Theme>
      </Provider>
    )
  }
}
