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
import * as api from '../api/event';
import * as cpApi from '../api/collectionPoint';
import * as trashApi from '../api/trashes';
import Event from '../models/event';
import moment from 'moment-timezone';
import { change } from 'redux-form';
import { fetch, clear } from '../table/actions';
import { getPointsBound, getRectangleDiagonal } from './helper';
import { getTimezone, getAddress } from '../api/maps';
import { MAX_AREA_TRESHOLD } from './consts';
import { uploadFiles } from '../api/firebase';

export const CREATE_EVENT = 'CREATE_EVENT';
export const CREATE_EVENT_START = 'CREATE_EVENT_START';
export const CREATE_EVENT_SUCCESS = 'CREATE_EVENT_SUCCESS';
export const CREATE_EVENT_ERROR = 'CREATE_EVENT_ERROR';

export const FETCH_EVENT = 'FETCH_EVENT';
export const FETCH_EVENT_START = 'FETCH_EVENT_START';
export const FETCH_EVENT_SUCCESS = 'FETCH_EVENT_SUCCESS';
export const FETCH_EVENT_ERROR = 'FETCH_EVENT_ERROR';

export const REMOVE_EVENT = 'REMOVE_EVENT';
export const REMOVE_EVENT_START = 'REMOVE_EVENT_START';
export const REMOVE_EVENT_SUCCESS = 'REMOVE_EVENT_SUCCESS';
export const REMOVE_EVENT_ERROR = 'REMOVE_EVENT_ERROR';

export const UPDATE_EVENT = 'UPDATE_EVENT';
export const UPDATE_EVENT_START = 'UPDATE_EVENT_START';
export const UPDATE_EVENT_SUCCESS = 'UPDATE_EVENT_SUCCESS';
export const UPDATE_EVENT_ERROR = 'UPDATE_EVENT_ERROR';

export const FETCH_EVENT_LIST = 'FETCH_EVENT_LIST';
export const FETCH_EVENT_LIST_START = 'FETCH_EVENT_LIST_START';
export const FETCH_EVENT_LIST_SUCCESS = 'FETCH_EVENT_LIST_SUCCESS';
export const FETCH_EVENT_LIST_ERROR = 'FETCH_EVENT_LIST_ERROR';

export const JOIN_USER_TO_EVENT = 'JOIN_USER_TO_EVENT';
export const JOIN_USER_TO_EVENT_START = 'JOIN_USER_TO_EVENT_START';
export const JOIN_USER_TO_EVENT_SUCCESS = 'JOIN_USER_TO_EVENT_SUCCESS';
export const JOIN_USER_TO_EVENT_ERROR = 'JOIN_USER_TO_EVENT_ERROR';

export const UPDATE_USER_EVENT = 'UPDATE_USER_EVENT';
export const UPDATE_USER_EVENT_START = 'UPDATE_USER_EVENT_START';
export const UPDATE_USER_EVENT_SUCCESS = 'UPDATE_USER_EVENT_SUCCESS';
export const UPDATE_USER_EVENT_ERROR = 'UPDATE_USER_EVENT_ERROR';

export const REMOVE_USER_EVENT = 'REMOVE_USER_EVENT';
export const REMOVE_USER_EVENT_START = 'REMOVE_USER_EVENT_START';
export const REMOVE_USER_EVENT_SUCCESS = 'REMOVE_USER_EVENT_SUCCESS';
export const REMOVE_USER_EVENT_ERROR = 'REMOVE_USER_EVENT_ERROR';

export const MARK_AS_SPAM_EVENT = 'MARK_AS_SPAM_EVENT';
export const MARK_AS_SPAM_EVENT_START = 'MARK_AS_SPAM_EVENT_START';
export const MARK_AS_SPAM_EVENT_SUCCESS = 'MARK_AS_SPAM_EVENT_SUCCESS';
export const MARK_AS_SPAM_EVENT_ERROR = 'MARK_AS_SPAM_EVENT_ERROR';

export const SET_EVENT_TAB = 'SET_EVENT_TAB';

export const CLEAN_DATA_FOR_FORM = 'CLEAN_DATA_FOR_FORM';

export const TOGGLE_LOCATION = 'TOGGLE_LOCATION';

export const FETCH_DATA_FOR_FORM = 'FETCH_DATA_FOR_FORM';
export const FETCH_DATA_FOR_FORM_START = 'FETCH_DATA_FOR_FORM_START';
export const FETCH_DATA_FOR_FORM_SUCCESS = 'FETCH_DATA_FOR_FORM_SUCCESS';
export const FETCH_DATA_FOR_FORM_ERROR = 'FETCH_DATA_FOR_FORM_ERROR';

export const FETCH_DATA_FOR_FORM_BY_IDS = 'FETCH_DATA_FOR_FORM_BY_IDS';
export const FETCH_DATA_FOR_FORM_BY_IDS_START = 'FETCH_DATA_FOR_FORM_BY_IDS_START';
export const FETCH_DATA_FOR_FORM_BY_IDS_SUCCESS = 'FETCH_DATA_FOR_FORM_BY_IDS_SUCCESS';
export const FETCH_DATA_FOR_FORM_BY_IDS_ERROR = 'FETCH_DATA_FOR_FORM_BY_IDS_ERROR';

