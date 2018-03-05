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
import _ from 'lodash';
import { Record } from '../transit';
import { Map } from 'immutable';
import Area from '../models/area';
import * as actions from './actions';

const State = Record({
  selectedTab: null,
  isFetching: false,
  isAreaFetching: false,
  item: new Area(),
  userRelation: '',
  count: 0,
  formOptions: Map({
    continent: [],
    country: [],
    aa1: [],
    aa2: [],
    aa3: [],
    locality: [],
    subLocality: [],
    street: [],
    zip: [],
  }),
}, 'area');


const areaReducer = (state = new State(), action) => {
  switch (action.type) {
    case actions.FETCH_AREA_LIST_START:
      return state.set('isFetching', true);
    case actions.FETCH_AREA_START:
      return state.set('isAreaFetching', true);

    case actions.FETCH_AREA_SUCCESS: {
      const users = action.payload[2].reduce((prev, user) => {
        const data = _.filter(user.areas, { id: action.payload[0].id })[0];
        if (data) user.areaRoleId = parseInt(data.roleId, 10);
        prev.push(user);
        return prev;
      }, []);

      return state
        .set('item', new Area(action.payload[0]))
        .setIn(['item', 'aliases'], action.payload[1])
        .setIn(['item', 'users'], users)
        .set('isAreaFetching', false);
    }

    case actions.FETCH_AREA_LIST_SUCCESS: {
      const { list, count } = action.payload;
      const { filterType } = action.originalObject;

      const items = list.reduce((prev, cur) =>
        prev.concat({
          id: cur[filterType],
          label: cur[filterType],
          pathId: cur.id,
        }),
        []
      );

      return state
      .setIn(['formOptions', filterType], items)
      .set('count', count)
      .set('isFetching', false);
    }

    case actions.CLEAR_AREA: {
      return state.set('item', null);
    }

    case actions.SET_DATA_TAB: {
      return state.set('selectedTab', action.payload);
    }

    default:
      return state;
  }
};

export default areaReducer;
