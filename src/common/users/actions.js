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
import User from '../models/user';
import { attributes as exportAttributes } from './consts';
import { change } from 'redux-form';
import { deleteUser, getUserEvents, getApiKey, putApiKey, postApiKey, getMe, getUsers, getUsersCount, getUsersForManager, getUser, getUserActivity, getReviewActivity, editUser, getAreaUsers } from '../api/users';
import { EventFilter, TrashFilter } from '../table/filter';
import { exportToCsv } from '../export/actions';
import { fetch } from '../table/actions';
import { getEvents } from '../api/event';
import { getTrashes } from '../api/trashes';
import { removeUser, changeEmail as firebaseChangeEmail } from '../lib/redux-firebase/actions';
import { uploadFile } from '../api/firebase';

export const CONFIRM_SIGN_IN = 'CONFIRM_SIGN_IN';
export const FETCH_AREA_USERS = 'FETCH_AREA_USERS';
export const FETCH_AREA_USERS_ERROR = 'FETCH_AREA_USERS_ERROR';
export const FETCH_AREA_USERS_START = 'FETCH_AREA_USERS_START';
export const FETCH_AREA_USERS_SUCCESS = 'FETCH_AREA_USERS_SUCCESS';
export const FETCH_ME = 'FETCH_ME';
export const FETCH_ME_ERROR = 'FETCH_ME_ERROR';
export const FETCH_ME_START = 'FETCH_ME_START';
export const FETCH_ME_SUCCESS = 'FETCH_ME_SUCCESS';
export const FETCH_USER_DETAIL = 'FETCH_USER_DETAIL';
export const FETCH_USER_DETAIL_ERROR = 'FETCH_USER_DETAIL_ERROR';
export const FETCH_USER_DETAIL_START = 'FETCH_USER_DETAIL_START';
export const FETCH_USER_DETAIL_SUCCESS = 'FETCH_USER_DETAIL_SUCCESS';
export const FETCH_USERS = 'FETCH_USERS';
export const FETCH_USERS_ERROR = 'FETCH_USERS_ERROR';
export const FETCH_USERS_START = 'FETCH_USERS_START';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const ON_USERS_PRESENCE = 'ON_USERS_PRESENCE';
export const SELECT_ALL_USERS = 'SELECT_ALL_USERS';
export const SELECT_USER = 'SELECT_USER';
export const SET_PAGE = 'SET_PAGE';
export const SET_PAGE_LIMIT = 'SET_PAGE_LIMIT';
export const SWITCH_TO_ONLINE = 'SWITCH_TO_ADMIN';
export const TOGGLE_FILTER = 'TOGGLE_FILTER';
export const TOGGLE_ORDER_BY = 'TOGGLE_ORDER_BY';
export const UPDATE_USER = 'UPDATE_USER';
export const UPDATE_USER_ERROR = 'UPDATE_USER_ERROR';
export const UPDATE_USER_START = 'UPDATE_USER_START';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const GENERATE_API_KEY = 'GENERATE_API_KEY';
export const GENERATE_API_KEY_START = 'GENERATE_API_KEY_START';
export const GENERATE_API_KEY_SUCCESS = 'GENERATE_API_KEY_SUCCESS';
export const GENERATE_API_KEY_ERROR = 'GENERATE_API_KEY_ERROR';
export const FETCH_ME_EVENTS = 'FETCH_ME_EVENTS';
export const FETCH_ME_EVENTS_START = 'FETCH_ME_EVENTS_START';
export const FETCH_ME_EVENTS_SUCCESS = 'FETCH_ME_EVENTS_SUCCESS';
export const FETCH_ME_EVENTS_ERROR = 'FETCH_ME_EVENTS_ERROR';
export const GET_API_KEY = 'GET_API_KEY';
export const GET_API_KEY_START = 'GET_API_KEY_START';
export const GET_API_KEY_SUCCESS = 'GET_API_KEY_SUCCESS';
export const GET_API_KEY_ERROR = 'GET_API_KEY_ERROR';
export const REGENERATE_API_KEY = 'REGENERATE_API_KEY';
export const REGENERATE_API_KEY_START = 'REGENERATE_API_KEY_START';
export const REGENERATE_API_KEY_SUCCESS = 'REGENERATE_API_KEY_SUCCESS';
export const REGENERATE_API_KEY_ERROR = 'REGENERATE_API_KEY_ERROR';

