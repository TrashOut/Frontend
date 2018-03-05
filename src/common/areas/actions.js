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
import * as api from '../api/areas';
import * as userApi from '../api/users';
import routesList from '../../browser/routesList';
import { fetchMe } from '../users/actions';
import { push } from 'react-router-redux';

export const ROLES = {
  admin: 1,
  manager: 2,
  user: 3,
};

export const FETCH_AREA = 'FETCH_AREA';
export const FETCH_AREA_ERROR = 'FETCH_AREA_ERROR';
export const FETCH_AREA_START = 'FETCH_AREA_START';
export const FETCH_AREA_SUCCESS = 'FETCH_AREA_SUCCESS';

export const FETCH_AREA_LIST = 'FETCH_AREA_LIST';
export const FETCH_AREA_LIST_ERROR = 'FETCH_AREA_LIST_ERROR';
export const FETCH_AREA_LIST_START = 'FETCH_AREA_LIST_START';
export const FETCH_AREA_LIST_SUCCESS = 'FETCH_AREA_LIST_SUCCESS';

export const SET_ROOT = 'SET_ROOT';
export const SET_ROOT_ERROR = 'SET_ROOT_ERROR';
export const SET_ROOT_START = 'SET_ROOT_START';
export const SET_ROOT_SUCCESS = 'SET_ROOT_SUCCESS';

export const CLEAR_AREA = 'CLEAR_AREA';
export const SET_DATA_TAB = 'SET_EVENT_DATA_TAB';

export const ADD_MANAGER = 'ADD_MANAGER';
export const ADD_MANAGER_ERROR = 'ADD_MANAGER_ERROR';
export const ADD_MANAGER_START = 'ADD_MANAGER_START';
export const ADD_MANAGER_SUCCESS = 'ADD_MANAGER_SUCCESS';

export const fetchArea = (id) => ({ token }) => ({
  type: 'FETCH_AREA',
  payload: Promise.all([
    api.getArea(id, token),
    api.getAliasesForArea(id, token),
    userApi.getUsers({ areaIds: id }, token),
  ]),
});

export const fetchAreaFromForm = (values) => ({ getState, dispatch }) => {
  const items = getState().areas.formOptions;
  const array = Object.keys(values);

  for (let i = array.length - 1; i >= 0; i -= 1) {
    const index = array[i];
    if (values[index] !== 'all' && values[index] !== '') {
      const result = items.get(index).filter(x => x.label === values[index]);
      if (result.length > 0) {
        // dispatch(fetchArea(result[0].pathId));
        dispatch(push(routesList.areaDetail.replace(':id', result[0].pathId)));
        return { type: 'FETCH_AREA_FROM_FORM' };
      }
    }
  }
  return { type: 'FETCH_AREA_FROM_FORM_INVALID' };
};

export const fetchAreaList = (filter) => ({ token }) => {
  const fetchAll = filter === 'all';
  if (fetchAll) {
    filter.page = 1;
    filter.limit = 99999;
  }
  const promise = async (f) => {
    const result = await api.getAreaList(f, token);

    return {
      list: result,
      type: f.type,
    };
  };
  return {
    type: 'FETCH_AREA_LIST',
    payload: promise(filter),
    originalObject: {
      filterType: filter.type,
    },
  };
};

export const clearAreaItem = () => ({
  type: 'CLEAR_AREA',
});

export const setRoot = (areaId, rootId) => ({ token }) => ({
  type: 'SET_ROOT',
  payload: api.putArea(areaId, rootId, token),
  message: 'area-root-set',
  then: fetchArea(rootId),
  originalObject: {
    id: rootId,
  },
});

export const unsetRoot = (areaId, rootId) => ({ token }) => ({
  type: 'UNSET_ROOT',
  payload: api.removeAlias(areaId, token),
  message: 'area-root-unset',
  then: fetchArea(rootId),
  originalObject: {
    id: rootId,
  },
});

export const setDataTab = (payload) => ({
  type: SET_DATA_TAB,
  payload,
});

export const addUser = (userIds, areaId, role) => ({ token }) => {
  let users = [];
  if (!Array.isArray(userIds)) users.push(userIds);
  else users = users.concat(userIds);

  const promise = () => {
    const promiseArray = users.reduce((prev, cur) => {
      const item = userApi.postUserArea(cur, areaId, role, false, token);
      prev.push(item);
      return prev;
    }, []);
    return Promise.all(promiseArray);
  };

  return {
    type: ADD_MANAGER,
    payload: promise(),
    message: 'add-manager',
    originalObject: {
      id: areaId,
    },
    then: fetchArea(areaId),
  };
};

export const assignManagers = (users, oldUsers, areaId, roleId = '1', frequency = '3600', cb, type = 'add') => ({ token }) => {
  if (!Array.isArray(users)) return { type: 'ASSIGN_MANAGER_USER_NOT_SELECTED' };
  // If there is an user in area as a member, we call PUT otherway we use POST request
  const promise = () => {
    const innerPromise = (func, isNew) =>
      users.filter(x =>
        isNew
        ? oldUsers.indexOf(x) === -1
        : oldUsers.indexOf(x) !== -1).reduce((prev, cur) => {
          const item = func(cur, areaId, roleId, frequency, token);
          prev.push(item);
          return prev;
        }, []);

    return Promise.all([
      ...innerPromise(userApi.postUserArea, true),
      ...innerPromise(userApi.putUserArea, false)]
    );
  };

  return {
    type: ADD_MANAGER,
    payload: promise(),
    message: `${type}-manager`,
    originalObject: {
      id: areaId,
    },
    thenPromise: cb || null,
    then: !cb ? fetchArea(areaId) : null,
  };
};

export const removeArea = (areaId) => ({ userId, token }) => ({
  type: 'USER_REMOVE_AREA',
  payload: userApi.deleteUserArea(userId, areaId, token),
  message: 'remove-user-area',
  then: fetchMe(),
});

export const assignArea = (areaId, frequency = 3600, roleId = '3') => ({ token, userId }) => ({
  type: 'ADD_USER_TO_AREA',
  payload: userApi.postUserArea(userId, areaId, roleId, frequency, token),
  message: 'add-user-to-area',
  then: fetchMe(),
});

export const updateUserArea = (areaId, frequency = 3600, roleId = '3') => ({ token, userId }) => ({
  type: ADD_MANAGER,
  payload: userApi.putUserArea(userId, areaId, roleId, frequency, token),
  message: 'edit-user-area',
  then: fetchMe(),
});
