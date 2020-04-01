import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/Root';
import store from './store';
import { uploadBase64 } from './store/fractal/actions';
import './index.css';
import * as serviceWorker from './serviceWorker';


function getFractalFromSearch() {
  const x = new URLSearchParams(window.location.search).get('frac');
  if (x) {
    store.dispatch(uploadBase64(x))
  }
}

getFractalFromSearch()

ReactDOM.render(<Root store={store} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

serviceWorker.register();