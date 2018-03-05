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
import { Record } from '../transit';
import { firebaseActions } from '../lib/redux-firebase';
import * as actions from './actions';

const State = Record({
  formDisabled: false,
  error: null,
  success: null,
  badLoginCount: 0,
}, 'auth');

const authReducer = (state = new State(), action) => {
  switch (action.type) {

    case firebaseActions.FIREBASE_RESET_PASSWORD_START:
    case firebaseActions.FIREBASE_SIGN_IN_START:
    case firebaseActions.FIREBASE_SIGN_UP_START: {
      return state
        .set('formDisabled', true);
    }

    case firebaseActions.FIREBASE_RESET_PASSWORD_ERROR:
    case firebaseActions.FIREBASE_SIGN_IN_ERROR:
    case firebaseActions.FIREBASE_SIGN_UP_ERROR: {
      return state
        .set('formDisabled', false)
        .set('error', action.payload);
    }

    case firebaseActions.FIREBASE_RESET_PASSWORD_SUCCESS:
    case firebaseActions.FIREBASE_SIGN_IN_SUCCESS:
    case firebaseActions.FIREBASE_SIGN_UP_SUCCESS: {
      return state
        .set('formDisabled', false)
        .set('error', null)
        .set('success', action.payload);
    }

    case 'BAD_LOGIN':
      return state.update('badLoginCount', x => x + 1);

    case actions.CLEAR_BAD_LOGIN_COUNT:
      return state.set('badLoginCount', 0);

    default:
      return state;

  }
};

export default authReducer;
