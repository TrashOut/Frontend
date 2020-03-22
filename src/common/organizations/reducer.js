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
import Area from '../models/area';
import Organization from '../models/organization';
import { Record } from '../transit';

const State = Record({
  selectedTab: 'all',
  isFetching: true,
  item: new Organization(),
  userRelation: '',
}, 'organization');

const organizationReducer = (state = new State(), action) => {
  switch (action.type) {
    case actions.FETCH_ORGANIZATION_START: {
      return state
        .set('isFetching', true)
        .set('item', new Organization());
    }

    case actions.FETCH_ORGANIZATION_ERROR: {
      return state
        .set('isFetching', false);
    }

    case actions.FETCH_ORGANIZATION_SUCCESS: {
      return state
        .set('item', new Organization(action.payload[0]))
        .setIn(['item', 'usersCount'], action.payload[1] ? action.payload[1].count : 0)
        .setIn(['item', 'area'], action.payload[2] ? new Area(action.payload[2]) : null)
        .setIn(['item', 'parent'], action.payload[3] ? new Organization(action.payload[3]) : null)
        .setIn(['item', 'statistics'], action.payload[4] ? action.payload[4].stats : null)
        .set('isFetching', false);
    }
    default:
      return state;
  }
};

export default organizationReducer;