const send = async (event, func, dispatch, firebaseStorage, firebaseDatabase, token) => {
  const dateWithTZ = await getTimezone(event.gps.lat, event.gps.long, event.start.getTime() / 1000);
  event.startWithTimeZone = moment.tz(event.start, dateWithTZ.timeZoneId).format();
  return func(event, token);
};

export const updateEvent = (data) => ({ dispatch, firebaseStorage, firebaseDatabase, token }) => ({
  type: UPDATE_EVENT,
  payload: send(new Event(data, true).toUpdate(), api.putEvent, dispatch, firebaseStorage, firebaseDatabase, token),
  originalObject: data,
  message: 'update-event',
});

export const createEvent = (data) => ({ dispatch, firebaseStorage, firebaseDatabase, token }) => ({
  type: CREATE_EVENT,
  payload: send(new Event(data, true).toCreate(), api.postEvent, dispatch, firebaseStorage, firebaseDatabase, token),
  message: 'create-event',
});

export const removeEvent = (eventId) => ({ token }) => ({
  type: REMOVE_EVENT,
  payload: api.removeEvent(eventId, token),
  message: 'remove-event',
});

export const fetchEvent = (id) => ({ token }) => {
  const promise = async () => {
    const event = await api.getEvent(id, token);
    event.trashPointIds = event.trashPoints.reduce((prev, cur) => { prev[cur.id] = true; return prev; }, {});
    const users = await api.getEventUsers(id, token);
    const collectionPoints = event.collectionPointIds.length > 0
      ? await cpApi.getCollectionPoints({
        attributesNeeded: 'id,gpsShort,gpsFull,name,size',
        collectionPointIds: event.collectionPointIds.join(','),
      }, token)
      : [];
    event.collectionPointIds = event.collectionPointIds.reduce((prev, cur) => { prev[cur] = true; return prev; }, {});
    event.googleAddress = await getAddress(event.gps.lat, event.gps.long);
    return {
      event,
      users,
      collectionPoints,
    };
  };

  return {
    type: FETCH_EVENT,
    payload: promise(),
  };
};

export const fetchEventTrashes = () => ({ dispatch, getState, token }) => {
  const data = getState().events.item.cleaningArea;
  const filter = {
    ...getState().table.filter.toJS(),
    area: `${data.north},${data.west},${data.south},${data.east}`,
  };

  dispatch(fetch(Promise.all([
    trashApi.getTrashes(filter, token),
    trashApi.getTrashesCount(filter, token),
  ])));
  return {
    type: 'FETCH_EVENT_TRASHES',
  };
};

export const fetchEventCollectionPoints = () => ({ dispatch, getState, token }) => {
  const data = getState().events.item.cleaningArea;
  const filter = {
    ...getState().table.filter.toJS(),
    area: `${data.north},${data.west},${data.south},${data.east}`,
  };

  dispatch(fetch(Promise.all([
    cpApi.getCollectionPoints(filter, token),
    cpApi.getCollectionPointCount(filter, token),
  ])));
  return {
    type: 'FETCH_EVENT_COLLECTION_POINTS',
  };
};


export const fetchEventList = (filter) => ({ getState, dispatch, token }) => {
  const fetchAll = filter === 'all';

  if (!filter || fetchAll) {
    filter = getState().table.filter.toFilter();
  }

  if (fetchAll) {
    delete filter.page;
    delete filter.limit;
  }

  const isMap = getState().events.selectedTab === 'map';

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
    api.getEvents(filter, token),
    api.getEventsCount(filter, token),
  ]);

  dispatch(fetch(promise, 'TABLE_TYPE_EVENT'));
  return {
    type: FETCH_EVENT_LIST,
  };
};

export const setDataTab = (value) => ({ dispatch }) => {
  dispatch(clear());
  return {
    type: SET_EVENT_TAB,
    payload: {
      value,
    },
  };
};

export const markAsSpam = (eventId) => ({ token }) => ({
  type: MARK_AS_SPAM_EVENT,
  payload: api.markAsSpam(eventId, token),
  message: 'marked-as-spam',
});

export const joinEvent = (eventId, userIds) => ({ token, userId }) => ({
  type: JOIN_USER_TO_EVENT,
  payload: api.joinEvent(eventId, userIds || [userId], token),
  then: fetchEvent(eventId),
  message: 'event-joined',
});

export const confirmJoinEvent = (eventId) => ({ token }) => ({
  type: 'CONFIRM_JOIN_EVENT',
  payload: api.confirmEventJoin(eventId, token),
  originalObject: { id: eventId },
  message: 'event-join-confirmed',
});

