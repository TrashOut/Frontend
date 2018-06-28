/**
 * TRASHOUT IS an environmental project that teaches people how to recycle
 * and showcases the worst way of handling waste - illegal dumping. All you need is a smart phone.
 *
 * FOR PROGRAMMERS: There are 10 types of programmers -
 * those who are helping TrashOut and those who are not. Clean up our code,
 * so we can clean up our planet. Get in touch with us: help@trashout.ngo
 *
 * Copyright 2017 TrashOut, n.f.
 *
 * This file is part of the TrashOut project.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * See the GNU General Public License for more details: <https://www.gnu.org/licenses/>.
 */
import actionWatchers from './actionWatchers';
import config from '../../config';
import configureStorage from './configureStorage';
import createLoggerMiddleware from 'redux-logger';
import errorToMessage from '../common/app/errorToMessage';
import firebase from 'firebase';
import { addMessage } from '../common/messages/actions';
import { fromJS } from 'immutable';

function createActionWatcherMiddleware(dependencies, actionWatchers) {
  const watcherFns = fromJS(actionWatchers)
    .flatten()
    .valueSeq()
    .filter(v => typeof v === 'function')
    .toArray();
  const flattenDeps = fromJS(dependencies)
    .flatten(true)
    .toJS();

  return function actionWatcherMiddleware({ dispatch, getState }) {
    return next => action => {
      watcherFns.forEach((watcher) => watcher({ ...flattenDeps, dispatch, action, getState }));
      return next(action);
    };
  };
}

let firebaseDeps = null;

// Like redux-thunk but with dependency injection.
const injectMiddleware = (deps, { withDispatch }) => ({ dispatch, getState }) => next => action => {
  if (typeof action === 'function') {
    Object.keys(withDispatch).forEach(key => {
      deps[key] = withDispatch[key](dispatch);
    });

    return dispatch(action(
      {
        ...deps,
        token: !!getState().users.viewer && getState().users.viewer.token,
        userId: !!getState().users.viewer && getState().users.viewer.id,
        userUid: !!getState().users.viewer && getState().users.viewer.uid,
        userRoleId: !!getState().users.viewer && getState().users.viewer.userRoleId,
        dispatch,
        getState,
      }
    ));
  }

  return next(action);
};

const createAction = (action, suffix, payload, originalObject) => ({
  type: `${action.type}_${suffix}`, meta: { action }, payload, originalObject,
});

// Like redux-promise-middleware but simpler.
const promiseMiddleware = () => ({ dispatch, getState }) => next => action => {
  const { payload } = action;
  const payloadIsPromise = payload && typeof payload.then === 'function';

  action.user = getState().users.viewer;
  if (!payloadIsPromise) return next(action);

  payload
    .then(value => {
      dispatch(createAction(action, 'SUCCESS', value, action.originalObject));
      if (action.onSuccess) {
        dispatch(dispatch(action.onSuccess()));
      }
      if (action.thenPromise) {
        action.thenPromise();
      }
      if (action.then) {
        dispatch(action.then);
        // setTimeout(() => dispatch(action.then), 100);
      }
      if (action.message) {
        dispatch(addMessage(action, value, true));
      }
    })
    .catch(error => {
      dispatch(createAction(action, 'ERROR', error));
      dispatch(addMessage(action, error, false));
    });

  return next(createAction(action, 'START'));
};

const messageMiddleware = () => ({ dispatch }) => next => action => {
  if (action.message) {
    next(action);
    return dispatch(addMessage(action, action.payload, true));
  }
  return next(action);
};

function dispatchPromise(dispatch) {
  return async (action) => {
    const d = dispatch(action);
    return await d.meta.action.payload;
  };
}

function createDependencyInjections() {
  return {
    withDispatch: { dispatchPromise },
  };
}


const configureMiddleware = (initialState, platformDeps, platformMiddleware, routerMiddleware) => {
  if (!firebaseDeps) {
    firebase.initializeApp(config.firebase);
    firebaseDeps = {
      firebase: firebase.database().ref(),
      firebaseAuth: firebase.auth,
      firebaseDatabase: firebase.database,
      firebaseStorage: firebase.storage,
    };
  }

  const {
    STORAGE_SAVE,
    storageCookiesEngine,
    storageEngine,
    storageMiddleware,
  } = configureStorage(initialState, platformDeps.createStorageEngine);


  const injectedMiddleware = injectMiddleware({
    ...platformDeps,
    ...firebaseDeps,
    getUid: () => platformDeps.uuid.v4(),
    now: () => Date.now(),
    storageEngine,
    storageCookiesEngine,
  }, createDependencyInjections());

  const middleware = [
    injectedMiddleware,
    promiseMiddleware({
      shouldThrow: error => !errorToMessage(error),
    }),
    messageMiddleware(),
    ...platformMiddleware,
    ...routerMiddleware,
    createActionWatcherMiddleware(createDependencyInjections(), actionWatchers),
  ];

  if (storageMiddleware) {
    middleware.push(storageMiddleware);
  }

  const enableLogger = process.env.NODE_ENV !== 'production' && (
    process.env.IS_BROWSER || initialState.device.isReactNative
  );

  // Logger must be the last middleware in chain.
  if (enableLogger) {
    const ignoredActions = [STORAGE_SAVE];
    const logger = createLoggerMiddleware({
      collapsed: true,
      predicate: (getState, action) => ignoredActions.indexOf(action.type) === -1,
      // Convert immutable to JSON.
      stateTransformer: state => state, // => JSON.parse(JSON.stringify(state)),
    });
    middleware.push(logger);
  }

  return middleware;
};

export default configureMiddleware;
