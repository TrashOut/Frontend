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
import * as actions from './actions';
import { Record } from '../transit';

const exclude = ['APP_START', 'FIREBASE_START', 'MESSAGE_ADD_ERROR', 'MESSAGE_ADD_SUCCESS', actions.CURRENT_COOKIES_CONSENT_SUCCESS, actions.CURRENT_COOKIES_CONSENT_START, actions.CURRENT_COOKIES_CONSENT_ERROR];
const notExcluded = (type) => exclude.indexOf(type) === -1;

const State = Record({
  error: null,
  location: {
    pathname: '/',
  },
  menuShown: false,
  online: false,
  storageLoaded: false,
  apiError: false,
  pendingCount: 0,
  consentGiven: true,
}, 'app');

const appReducer = (state = new State(), action) => {
  if (action.type.endsWith('_ERROR') && notExcluded(action.type)) {
    const error = ((action.payload || {}).message || {}).error || {};
    return state
      .set('error', (error.code || error.errors || error.status !== 500) ? null : error)
      .update('pendingCount', c => c - 1);
  }

  if (action.type.endsWith('_START') && notExcluded(action.type)) {
    return state.update('pendingCount', c => c + 1);
  }

  if (action.type.endsWith('_SUCCESS') && notExcluded(action.type)) {
    return state.update('pendingCount', c => c - 1);
  }

  switch (action.type) {
    case actions.APP_OFFLINE:
      return state.set('online', false);

    case actions.APP_ONLINE:
      return state.set('online', true);

    case actions.APP_SET_LOCATION:
      return state.set('location', action.payload.location);

    case actions.APP_SHOW_MENU:
      return state.set('menuShown', action.payload.show);

    case actions.APP_STORAGE_LOAD:
      return state.set('storageLoaded', true);

    case actions.RESET_ERROR:
      return state.set('error', null);

    case actions.CURRENT_COOKIES_CONSENT_SUCCESS: {
      return state.set('consentGiven', (action.payload || {}).acceptCookies);
    }

    default:
      return state;

  }
};

export default appReducer;
