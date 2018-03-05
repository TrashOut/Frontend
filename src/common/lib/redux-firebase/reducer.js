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
import { Map } from 'immutable';
import { Record } from '../../transit';

const State = Record({
  errors: Map(), // We need one place to store all Firebase errors.
}, 'firebase');

// "permission_denied at /users-emails/123: Client doesn't have..."
const removeStalePermissionDeniedErrors = path => errors => errors
  .filter((value, key) => key.indexOf(`${path}:`) === -1);

const firebaseReducer = (state = new State(), action) => {
  switch (action.type) {

    case actions.FIREBASE_ON_PERMISSION_DENIED: {
      const { message } = action.payload;
      return state.setIn(['errors', message], true);
    }

    case actions.FIREBASE_ON_QUERY: {
      const { path } = action.payload;
      return state.update('errors', removeStalePermissionDeniedErrors(path));
    }

    default:
      return state;

  }
};

export default firebaseReducer;
