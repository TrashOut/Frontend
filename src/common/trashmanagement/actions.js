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
import * as api from '../api/trashes';
import _ from 'lodash';
import Trash from '../models/trash';
import { attributes as exportAttributes } from './consts';
import { destroy } from 'redux-form';
import { exportToCsv } from '../export/actions';
import { fetch } from '../table/actions';
import { getSpams } from '../api/spam';
import { getUser } from '../api/users';
import { uploadFiles } from '../api/firebase';

export const CREATE_TRASH = 'CREATE_TRASH';
export const CREATE_TRASH_ERROR = 'CREATE_TRASH_ERROR';
export const CREATE_TRASH_SUCCESS = 'CREATE_TRASH_SUCCESS';
export const FETCH_DETAIL = 'FETCH_DETAIL';
export const FETCH_DETAIL_START = 'FETCH_DETAIL_START';
export const FETCH_DETAIL_SUCCESS = 'FETCH_DETAIL_SUCCESS';
export const FETCH_TRASH_CLUSTER = 'FETCH_TRASH_CLUSTER';
export const FETCH_TRASH_CLUSTER_SUCCESS = 'FETCH_TRASH_CLUSTER_SUCCESS';
export const FETCH_TRASH_LIST = 'FETCH_TRASH_LIST';
export const FETCH_TRASH_LIST_START = 'FETCH_TRASH_LIST_START';
export const FETCH_TRASH_LIST_ERROR = 'FETCH_TRASH_LIST_ERROR';
export const FETCH_TRASH_LIST_SUCCESS = 'FETCH_TRASH_LIST_SUCCESS';
export const FETCH_TRASH_CLUSTER_START = 'FETCH_TRASH_CLUSTER_START';
export const FORM_REMOVE_IMAGE = 'FORM_REMOVE_IMAGE';
export const RECEIVE_DETAIL = 'RECEIVE_DETAIL';
export const RECEIVE_TRASH_LIST_COUNT = 'RECEIVE_TRASH_LIST_COUNT';
export const REQUEST_DETAIL = 'REQUEST_DETAIL';
export const SET_DATA_TAB = 'SET_DATA_TAB_TRASH';
export const SET_FILTER = 'SET_FILTER';
export const SET_ITEMS_PER_PAGE = 'SET_ITEMS_PER_PAGE';
export const SET_PAGE = 'SET_PAGE';
export const TOGGLE_FILTER_TRASH_LIST = 'TOGGLE_FILTER_TRASH_LIST';
export const TOGGLE_ORDER_BY = 'TOGGLE_ORDER_BY';
export const TRASH_SELECT = 'TRASH_SELECT';
export const TRASH_SELECT_ALL = 'TRASH_SELECT_ALL';
export const REMOVE_ACTIVITY = 'REMOVE_ACTIVITY';
export const CREATE_COMMENT = 'CREATE_COMMENT';
export const REMOVE_COMMENT = 'REMOVE_COMMENT';
export const REMOVE_ACTIVITY_IMAGE = 'REMOVE_ACTIVITY_IMAGE';
export const MARK_AS_SPAM = 'MARK_AS_SPAM';
export const REMOVE_TRASH = 'REMOVE_TRASH';
export const REMOVE_TRASH_START = 'REMOVE_TRASH_START';
export const REMOVE_TRASH_SUCCESS = 'REMOVE_TRASH_SUCCESS';
export const CLEAR_CACHE = 'CLEAR_CACHE';

const sendTrash = async (trash, trashFunc, dispatch, token) => {
  if (trash.images) {
    const images = await uploadFiles(trash.images, token);
    trash.images = images;
  }
  return trashFunc(trash, token);
};

export const updateTrash = (trash) => ({ dispatch, token }) => ({
  type: 'UPDATE_TRASH',
  payload: sendTrash(
    new Trash(trash).toUpdate(),
    api.putTrash,
    dispatch,
    token
  ),
  originalObject: trash,
  message: 'update-trash',
  then: destroy('trashForm'),
});

export const createTrash = (trash) => ({ dispatch, token }) => ({
  type: 'CREATE_TRASH',
  payload: sendTrash(
    new Trash(trash).toCreate(),
    api.postTrash,
    dispatch,
    token
  ),
  message: 'create-trash',
  then: destroy('trashForm'),
});

export const fetchDetail = (id, clearLastItem) => ({ token, userRoleId }) => {
  const promise = async () => {
    const trash = await api.getTrash(id, token);
    if (userRoleId <= 2) {
      const userId = (trash.updateHistory.length > 0)
        ? trash.updateHistory[0].userInfo.userId
        : trash.userInfo.userId;

      trash.userDetail = await getUser(userId, token);
      const { result } = await getSpams({
        type: 'trash',
        trashIds: id,
      }, token);
      trash.spam = result;
    }
    return trash;
  };

  return {
    type: FETCH_DETAIL,
    payload: promise(),
    meta: {
      clearLastItem,
    },
  };
};

export const removeActivity = (id, activityId) => ({ token }) => ({
  type: REMOVE_ACTIVITY,
  payload: api.removeActivity(activityId, token),
  then: fetchDetail(id),
  message: 'remove-activity',
});

