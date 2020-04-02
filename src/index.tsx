import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/Root';
import store from './store';
import { uploadUrl } from './store/fractal/actions';
import './index.css';
import * as serviceWorker from './serviceWorker';


store.dispatch(uploadUrl(window.location.search));

ReactDOM.render(<Root store={store} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

serviceWorker.register();