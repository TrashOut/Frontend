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
import Article from '../models/article';
import CollectionPoint from '../models/collectionPoint';
import Event from '../models/event';
import Organization from '../models/organization';
import Spam from '../models/spam';
import Trash from '../models/trash';
import User from '../models/user';
import { OrderedMap } from 'immutable';
import { Record } from '../transit';
import { NoFilter, TrashFilter, UserFilter, ArticleFilter, CollectionPointFilter, EventFilter, SpamFilter, OrganizationFilter } from './filter';

export const TABLE_TYPE_TRASH = 'TABLE_TYPE_TRASH';
export const TABLE_TYPE_USER = 'TABLE_TYPE_USER';
export const TABLE_TYPE_SPAM = 'TABLE_TYPE_SPAM';
export const TABLE_TYPE_COLLECTION_POINT = 'TABLE_TYPE_COLLECTION_POINT';
export const TABLE_TYPE_EVENT = 'TABLE_TYPE_EVENT';
export const TABLE_TYPE_ORGANIZATION = 'TABLE_TYPE_ORGANIZATION';
export const TABLE_TYPE_ARTICLE = 'TABLE_TYPE_ARTICLE';

const State = Record({
  model: null,
  count: 0,
  filter: new NoFilter(),
  selectAll: false,
  isFetching: true,
  showFilter: false,
  map: OrderedMap(),
  type: null,
  export: [],
  exportPromise: null,
  exportCurrentNumber: 0,
  exportCount: 0,
  exportFinished: false,
}, 'table');

