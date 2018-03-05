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
import { Record } from '../transit';

const State = Record({
  data: Map(),
  opened: 0,
  current: null,
}, 'confirms');

const confirmsReducer = (state = new State(), action) => {
  switch (action.type) {
    case actions.ADD_CONFIRM: {
      const { payload: { type, data } } = action;
      return state
        .set('current', type)
        .update('opened', current => current + 1)
        .update('data', map => map.set(type, { open: true, ...data }));
    }
    case actions.HIDE_CONFIRM: {
      const { payload } = action;
      const remaining = state.data.findLast(x => x.open === true && x.type !== payload);

      return state
        .set('current', remaining ? remaining.type : null)
        .update('opened', current => current - 1)
        .update('data', map => map.set(payload, { open: false }));
    }
    default: {
      return state;
    }
  }
};

export default confirmsReducer;
