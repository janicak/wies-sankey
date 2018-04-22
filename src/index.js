import { Provider } from 'preact-redux';
import store from './store';
import App from './components/App';
import './style.scss';

import { h, render } from 'preact';

const Index = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

render(<Index />, document.body);