const tableReducer = (state = new State(), action) => {
  switch (action.type) {
    case actions.SET_TABLE: {
      const { type, filter } = action.payload;
      if (state.type === type && !filter) return state;

      if (type === TABLE_TYPE_TRASH) {
        state = state
        .set('filter', new TrashFilter(filter))
        .set('model', Trash);
      }
      if (type === TABLE_TYPE_USER) {
        state = state
        .set('filter', new UserFilter(filter))
        .set('model', User);
      }
      if (type === TABLE_TYPE_SPAM) {
        state = state
        .set('filter', new SpamFilter(filter))
        .set('model', Spam);
      }
      if (type === TABLE_TYPE_COLLECTION_POINT) {
        state = state
        .set('filter', new CollectionPointFilter(filter))
        .set('model', CollectionPoint);
      }
      if (type === TABLE_TYPE_EVENT) {
        state = state
        .set('filter', new EventFilter(filter))
        .set('model', Event);
      }
      if (type === TABLE_TYPE_ORGANIZATION) {
        state = state
        .set('filter', new OrganizationFilter(filter))
        .set('model', Organization);
      }
      if (type === TABLE_TYPE_ARTICLE) {
        state = state
        .set('filter', new ArticleFilter(filter))
        .set('model', Article);
      }
      return state
        .set('type', type)
        .set('map', OrderedMap())
        .set('showFilter', false);
    }

    case actions.FETCH_START: {
      return state.set('isFetching', true);
    }

    case actions.FETCH_ERROR: {
      return state.set('isFetching', false);
    }

    case actions.FETCH_SUCCESS: {
      const [data, c] = action.payload;
      const { tableType } = action.originalObject;

      if (tableType && tableType !== state.type) return state;

      let map = null;
      let count = 0;
      if (state.type === TABLE_TYPE_USER) {
        map = data.reduce((pre, current) =>
          pre.set(current.id, new User(current))
        , OrderedMap());
        count = c.count;
      }

      if (state.type === TABLE_TYPE_TRASH) {
        map = data.reduce((pre, current) =>
          pre.set(current.id, new Trash(current))
        , OrderedMap());
        count = c;
      }

      if (state.type === TABLE_TYPE_SPAM) {
        const Model = (state.filter.type === 'unreviewed') ? User : Spam;
        const result = data.result || data;
        map = result && result.reduce((pre, current) =>
          pre.set(current.id || current.trashPointId || current.collectionPointId, new Model(current)), OrderedMap());
        count = c.count;
      }

      if (state.type === TABLE_TYPE_COLLECTION_POINT) {
        map = data && data.reduce((pre, current) =>
          pre.set(current.id, new CollectionPoint(current)), OrderedMap());
        count = c;
      }

      if (state.type === TABLE_TYPE_EVENT) {
        map = data && data.reduce((pre, current) =>
          pre.set(current.id, new Event(current)), OrderedMap());
        count = c;
      }

      if (state.type === TABLE_TYPE_ORGANIZATION) {
        map = data && data.reduce((pre, current) =>
          pre.set(current.id, new Organization(current)), OrderedMap());
        count = c.count;
      }

      if (state.type === TABLE_TYPE_ARTICLE) {
        map = data && data.reduce((pre, current) =>
          pre.set(current.id, new Article(current)), OrderedMap());
        count = c;
      }

      return state
        .set('count', count)
        .set('map', map || OrderedMap())
        .set('isFetching', false);
    }

    case actions.SET_FILTER: {
      const { filter } = action.payload;
      filter.page = 1;
      if (state.type === TABLE_TYPE_USER) {
        return state.set('filter', new UserFilter(filter));
      }
      if (state.type === TABLE_TYPE_TRASH) {
        return state.set('filter', new TrashFilter(filter));
      }
      if (state.type === TABLE_TYPE_SPAM) {
        return state.set('filter', new SpamFilter(filter));
      }
      if (state.type === TABLE_TYPE_COLLECTION_POINT) {
        return state.set('filter', new CollectionPointFilter(filter));
      }
      if (state.type === TABLE_TYPE_EVENT) {
        return state.set('filter', new EventFilter(filter));
      }
      if (state.type === TABLE_TYPE_ORGANIZATION) {
        return state.set('filter', new Organization(filter));
      }
      if (state.type === TABLE_TYPE_ARTICLE) {
        return state.set('filter', new ArticleFilter(filter));
      }
      return state;
    }

    case actions.TOGGLE_FILTER: {
      return state.updateIn(['showFilter'], value => !value);
    }

    case actions.SET_PAGE: {
      return state.updateIn(['filter', 'page'], () => action.payload.page);
    }

    case actions.SELECT: {
      if (action.payload === 'all') {
        const newState = state.update('map', map => map.map((row) => row.update('selected', () => true)));
        return newState;
      }
      if (action.payload === 'none') {
        return state.update('map', map => map.map((row) => row.update('selected', () => false)));
      }

      const data = (state.map.toArray && state.map.toArray()) || state.map;
      return state.updateIn(['map', data[action.payload].id, 'selected'], (selected) => !selected);
    }

    case actions.SELECT_MAP: {
      return state.updateIn(['map', action.payload, 'selected'], (selected) => !selected);
    }

    case actions.SELECT_ALL: {
      return state.update('map', map => map.forEach((row) => row.update('selected', !state.selectAll))).set('selectAll', !state.selectAll);
    }

    case actions.TOGGLE_ORDER_BY: {
      let { key } = action.payload;
      const orderBy = state.filter.orderBy;
      if (!orderBy.startsWith('-') && orderBy === key) {
        key = `-${key}`;
      }
      return state.updateIn(['filter', 'orderBy'], () => key);
    }

    case actions.SET_PAGE_LIMIT: {
      const { limit } = action.payload;
      return state
        .updateIn(['filter', 'limit'], () => limit)
        .updateIn(['filter', 'page'], () => 1);
    }

    case actions.CLEAR: {
      return state.set('map', OrderedMap());
    }

    case actions.CHANGE_FILTER_ITEM: {
      const { itemName, value } = action.payload;
      return state.updateIn(['filter', itemName], () => value);
    }

    case 'EXPORT_TO_CSV_COUNT':
      return state.set('exportCount', action.payload);

    case 'EXPORT_TO_CSV_CHANGE':
      return state.set('exportCurrentNumber', action.payload);

    case 'EXPORT_TO_CSV_START':
      return state
      .set('isFetching', true)
      .set('exportFinished', false);

    case 'EXPORT_TO_CSV_SUCCESS': {
      const { payload } = action;
      let map = null;

      if (state.type === TABLE_TYPE_TRASH) {
        map = payload.map((x) =>
          x.reduce((prev, current) =>
            prev.set(current.id, new Trash(current)),
            OrderedMap()
          )
        );
      }

      return state
        .set('export', map)
        .set('isFetching', false);
    }

    case 'MARK_MULTIPLE_SPAMS_SUCCESS': {
      const { payload } = action;
      return payload
        .toArray()
        .reduce((prev, cur) => prev.updateIn(['map', cur.id, 'selected'], value => !value), state);
    }

    case actions.SAVE_AS_SUCCESS:
    case actions.RESET_EXPORT:
      return state
      .set('export', [])
      .set('exportCount', 0)
      .set('exportCurrentNumber', 0)
      .set('isFetching', false)
      .set('exportFinished', true);

    default: {
      return state;
    }
  }
};

export default tableReducer;
