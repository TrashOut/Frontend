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
import User from '../models/user';
import { firebaseActions } from '../lib/redux-firebase';
import { Map, fromJS } from 'immutable';
import { Record } from '../transit';

const State = Record({
  areaUsers: Map(),
  formUsers: Map(),
  isFetching: false,
  isLoaded: false,
  isSending: false,
  online: null,
  onlineLoaded: false,
  user: new User(),
  userLoaded: false,
  userSignedIn: false,
  viewer: new User(),
  apiKey: fromJS({
    apiKey: null,
    limitPerHour: null,
    isFetching: false,
  }),
}, 'usersReducer');


const usersReducer = (state = new State(), action) => {
  switch (action.type) {

    case actions.FETCH_ME_START: {
      return state.set('isFetching', true);
    }

    case actions.FETCH_ME_ERROR: {
      return state.set('isFetching', false);
    }

    case actions.FETCH_ME_SUCCESS:
    case firebaseActions.FIREBASE_ON_AUTH: {
      const { user } = action.payload;
      const isSocialLogin = action.type === actions.FETCH_ME_SUCCESS
        ? (state.viewer || {}).isSocialLogin
        : (user || {}).isSocialLogin;

      const nextState = state
        .set('viewer', (user && !user.token && state.viewer) ? user.set('token', state.viewer.token) : user)
        .set('userLoaded', true)
        .set('userSignedIn', !!user)
        .set('isFetching', false);

      if (user) return nextState.setIn(['viewer', 'isSocialLogin'], isSocialLogin);

      return nextState;
    }

    case firebaseActions.FIREBASE_SIGN_IN_SUCCESS: {
      return state
        .set('userLoaded', true)
        .set('userSignedIn', true);
    }

    case actions.FETCH_ME_EVENTS_START:
    case actions.FETCH_USER_START: {
      return state.set('isFetching', true);
    }

    case actions.FETCH_ME_EVENTS_SUCCESS: {
      return state
        .setIn(['viewer', 'events'], action.payload)
        .set('isFetching', false);
    }

    case actions.FETCH_USER_DETAIL_START:
      return state.set('isFetching', true);

    case actions.FETCH_USER_DETAIL_SUCCESS: {
      return state
        .set('user', new User(action.payload))
        .set('isFetching', false);
    }

    case actions.UPDATE_USER_START: {
      return state.set('isSending', true);
    }

    case actions.UPDATE_USER_ERROR:
    case actions.UDPATE_USER_SUCCESS: {
      return state.set('isSending', false);
    }

    case 'FIND_USER_BY_EMAIL_SUCCESS':
      return state.set('isFetching', false);

    case 'FIND_USER_BY_EMAIL_START':
      return state.set('isFetching', true);

    case actions.FETCH_AREA_USERS_START: {
      return state.set('isFetching', true);
    }

    case actions.FETCH_AREA_USERS_ERROR: {
      return state.set('isFetching', false);
    }

    case actions.FETCH_AREA_USERS_SUCCESS: {
      const { rootAreaId, roleId } = action.meta.action.meta;
      return state
        .setIn(['areaUsers', rootAreaId, roleId], action.payload)
        .set('isFetching', false);
    }

    case actions.GET_API_KEY_START:
    case actions.GENERATE_API_KEY_START: {
      return state
        .setIn(['apiKey', 'isFetching'], true);
    }

    case actions.GENERATE_API_KEY_SUCCESS: {
      const { apiKey } = action.payload;
      return state
        .setIn(['apiKey', 'apiKey'], apiKey)
        .setIn(['apiKey', 'isFetching'], false);
    }

    case actions.GET_API_KEY_SUCCESS: {
      const { apiKey, limitPerHour } = action.payload;
      return state
        .setIn(['apiKey', 'apiKey'], apiKey)
        .setIn(['apiKey', 'limitPerHour'], limitPerHour)
        .setIn(['apiKey', 'isFetching'], false);
    }

    default:
      return state;

  }
};

export default usersReducer;
