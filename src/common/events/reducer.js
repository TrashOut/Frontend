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
import { Map } from 'immutable';
import { Record } from '../transit';
import * as actions from './actions';
import Event from '../models/event';
import Trash from '../models/trash';
import CollectionPoint from '../models/collectionPoint';

const State = Record({
  showFilter: false,
  selectedTab: 'table',
  count: 0,
  isFetching: true,
  isSending: false,
  item: new Event(),
  userRelation: '',
  map: Map(),
  formData: {},
  isFetchingFormData: false,
  dumb: true,
}, 'Events');

const eventReducer = (state = new State(), action) => {
  switch (action.type) {
    case (action.type.indexOf('ERROR') >= 0):
      return state.set('isFetching', false);

    case (action.type.indexOf('START') >= 0):
      return state.set('isFetching', true);

    case actions.FETCH_EVENT_START:
      return state
        .set('isFetching', true)
        .set('item', new Event());

    case actions.FETCH_EVENT_SUCCESS: {
      return state
        .set('item', new Event(action.payload.event))
        .setIn(['item', 'users'], action.payload.users)
        .setIn(['item', 'collectionPoints'], action.payload.collectionPoints.map(x => new CollectionPoint(x)))
        .updateIn(['item', 'trashPoints'], trashPoints => trashPoints.map(x => new Trash(x)))
        .set('isFetching', false);
    }
    case actions.SET_EVENT_TAB:
      return state.set('selectedTab', action.payload.value);

    case actions.FETCH_DATA_FOR_FORM_START:
    case actions.FETCH_DATA_FOR_FORM_BY_IDS_START:
      return state.set('isFetchingFormData', true);

    case actions.FETCH_DATA_FOR_FORM_ERROR:
    case actions.FETCH_DATA_FOR_FORM_BY_IDS_ERROR:
      return state.set('isFetchingFormData', false);

    case actions.FETCH_DATA_FOR_FORM_BY_IDS_SUCCESS:
    case actions.FETCH_DATA_FOR_FORM_SUCCESS: {
      const data = action.payload;
      const trashes = data && data[0] &&
        data[0].reduce((prev, cur) => {
          const trash = new Trash(cur);
          return prev.set(cur.id, trash);
        }, Map());
      const collectionPoints = data && data[1] &&
        data[1].reduce((prev, cur) => prev.set(cur.id, new CollectionPoint(cur)), Map());
      return state.set('formData', { trashes, collectionPoints }).set('isFetchingFormData', false);
    }
    case actions.CLEAN_DATA_FOR_FORM: {
      return state.set('formData', { trashes: [], collectionPoints: [] });
    }
    case actions.TOGGLE_LOCATION: {
      return state.update('dumb', (v) => !v);
    }
    default:
      return state;
  }
};

export default eventReducer;
