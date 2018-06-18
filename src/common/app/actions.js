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
import { firebaseStart } from '../lib/redux-firebase/actions';

export const APP_OFFLINE = 'APP_OFFLINE';
export const APP_ONLINE = 'APP_ONLINE';
export const APP_SET_LOCATION = 'APP_SET_LOCATION';
export const APP_SHOW_MENU = 'APP_SHOW_MENU';
export const APP_START = 'APP_START';
export const APP_STORAGE_LOAD = 'APP_STORAGE_LOAD';
export const APP_TOGGLE_API = 'APP_SWITCH_API';
export const RESET_ERROR = 'RESET_ERROR';

export const CURRENT_COOKIES_CONSENT_SUCCESS = 'CURRENT_COOKIES_CONSENT_SUCCESS';
export const CURRENT_COOKIES_CONSENT = 'CURRENT_COOKIES_CONSENT';
export const CURRENT_COOKIES_CONSENT_START = 'CURRENT_COOKIES_CONSENT_START';
export const CURRENT_COOKIES_CONSENT_ERROR = 'CURRENT_COOKIES_CONSENT_ERROR';

export const toggleApi = () => ({ getState }) => {
  let url = 'https://private-b9c0e-trashout.apiary-mock.com/';
  if (getState().app.apiUrl === 'https://private-b9c0e-trashout.apiary-mock.com/') {
    url = 'https://private-b9c0e-trashout.apiary-mock.com/';
  }
  return {
    type: APP_TOGGLE_API,
    payload: url,
  };
};

export const setLocation = (location) => ({
  type: APP_SET_LOCATION,
  payload: { location },
});

export const showMenu = (show: bool) => ({
  type: APP_SHOW_MENU,
  payload: { show },
});

export const resetError = () => ({
  type: RESET_ERROR,
});

export const acceptCookiesConsent = () => ({ dispatch, storageCookiesEngine }) => {
  storageCookiesEngine.save({ acceptCookies: true }).then(() => dispatch(checkCookies()));

  return {
    type: 'ACCEPT_COOKIES_CONSENT',
    payload: {},
  };
};

export const checkCookies = () => ({ storageCookiesEngine }) => ({
  type: CURRENT_COOKIES_CONSENT,
  payload: storageCookiesEngine && storageCookiesEngine.load(),
});

export const start = () => {
  const loadStorage = async (dispatch, storageEngine) => {
    const state = await storageEngine.load();
    dispatch({ type: APP_STORAGE_LOAD, payload: state });
  };
  return ({ dispatch, storageEngine }) => {
    loadStorage(dispatch, storageEngine).finally(() => {
      dispatch(firebaseStart());
    });
    return {
      type: APP_START,
    };
  };
};

