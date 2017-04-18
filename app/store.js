/**
 * Created by jamesbillinger on 4/18/17.
 */
import reducer from './reducer';
import thunk from 'redux-thunk';
import { applyMiddleware, compose, createStore } from 'redux';

export default function configureStore(initialState = {}) {
  let middleware = applyMiddleware(thunk);
  const store = middleware(createStore)(reducer, initialState);

  if (module.hot) {
    module.hot.accept('./reducer', () => {
      const nextReducer = require('./reducer').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}