export const onUsersPresence = (snap: Object) => {
  const presence = snap.val();
  return {
    type: ON_USERS_PRESENCE,
    payload: { presence },
  };
};

export const switchToAdmin = () => ({
  type: SWITCH_TO_ONLINE,
});

export const confirmSignIn = () => ({
  type: CONFIRM_SIGN_IN,
});

export const removeUserPhoto = (user) => ({ token }) => ({
  type: 'REMOVE_USER_PHOTO',
  payload: editUser({
    ...new User(user, true).toUpdate(),
    image: {
      fullDownloadUrl: null,
      fullStorageLocation: null,
    },
  }, token),
  then: fetchMe(),
  message: 'user-updated',
});

export const updateUserComplete = async (user, token) => {
  if (user.image) {
    const image = await uploadFile(user.image, token);
    if (!image) {
      return Promise.reject(new Error('Error in sending images'));
    }
    user.image = image;
  }
  return editUser(user, token);
};

export const updateUser = (user) => ({ token }) => ({
  type: 'UPDATE_USER',
  payload: updateUserComplete(new User(user, true).toUpdate(), token),
  then: fetchMe(),
  message: 'user-updated',
});

export const changeLanguage = (language) => ({ token, userId, userUid }) => ({
  type: 'CHANGE_LANGUAGE',
  payload: updateUserComplete({
    language,
    id: userId,
    uid: userUid,
  }, token),
  then: fetchMe(),
});

export const changeEmail = ({ password, email }) => ({ dispatchPromise }) => {
  const promise = async () => await dispatchPromise(firebaseChangeEmail({ password, email }));

  return {
    type: 'UPDATE_USER_EMAIL',
    payload: promise(),
    then: fetchMe(),
    message: 'email-changed',
  };
};

export const finishChangeEmail = (email) => ({ token, userId, userUid }) => {
  const promise = async () => {
    const user = { email, id: userId, uid: userUid };
    return await editUser(user, token);
  };

  return {
    type: 'FINISH_UPDATE_USER_EMAIL',
    payload: promise(),
    then: fetchMe(),
  };
};

export const disableAccount = () => ({ dispatch, userId, token }) => {
  dispatch(removeUser()); // remove user in Firebase
  return {
    type: 'REMOVE_USER',
    payload: deleteUser(userId, token), // remove user in API
    message: 'user-disabled',
  };
};

export const fetchUsers = (filter) => ({ getState, dispatch, token }) => {
  if (!filter) filter = getState().table.filter.toJS();
  const promise = Promise.all([
    getUsers(filter, token),
    getUsersCount(filter, token),
  ]);
  dispatch(fetch(promise, 'TABLE_TYPE_USER'));
  return {
    type: 'FETCH_USERS',
  };
};

export const fetchAreaUsers = (rootAreaId, roleId) => ({ token }) => {
  const promise = async () => {
    const users = await getAreaUsers(rootAreaId, roleId, token);
    const userIds = users.map(x => x.userId).join(',');
    const result = userIds && await getUsers({ userIds }, token);
    if (!result) return [];
    const r = users.map(userArea => {
      const user = _.find(result, ['id', parseInt(userArea.userId, 10)]);
      return {
        ...userArea,
        ...user,
        id: `${user.id}`,
        type: userArea.area && userArea.area.type,
        typeValue: userArea.area && userArea.area[userArea.area.type],
        typeValueId: userArea.area && userArea.area.id,
      };
    }).sort((a, b) => {
      if (a.userId < b.userId) return -1;
      if (a.userId > b.userId) return 1;
      return 0;
    });
    return r;
  };

  return ({
    type: FETCH_AREA_USERS,
    payload: promise(),
    meta: {
      rootAreaId,
      roleId,
    },
  });
};

