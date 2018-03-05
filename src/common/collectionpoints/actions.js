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
import * as api from '../api/collectionPoint';
import _ from 'lodash';
import CollectionPoint from '../models/collectionPoint';
import { attributes as exportAttributes } from './consts';
import { exportToCsv } from '../export/actions';
import { fetch } from '../table/actions';
import { getSpams } from '../api/spam';
import { getUser } from '../api/users';
import { uploadFiles } from '../api/firebase';

export const CREATE_COLLECTION_POINT = 'CREATE_COLLECTION_POINT';
export const CREATE_COLLECTION_POINT_ERROR = 'CREATE_COLLECTION_POINT_ERROR';
export const CREATE_COLLECTION_POINT_SUCCESS = 'CREATE_COLLECTION_POINT_SUCCESS';
export const FETCH_COLLECTION_POINT_DETAIL = 'FETCH_COLLECTION_POINT_DETAIL';
export const FETCH_COLLECTION_POINT_LIST = 'FETCH_COLLECTION_POINT_LIST';
export const FETCH_COLLECTION_POINT_LIST_ERROR = 'FETCH_COLLECTION_POINT_LIST_ERROR';
export const FETCH_COLLECTION_POINT_LIST_START = 'FETCH_COLLECTION_POINT_LIST_START';
export const FETCH_COLLECTION_POINT_LIST_SUCCESS = 'FETCH_COLLECTION_POINT_LIST_SUCCESS';
export const FETCH_COLLECTION_POINT_DETAIL_START = 'FETCH_COLLECTION_POINT_DETAIL_START';
export const FETCH_COLLECTION_POINT_DETAIL_ERROR = 'FETCH_COLLECTION_POINT_DETAIL_ERROR';
export const FETCH_COLLECTION_POINT_DETAIL_SUCCESS = 'FETCH_COLLECTION_POINT_DETAIL_SUCCESS';
export const FORM_COLLECTION_POINT_REMOVE_IMAGE = 'FORM_COLLECTION_POINT_REMOVE_IMAGE';
export const MARK_COLLECTION_POINT_AS_SPAM = 'MARK_COLLECTION_POINT_AS_SPAM';
export const REMOVE_COLLECTION_POINT = 'REMOVE_COLLECTION_POINT';
export const REMOVE_COLLECTION_POINT_START = 'REMOVE_COLLECTION_POINT_START';
export const REMOVE_COLLECTION_POINT_SUCCESS = 'REMOVE_COLLECTION_POINT_SUCCESS';
export const SET_COLLECTION_POINT_DATA_TAB = 'SET_DATA_TAB';
export const UPDATE_COLLECTION_POINT = 'UPDATE_COLLECTION_POINT';
export const UPDATE_COLLECTION_POINT_ERROR = 'UPDATE_COLLECTION_POINT_ERROR';
export const UPDATE_COLLECTION_POINT_SUCCESS = 'UPDATE_COLLECTION_POINT_SUCCESS';
export const REMOVE_ACTIVITY_IMAGE = 'REMOVE_ACTIVITY_IMAGE';
export const REMOVE_ACTIVITY_IMAGE_START = 'REMOVE_ACTIVITY_IMAGE_START';
export const REMOVE_ACTIVITY_IMAGE_ERROR = 'REMOVE_ACTIVITY_IMAGE_ERROR';
export const REMOVE_ACTIVITY_IMAGE_SUCCESS = 'REMOVE_ACTIVITY_IMAGE_SUCCESS';

const send = async (cp, trashFunc, dispatch, token) => {
  if (cp.images) {
    const images = await uploadFiles(cp.images, token);
    if (!images) {
      return Promise.reject(new Error('Error in sending images'));
    }
    cp.images = images;
  }
  return trashFunc(cp, token);
};

export const updateCollectionPoint = (data) =>
  ({ dispatch, token }) => ({
    type: UPDATE_COLLECTION_POINT,
    payload: send(new CollectionPoint(data, true).toUpdate(),
      api.putCollectionPoint, dispatch, token),
    originalObject: data,
    message: 'update-cp',
  });

export const createCollectionPoint = (data) =>
  ({ dispatch, token }) => ({
    type: CREATE_COLLECTION_POINT,
    payload: send(new CollectionPoint(data, true).toCreate(),
      api.postCollectionPoint, dispatch, token),
    message: 'create-cp',
  });

export const fetchDetail = (id, clearLastItem) => ({ token, userRoleId }) => {
  const promise = async () => {
    const cp = await api.getCollectionPoint(id, token);
    if (userRoleId <= 2) {
      const userId = (cp.updateHistory.length > 0)
        ? cp.updateHistory[0].userInfo.userId
        : cp.userInfo.userId;

      cp.userDetail = await getUser(userId, token);
      const { result } = await getSpams({
        type: 'collectionPoint',
        collectionPointIds: id,
      }, token);
      cp.spam = result;
    }
    return cp;
  };

  return {
    type: FETCH_COLLECTION_POINT_DETAIL,
    payload: promise(),
    meta: {
      clearLastItem,
    },
  };
};

export const fetchCollectionPointList = (filter) => ({ getState, dispatch, token }) => {
  if (!filter) filter = getState().table.filter.toFilter();

  const isMap = getState().collectionPoints.selectedTab === 'map';

  if (isMap) {
    delete filter.page;
    delete filter.limit;
    delete filter.lat;
    delete filter.lng;
    const boundsObject = getState().map.bounds;
    if (boundsObject) {
      const bounds = boundsObject.toJSON();
      filter.area = `${bounds.north},${bounds.west},${bounds.south},${bounds.east}`;
    }
  }

  const promise = Promise.all([
    api.getCollectionPoints(filter, token),
    api.getCollectionPointCount(filter, token),
  ]);

  dispatch(fetch(promise, 'TABLE_TYPE_COLLECTION_POINT'));
  return {
    type: FETCH_COLLECTION_POINT_LIST,
  };
};

export const setDataTab = (value) => ({
  type: SET_COLLECTION_POINT_DATA_TAB,
  payload: {
    value,
  },
});

export const markAsSpam = (collectionPointActivityId) => ({ token }) => ({
  type: MARK_COLLECTION_POINT_AS_SPAM,
  payload: api.markAsSpam(collectionPointActivityId, token),
  message: 'cp-marked-as-spam',
  useCustomErrorMessage: true,
});

export const removeImage = (id, activityId, imageId) => ({ token }) => ({
  type: REMOVE_ACTIVITY_IMAGE,
  payload: api.removeImage(activityId, imageId, token),
  then: fetchDetail(id),
  message: 'remove-image',
});

export const removeCollectionPoint = (collectionPointId) => ({ token }) => ({
  type: REMOVE_COLLECTION_POINT,
  payload: api.removeCollectionPoint(collectionPointId, token),
  message: 'cp-removed',
});

export const exportCollectionPoints = (attributes, limit) => ({ dispatch }) => {
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
  dispatch(exportToCsv(attributesNeeded(), limit, api.getCollectionPoints, api.getCollectionPointCount, sortedAttributes, 'collectionPointIds'));
  return {
    type: 'EXPORT_COLLECTION_POINTS',
  };
};