export const createComment = (trashId, data) => ({ token }) => ({
  type: CREATE_COMMENT,
  payload: api.postComment(trashId, data, token),
  message: 'create-comment',
  then: destroy('commentForm'),
});

export const removeComment = (id, commentId) => ({ token }) => ({
  type: REMOVE_COMMENT,
  payload: api.removeComment(id, commentId, token),
  then: fetchDetail(id),
  message: 'remove-comment',
});

export const removeImage = (id, activityId, imageId) => ({ token }) => ({
  type: REMOVE_ACTIVITY_IMAGE,
  payload: api.removeActivityImage(activityId, imageId, token),
  then: fetchDetail(id),
  message: 'remove-image',
});

export const fetchTrashList = (filter) => ({ getState, dispatch, token }) => {
  if (!filter) filter = getState().table.filter.toFilter();
  const promise = Promise.map([
    api.getTrashes,
    api.getTrashesCount,
  ], (func) => func(filter, token));
  dispatch(fetch(promise, 'TABLE_TYPE_TRASH'));
  return {
    type: FETCH_TRASH_LIST,
  };
};

export const fetchTrashCluster = (map) => ({ getState, token, dispatch }) => {
  const filter = getState()
    .table
    .filter
    .toFilter();

  const zoom = getState().map.zoom;
  const geocells = getState().map.geocell;
  const bounds = (!map) ? getState().map.map.getBounds().toJSON() : map.getBounds().toJSON();

  if (zoom > 9) {
    filter.area = `${bounds.north},${bounds.west},${bounds.south},${bounds.east}`;
    return dispatch(fetchTrashList({
      area: filter.area,
      attributesNeeded: filter.attributesNeeded,
    }));
  }

  const myGeocells = [];
  if (geocells) {
    const zoomLevel = getState().trashes.cluster.get(zoom);
    geocells.forEach(x => {
      let shouldUpdate = true;
      if (zoomLevel && zoomLevel.get(x)) {
        shouldUpdate = false;
        const nextTime = new Date(zoomLevel.get(x).created.getTime() + (5 * 60 * 1000));
        const currentTime = new Date();
        if (nextTime < currentTime) shouldUpdate = true;
      }
      if (!zoomLevel || !zoomLevel.get(x) || shouldUpdate) myGeocells.push(x);
    });
  }

  if (myGeocells.length === 0) {
    return {
      type: 'FETCH_TRASH_CLUSTER_ERROR',
      payload: [],
    };
  }
  const promise = api.getZoomPoint(zoom, myGeocells, filter, token);
  return {
    type: 'FETCH_TRASH_CLUSTER',
    payload: promise,
    originalObject: { zoom, geocells: myGeocells },
  };
};

export const setDataTab = (value) => ({
  type: SET_DATA_TAB,
  payload: {
    value,
  },
});

export const markMultipleSpams = (items) => ({ token }) => {
  const promise = async () => {
    items.toArray().map(async item => {
      try {
        return await api.markAsSpam(item.activityId, token);
      } catch (e) {
        return true;
      }
    });
    return items;
  };

  return {
    type: 'MARK_MULTIPLE_SPAMS',
    payload: promise(),
    message: 'marked-as-spam',
  };
};

export const markAsSpam = (id, trashPointActivityId) => ({ token }) => ({
  type: MARK_AS_SPAM,
  payload: api.markAsSpam(trashPointActivityId, token),
  then: fetchDetail(id),
  message: 'marked-as-spam',
  useCustomErrorMessage: true,
});

export const removeTrash = (trashId) => ({ token }) => ({
  type: REMOVE_TRASH,
  payload: api.removeTrash(trashId, token),
  message: 'trash-removed',
});

export const exportTrashes = (attributes, limit) => ({ dispatch }) => {
  const attributesNeeded = () => {
    const result = [...attributes];
    if (
         _.includes(result, 'latitude')
      || _.includes(result, 'longitude')
      || _.includes(result, 'aa1')
      || _.includes(result, 'aa2')
      || _.includes(result, 'aa3')
      || _.includes(result, 'country')
      || _.includes(result, 'continent')
      || _.includes(result, 'locality')
      || _.includes(result, 'subLocality')
    ) {
      result.push('gpsFull');
      _.remove(result, x =>
           x === 'latitude'
        || x === 'longitude'
        || x === 'aa1'
        || x === 'aa2'
        || x === 'aa3'
        || x === 'country'
        || x === 'continent'
        || x === 'locality'
        || x === 'subLocality'
      );
    }

    if (_.includes(result, 'image')) {
      result.push('images');
      _.remove(result, x => x === 'image');
    }

    return result;
  };

  const sortedAttributes = Object.keys(exportAttributes).map(x => attributes.indexOf(x) > -1 ? x : null).filter(x => x);
  dispatch(exportToCsv(attributesNeeded(), limit, api.getTrashes, api.getTrashesCount, sortedAttributes, 'trashIds'));
  return {
    type: 'EXPORT_TRASHES',
  };
};

