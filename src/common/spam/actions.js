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
import { fetch } from '../table/actions';
import * as api from '../api/spam';
import * as trashApi from '../api/trashes';
import * as eventApi from '../api/event';
import * as userApi from '../api/users';
import * as collectionPointApi from '../api/collectionPoint';

export const FETCH_SPAMS = 'FETCH_SPAMS';
export const FETCH_SPAMS_START = 'FETCH_SPAMS_START';
export const FETCH_SPAMS_SUCCESS = 'FETCH_SPAMS_SUCCESS';
export const FETCH_SPAMS_ERROR = 'FETCH_SPAMS_ERROR';

export const RESOLVE_SPAM = 'RESOLVE_SPAM';
export const RESOLVE_SPAM_START = 'RESOLVE_SPAM_START';
export const RESOLVE_SPAM_SUCCESS = 'RESOLVE_SPAM_SUCCESS';
export const RESOLVE_SPAM_ERROR = 'RESOLVE_SPAM_ERROR';

export const REMOVE_SPAM = 'REMOVE_SPAM';
export const REMOVE_SPAM_START = 'REMOVE_SPAM_START';
export const REMOVE_SPAM_SUCCESS = 'REMOVE_SPAM_SUCCESS';
export const REMOVE_SPAM_ERROR = 'REMOVE_SPAM_ERROR';

export const FETCH_SPAM = 'FETCH_SPAM';
export const FETCH_SPAM_START = 'FETCH_SPAM_START';
export const FETCH_SPAM_SUCCESS = 'FETCH_SPAM_SUCCESS';
export const FETCH_SPAM_ERROR = 'FETCH_SPAM_ERROR';

export const APPROVE_USER = 'APPROVE_USER';

export const REMOVE_USER_ACTIVITIES = 'REMOVE_USER_ACTIVITIES';

export const fetchSpams = () => ({ getState, dispatch, token }) => {
  const filter = getState().table.filter.toJS();
  const promise = Promise.all([
    api.getSpams(filter, token),
    api.getSpamsCount(filter, token),
  ]);
  dispatch(fetch(promise, 'TABLE_TYPE_SPAM'));
  return {
    type: FETCH_SPAMS,
  };
};

export const fetchSpam = (id) => ({ token }) => {
  const getSpamWithItem = async () => {
    const spam = await api.getSpam(id, token);
    let promise = null;
    const reportType = (spam.eventId) ? 'event' : (spam.trashPointActivityId) ? 'trash' : 'collectionPoint';
    switch (reportType) {
      case 'trash': {
        promise = trashApi.getTrash(spam.trashPointActivityId);
        break;
      }
      case 'event': {
        promise = eventApi.getEvent(spam.eventId);
        break;
      }
      case 'collectionPoint': {
        promise = collectionPointApi.getCollectionPoint(spam.collectionPointActivityId);
        break;
      }
    }
    return ({
      spam,
      data: await promise,
    });
  };

  return ({
    type: FETCH_SPAM,
    payload: getSpamWithItem(),
  });
};

export const resolveSpam = (id, type, typeId) => ({ token }) => {
  const promise = async () => {
    // await api.putSpam(id, token);
    if (type === 'trash') {
      return await trashApi.removeTrash(typeId, token);
    }
    return await collectionPointApi.removeCollectionPoint(typeId, token);
  };

  return {
    type: RESOLVE_SPAM,
    payload: promise(),
    then: fetchSpams(),
    message: 'resolve-spam',
  };
};

export const removeSpam = (id, type) => ({ token }) => ({
  type: REMOVE_SPAM,
  payload: type === 'collectionPoint' ? api.deleteCollectionPointSpam(id, token) : api.deleteTrashPointSpam(id, token),
  then: fetchSpams(),
  message: 'delete-spam',
});

export const approveUser = (id, uid) => ({ token }) => {
  const user = { id, uid, reviewed: true };
  return ({
    type: APPROVE_USER,
    payload: userApi.editUser(user, token),
    then: fetchSpams(),
    message: 'user-approved',
  });
};

export const removeUserActivities = () => ({
  type: REMOVE_USER_ACTIVITIES,
});