export const eventFeedback = (eventId, data) => ({ token }) => {
  const promise = async () => {
    const { images: imagesData, ...feedbackData } = data;

    await api.eventFeedback(eventId, feedbackData, token);
    if (imagesData) {
      const images = await uploadFiles(imagesData, token);
      if (images) await api.eventFeedbackImages(eventId, { images }, token);
    }
    return true;
  };

  return {
    type: 'EVENT_FEEDBACK',
    payload: promise(),
    then: fetchEvent(eventId),
    originalObject: { id: eventId },
    message: 'event-feedback',
  };
};

export const updateEventUser = (eventId, userId, data) => ({ token }) => ({
  type: UPDATE_USER_EVENT,
  payload: api.updateEventUser(eventId, userId, data, token),
  // message: 'user-event-updated',
});

export const removeEventUser = (eventId, externalUserId) => ({ token, dispatch, userId }) => ({
  type: REMOVE_USER_EVENT,
  payload: api.removeEventUser(eventId, externalUserId || userId, token),
  then: dispatch(fetchEvent(eventId)),
  message: 'event-unjoined',
});

export const fetchDataForForm = (data) => ({ token }) => ({
  type: FETCH_DATA_FOR_FORM,
  payload: Promise.all([
    trashApi.getTrashes({
      area: `${data.north},${data.west},${data.south},${data.east}`,
      attributesNeeded: 'id,gpsShort,gpsFull,types,size,note,userInfo,url,status,unreviewed',
    }, token),
    cpApi.getCollectionPoints({
      area: `${data.north},${data.west},${data.south},${data.east}`,
      attributesNeeded: 'id,gpsShort,gpsFull,name,size',
    }, token),
  ]),
});

export const fetchDataForFormByIds = (data) => ({ token, dispatch }) => {
  const payload = async () => {
    const trashes = await trashApi.getTrashes({
      trashIds: `${data.trashes.join()}`,
      attributesNeeded: 'id,gpsShort,gpsFull,types,size,note,userInfo,url,status,unreviewed',
    }, token);
    const bounds = getPointsBound(trashes);
    const collectionPoints = await cpApi.getCollectionPoints({
      area: `${bounds.bottomRight.long},${bounds.bottomRight.lat},${bounds.upperLeft.long},${bounds.upperLeft.lat}`,
      attributesNeeded: 'id,gpsShort,gpsFull,name,size',
    }, token);

    dispatch(change('eventCreate', 'cleaningArea', {
      north: bounds.upperLeft.lat,
      east: bounds.bottomRight.long,
      south: bounds.bottomRight.lat,
      west: bounds.upperLeft.long,
    }));

    const formTrashes = trashes.reduce((prev, cur) => {
      prev[cur.id] = true;
      return prev;
    }, {});

    dispatch(change('eventCreate', 'trashPointIds', formTrashes));

    return [trashes, collectionPoints];
  };

  return ({
    type: FETCH_DATA_FOR_FORM_BY_IDS,
    payload: payload(),
  });
};

export const fetchForUpdate = (defaultSelectAll) => ({ token, dispatch, getState }) => {
  const form = getState().form.eventCreate;
  if (!form) return { type: 'FORM_ERROR' };
  const cleaningArea = form.values.cleaningArea;
  if (!cleaningArea) return { type: 'CLEANING_AREA_ERROR' };
  if (getRectangleDiagonal(cleaningArea) > MAX_AREA_TRESHOLD) return { type: 'CLEANING_AREA_LARGE' };

  const getData = async (type) => {
    const func = (type === 'trashes') ? trashApi.getTrashes : cpApi.getCollectionPoints;
    type = (type === 'trashes') ? 'trashPointIds' : 'collectionPointIds';

    const items = await func({
      area: `${cleaningArea.north},${cleaningArea.west},${cleaningArea.south},${cleaningArea.east}`,
      attributesNeeded: 'id,gpsShort,gpsFull',
    }, token);

    const currentItems = (form && form.values[type]) || {};
    const result = items.reduce((prev, cur) => {
      if (prev[cur.id]) prev[cur.id] = true;
      else prev[cur.id] = defaultSelectAll;
      return prev;
    }, currentItems);

    dispatch(change('eventCreate', type, result));
    return items;
  };

  return ({
    type: FETCH_DATA_FOR_FORM,
    payload: Promise.all([getData('trashes'), getData('collectionPoints')]),
  });
};

export const cleanFormData = () => ({ dispatch }) => {
  dispatch(change('eventCreate', 'trashPointIds', {}));
  dispatch(change('eventCreate', 'collectionPointIds', {}));
  return ({
    type: CLEAN_DATA_FOR_FORM,
  });
};

export const toggleLocation = (id) => ({ dispatch, getState }) => {
  const items = getState().form.eventCreate.values.trashPointIds;
  if (items[id] === undefined) items[id] = true;
  items[id] = !items[id];
  const result = Object.assign({}, items);
  dispatch(change('eventCreate', 'trashPointIds', result));

  return ({
    type: TOGGLE_LOCATION,
    payload: id,
  });
};

export const prepareEventFromTrashes = (trashes) => ({ dispatch }) => {
  dispatch(fetchDataForFormByIds({ trashes, collectionPoints: [] }));
  return {
    type: 'PREPARE_EVENTS',
  };
};
