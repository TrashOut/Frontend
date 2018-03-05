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
import app from './app/reducer';
import areas from './areas/reducer';
import articles from './articles/reducer';
import auth from './auth/reducer';
import breadcrumbs from './breadcrumbs/reducer';
import collectionPoints from './collectionpoints/reducer';
import config from './config/reducer';
import confirms from './confirms/reducer';
import device from './device/reducer';
import events from './events/reducer';
import form from './lib/redux-form';
import intl from './intl/reducer';
import map from './map/reducer';
import messages from './messages/reducer';
import organizations from './organizations/reducer';
import spam from './spam/reducer';
import table from './table/reducer';
import translate from './translate/reducer';
import trashes from './trashmanagement/reducer';
import users from './users/reducer';
import windows from './window/reducer';
import { combineReducers } from 'redux';
import { FIREBASE_ON_AUTH } from '../common/lib/redux-firebase/actions';
import { firebaseReducer as firebase } from './lib/redux-firebase';
import { routerReducer } from 'react-router-redux';
import { updateStateOnStorageLoad } from './configureStorage';

const resetStateOnSignOut = (reducer, initialState, reset) => (state, action) => {
  const userWasSignedOut = action.type === FIREBASE_ON_AUTH
    && state.users.viewer
    && !action.payload.user;

  if (userWasSignedOut || reset) {
    state = {
      app: state.app,
      config: initialState.config,
      device: initialState.device,
      intl: initialState.intl,
    };
  }

  if (userWasSignedOut) {
    state.config = state.config.set('signoutInProcess', true);
    setTimeout(() => global.window.location.reload(), 300);
  }

  return reducer(state, action);
};

const configureReducer = (initialState: Object, reset) => {
  let reducer = combineReducers({
    app,
    areas,
    articles,
    auth,
    breadcrumbs,
    collectionPoints,
    config,
    confirms,
    device,
    events,
    firebase,
    form,
    intl,
    map,
    messages,
    organizations,
    router: routerReducer,
    spam,
    table,
    translate,
    trashes,
    users,
    windows,
  });

  reducer = resetStateOnSignOut(reducer, initialState, reset);
  reducer = updateStateOnStorageLoad(reducer);

  return reducer;
};

export default configureReducer;