export const fetchMe = () => ({ token }) => {
  const promise = async () => {
    const userData = await getMe(token);
    const user = new User(userData);
    return { user };
  };

  return {
    type: FETCH_ME,
    payload: promise(),
  };
};

export const fetchUserEvents = (id) => ({ dispatch, token, userId }) => {
  const promise = async (uid) => {
    const activities = await getUserEvents(uid, token);
    const eventIds = activities.map(x => x.id).join(',');
    if (!eventIds) return [];

    const filter = new EventFilter({ eventIds }).toFilter(true);
    const events = await getEvents(filter, token);

    const result = events.map(x => _.assign(x, _.find(activities, { id: `${x.id}` })));

    return result;
  };

  if (id) {
    dispatch(fetch(Promise.all([promise(id), 1])));
  }

  return {
    type: id ? 'FETCH_USER_EVENTS' : FETCH_ME_EVENTS,
    payload: !id && promise(userId),
  };
};

export const fetchUserDumps = (userId, action, anonymous) => ({ dispatch, token }) => {
  const promise = async () => {
    const activities = await getUserActivity({ type: 'trashPoint', anonymous: Boolean(anonymous) }, userId, token);
    let activitiesFiltered = [];

    if (action === 'created') {
      activitiesFiltered = activities.filter(act => act.action === 'create');
    } else if (action === 'updated') {
      activitiesFiltered = activities.filter(act => act.action === 'update');
    }

    const trashIds = activitiesFiltered.map(xx => xx.id).join(',');
    if (!trashIds) return [];

    const filter = new TrashFilter({ trashIds }).toFilter(true);
    const trashes = await getTrashes(filter, token);

    const result = trashes.map(x => _.assign(x, _.find(activities, { id: `${x.id}` })));

    return result;
  };

  dispatch(fetch(Promise.all([promise(), 1])));

  return {
    type: 'FETCH_USER_DUMPS',
  };
};

export const fetchUser = (id, showActivity) => ({ token }) => {
  const promise = async () => {
    let user = {};
    user = await getUser(id, token);
    if (showActivity) {
      user.activity = await getReviewActivity({}, id, token);
    }
    return user;
  };

  return {
    type: FETCH_USER_DETAIL,
    payload: promise(),
  };
};

export const toggleFilter = () => ({
  type: 'TOGGLE_FILTER',
});

export const findUserByEmail = (email, last, formName, fieldName, validationFieldName) =>
  ({ token, dispatch }) => {
    const promise = async () => {
      const users = await getUsersForManager({ emails: email }, token);
      if (users.length === 0) {
        const errors = {};
        errors[validationFieldName] = 'user.emailNotFound';
        dispatch({
          type: 'USER_NOT_FOUND',
          payload: errors,
        });
        return users;
      }
      const value = users.reduce((prev, cur) => {
        prev[cur.id] = cur;
        return prev;
      }, {});
      const result = Object.assign(last || {}, value);
      dispatch(change(formName, fieldName, result));
      dispatch(change(formName, validationFieldName, ''));
      return users;
    };
    return ({
      type: 'FIND_USER_BY_EMAIL',
      payload: promise(),
    });
  };

export const fetchApiKey = () => ({ token, userId }) => {
  const promise = async () => ((await getApiKey(userId, token) || []).filter(x => x.userId === `${userId}`)[0] || {});

  return {
    type: GET_API_KEY,
    payload: promise(),
  };
};

export const generateApiKey = (regenerate) => ({ dispatch, token, userId }) => {
  const promise = async () => {
    try {
      return regenerate
        ? await putApiKey(userId, token)
        : await postApiKey(userId, 50, token);
    } catch (error) {
      dispatch(fetchApiKey());
      return null;
    }
  };

  return {
    type: GENERATE_API_KEY,
    payload: promise(),
  };
};

export const exportUsers = (attributes, limit) => ({ dispatch }) => {
  const sortedAttributes = Object.keys(exportAttributes).map(x => attributes.indexOf(x) > -1 ? x : null).filter(x => x);
  dispatch(exportToCsv(attributes, limit, getUsers, getUsersCount, sortedAttributes, 'userIds'));
  return {
    type: 'EXPORT_USERS',
  };
};
