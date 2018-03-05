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
import Filter from './filter';
import Trash from '../models/trash';
import { Cluster, toForm } from './trash';
import { FIREBASE_GET_FILE } from '../lib/redux-firebase/actions';
import { Map } from 'immutable';
import { Record } from '../transit';

const State = Record({
  showFilter: false,
  selectedTab: 'table',
  count: 0,
  filter: new Filter(),
  isFetching: true,
  isSending: false,
  item: new Trash(),
  userRelation: '',
  itemForm: null,
  map: Map(),
  cluster: Map(),
  clusterBetter: Map(),
}, 'trashes');

const trashReducer = (state = new State(), action) => {
  switch (action.type) {
    case (FIREBASE_GET_FILE): {
      return state;
    }

    case actions.FETCH_TRASH_CLUSTER_START:
    case actions.REQUEST_CLUSTER:
    case actions.FETCH_TRASH_LIST:
    case actions.FETCH_DETAIL_START: {
      const { clearLastItem } = ((action.meta || {}).action || {}).meta || {};
      const nextState = state.set('isFetching', true);
      if (!clearLastItem) {
        return nextState.set('item', new Trash());
      }
      return nextState;
    }

    case actions.CREATE_TRASH_START: {
      return state.set('isSending', true);
    }

    case actions.CREATE_TRASH_ERROR:
    case actions.CREATE_TRASH_SUCCESS: {
      return state.set('isSending', false);
    }

    case actions.FETCH_TRASH_CLUSTER_ERROR: {
      return state.set('isFetching', false);
    }
    case actions.FETCH_TRASH_CLUSTER_SUCCESS: {
      const { zoom, geocells } = action.originalObject;
      const emptyCluster = geocells.reduce((pre, current) =>
        pre.set(current, new Cluster()), Map());

      const cluster = action.payload.reduce((pre, current) => {
        current.lng = current.long;
        return pre.set(current.geocell, new Cluster(current));
      }, Map());

      return state
        .updateIn(['cluster', zoom], (c) => emptyCluster.merge(cluster).merge(c))
        .set('isFetching', false);
    }

    case actions.FETCH_DETAIL_SUCCESS: {
      const trash = new Trash(action.payload);

      return state
        .set('item', trash)
        .set('itemForm', toForm(action.payload))
        .set('userRelation', {
          canDelete: false,
        })
        .set('isFetching', false);
    }

    case actions.RECEIVE_TRASH_LIST_COUNT: {
      return state.set('count', action.payload.count);
    }

    case actions.TOGGLE_FILTER_TRASH_LIST: {
      return state.updateIn(['showFilter'], value => !value);
    }

    case actions.SET_ITEMS_PER_PAGE: {
      const { limit } = action.payload;
      return state
        .updateIn(['filter', 'limit'], () => limit)
        .updateIn(['filter', 'page'], () => 1);
    }

    case actions.SET_DATA_TAB: {
      if (state.get('selectedTab') === action.payload.value) return state;
      return state.set('selectedTab', action.payload.value);
    }


    default:
      return state;
  }
};

export default trashReducer;
