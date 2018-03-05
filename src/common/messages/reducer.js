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
import errorToMessage from '../app/errorToMessage';
import successToMessage from '../app/successToMessage';
import { Map } from 'immutable';
import { Record } from '../transit';

const State = Record({
  list: Map(),
  redirected: false,
  redirect: null,
}, 'messages');

const messagesReducer = (state = new State(), action) => {
  switch (action.type) {
    case actions.MESSAGE_ADD_SUCCESS: {
      const message = successToMessage(action.payload, action.originalObject);
      if (!message) return state;
      message.type = 'success';
      return state.update('list', (list) => list.set(action.payload.code, message));
    }
    case actions.MESSAGE_ADD_ERROR: {
      const message = errorToMessage(action.payload);
      if (!message) return state;
      message.type = 'error';
      return state.update('list', (list) => list.set(action.payload.code, message));
    }
    case actions.CLEAR_MESSAGES: {
      return state.update('list', (list) => list.clear());
    }
    case actions.REDIRECTED: {
      return state.set('redirect', null).update('redirected', (r) => !r);
    }
    case actions.CLOSE_MESSAGE: {
      return state.update('list', (list) => list.remove(action.payload));
    }
    default:
      return state;
  }
};

export default messagesReducer;
