import configureReducer from './configureReducer';
import configureMiddleware from './configureMiddleware';
import { applyMiddleware, createStore } from 'redux';

type Options = {
  initialState: Object,
  platformDeps?: Object,
  platformMiddleware?: Array<Function>,
};


const configureStore = (options: Options, reset) => {
  const {
    initialState,
    platformDeps = {},
    platformMiddleware = [],
    routerMiddleware = [],
  } = options;
  const reducer = configureReducer(initialState, reset);

  const middleware = configureMiddleware(
    initialState,
    platformDeps,
    platformMiddleware,
    routerMiddleware,
  );

  const store = createStore(
    reducer,
    initialState,
    applyMiddleware(...middleware)
  );

  // Enable hot reloading for reducers.
  if (module.hot) {
    // Webpack for some reason needs accept with the explicit path.
    module.hot.accept('./configureReducer', () => {
      const configureReducer = require('./configureReducer');

      store.replaceReducer(configureReducer(initialState));
    });
  }

  return store;
};

export default configureStore;
