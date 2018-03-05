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
import moment from 'moment';

const fileSaver = require('file-saver');
const JSZip = require('jszip');

export const CHANGE_FILTER_ITEM = 'CHANGE_FILTER_ITEM';
export const CLEAR = 'CLEAR';
export const FETCH = 'FETCH';
export const FETCH_ERROR = 'FETCH_ERROR';
export const FETCH_START = 'FETCH_START';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const RESET_EXPORT = 'RESET_EXPORT';
export const SELECT = 'SELECT';
export const SELECT_ALL = 'SELECT_ALL_USERS';
export const SELECT_MAP = 'SELECT_MAP';
export const SET_FILTER = 'SET_FILTER';
export const SET_PAGE = 'SET_PAGE';
export const SET_PAGE_LIMIT = 'SET_PAGE_LIMIT';
export const SET_TABLE = 'SET_TABLE';
export const TOGGLE_FILTER = 'TOGGLE_FILTER';
export const TOGGLE_ORDER_BY = 'TOGGLE_ORDER_BY';
export const SAVE_AS = 'SAVE_AS';
export const SAVE_AS_SUCCESS = 'SAVE_AS_SUCCESS';

export const setTable = (type, filter) => ({
  type: SET_TABLE,
  payload: {
    type,
    filter,
  },
});

export const fetch = (promise, tableType) => ({
  type: FETCH,
  payload: promise,
  originalObject: { tableType },
});

export const setFilter = (filter) => ({
  type: SET_FILTER,
  payload: {
    filter,
  },
});

export const setPage = (page) => ({
  type: SET_PAGE,
  payload: {
    page,
  },
});

export const select = (payload, fromMap) => ({
  type: (fromMap && SELECT_MAP) || SELECT,
  payload,
});

export const selectAll = () => ({
  type: SELECT_ALL,
});

export const clear = () => ({
  type: CLEAR,
});

export const toggleFilter = () => ({
  type: TOGGLE_FILTER,
});

export const toggleOrderBy = (key) => ({
  type: TOGGLE_ORDER_BY,
  payload: {
    key,
  },
});

export const setPageLimit = (limit) => ({
  type: SET_PAGE_LIMIT,
  payload: {
    limit,
  },
});

export const changeFilterItem = (itemName, value) => ({
  type: CHANGE_FILTER_ITEM,
  payload: {
    itemName,
    value,
  },
});

export const resetExport = () => ({
  type: RESET_EXPORT,
});

const parse = (data, attributesNeeded, Model) => {
  const header = attributesNeeded.join(';');
  const content = data.map(x => {
    const item = new Model(x).toExport(attributesNeeded);
    return Object.keys(item).reduce((prev, current) => prev.concat(`"${item[current] === null || item[current] === undefined ? '' : item[current]}"`), []).join(';');
  }).join('\n');

  return `\ufeff${header}\n${content}`;
};

export const saveAs = (data, attributesNeeded) => ({ getState }) => {
  const { model, type } = getState().table;
  const getType = () => {
    switch (type) {
      case 'TABLE_TYPE_TRASH':
        return 'trash_points';
      case 'TABLE_TYPE_COLLECTION_POINT':
        return 'collection_points';
      case 'TABLE_TYPE_USER':
        return 'users';
      default:
        return '';
    }
  };

  const promise = async () => {
    const date = moment().format('YYYY-MM-DD');
    const time = moment().format('HH-mm');
    const archive = new JSZip();
    data.map((x, key) => archive.file(`${date}_${key}.csv`, parse(x, attributesNeeded, model)));
    archive.generateAsync({ type: 'blob' }).then((content) => fileSaver.saveAs(content, `${getType()}_trashout_export_${date}_${time}.zip`));
  };
  return ({
    type: SAVE_AS,
    payload: promise(),
  });
};
