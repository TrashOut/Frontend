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
import { FIREBASE_GET_FILE } from '../lib/redux-firebase/actions';
import CollectionPoint from '../models/collectionPoint';

const State = Record({
  showFilter: false,
  selectedTab: 'table',
  count: 0,
  isFetching: true,
  isSending: false,
  item: new CollectionPoint(),
  itemForm: null,
  map: Map(),
}, 'collectionPoints');

const collectionPointReducer = (state = new State(), action) => {
  switch (action.type) {
    case (FIREBASE_GET_FILE): {
      return state;
    }

    case actions.FETCH_COLLECTION_POINT_DETAIL:
    case actions.FETCH_COLLECTION_POINT_DETAIL_START: {
      const { clearLastItem } = ((action.meta || {}).action || {}).meta || {};
      const nextState = state.set('isFetching', true);
      if (!clearLastItem) {
        return nextState.set('item', new CollectionPoint());
      }
      return nextState;
    }

    case actions.FETCH_COLLECTION_POINT_DETAIL_ERROR: {
      return state.set('isFetching', false);
    }

    case actions.UPDATE_COLLECTION_POINT_START:
    case actions.CREATE_COLLECTION_POINT_START: {
      return state.set('isSending', true);
    }

    case actions.CREATE_COLLECTION_POINT_ERROR:
    case actions.CREATE_COLLECTION_POINT_SUCCESS: {
      return state.set('isSending', false);
    }

    case actions.FETCH_COLLECTION_POINT_DETAIL_SUCCESS: {
      const collectionPoint = new CollectionPoint(action.payload);
      return state
        .set('item', collectionPoint)
        .set('itemForm', collectionPoint.toForm())
        .set('isFetching', false);
    }

    case actions.SET_COLLECTION_POINT_DATA_TAB: {
      return state.set('selectedTab', action.payload.value);
    }

    default:
      return state;
  }
};

export default collectionPointReducer;
