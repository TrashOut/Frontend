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
import configureReporting from '../common/configureReporting';
import configureStore from '../common/configureStore';
import createHistory from 'history/createBrowserHistory';
import createStorageEngine from 'redux-storage-engine-localstorage';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './app/Root';
import uuid from 'uuid';
import { fromJSON } from '../common/transit';
import { routerMiddleware } from 'react-router-redux';

const initialState = fromJSON(window.__INITIAL_STATE__); // eslint-disable-line no-underscore-dangle

const reportingMiddleware = configureReporting({
  appVersion: initialState.config.appVersion,
  sentryUrl: initialState.config.sentryUrl,
  unhandledRejection: fn => window.addEventListener('unhandledrejection', fn),
});

const history = createHistory();
export const store = configureStore({ // eslint-disable-line import/prefer-default-export
  initialState,
  platformDeps: { createStorageEngine, uuid },
  platformMiddleware: [reportingMiddleware],
  routerMiddleware: [routerMiddleware(history)],
});

injectTapEventPlugin();
const appElement = document.getElementById('app');

ReactDOM.render(<Root store={store} history={history} />, appElement);

// Hot reload render.
if (module.hot) {
  module.hot.accept('./app/Root', () => {
    const NextRoot = require('./app/Root');

    ReactDOM.render(<NextRoot store={store} history={history} />, appElement);
  });
}
