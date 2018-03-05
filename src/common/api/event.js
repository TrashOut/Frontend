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
import { get, post, remove, put, getQueryString } from '../api/api';

export const postEvent = async (data, token) => {
  try {
    const result = await post('/webapi/event/', data, token);
    return result;
  } catch (error) {
    throw new Error('cannot-create');
  }
};

export const putEvent = async (data, token) => {
  if (!data.id) throw new Error('cannot-create');
  const id = data.id;
  delete data.id;
  try {
    const result = await put(`/webapi/event/${id}`, data, token);
    return result;
  } catch (error) {
    throw new Error('cannot-create');
  }
};

export const removeEvent = async (id, token) => {
  try {
    const result = await remove(`/webapi/event/${id}`, token);
    return result;
  } catch (error) {
    throw new Error('remove-error');
  }
};

export const getEvent = async (id, token) => {
  try {
    const result = await get(`/webapi/event/${id}`, token);
    return result;
  } catch (error) {
    throw new Error('get-error');
  }
};

export const getEvents = async (filter, token) => {
  try {
    const result = await get(`/webapi/event/?${getQueryString(filter)}`, token);
    return result;
  } catch (error) {
    throw new Error('get-error');
  }
};

export const getEventsCount = async (filter, token) => {
  try {
    const result = await get(`/webapi/event/count/?${getQueryString(filter)}`, token);
    return result.count;
  } catch (error) {
    throw new Error('get-error');
  }
};

export const getEventUsers = async (eventId, token) => {
  try {
    return await get(`/webapi/event/${eventId}/users/`, token);
  } catch (error) {
    throw new Error('get-error');
  }
};

export const joinEvent = async (id, data, token) => {
  try {
    const result = await post(`/webapi/event/${id}/users`, data, token);
    return result;
  } catch (error) {
    throw new Error('cannot-create');
  }
};

export const updateEventUser = async (id, userId, data, token) => {
  try {
    const result = await put(`/webapi/event/${id}/users/${userId}`, data, token);
    return result;
  } catch (error) {
    throw new Error('cannot-create');
  }
};

export const removeEventUser = async (id, userId, token) => {
  try {
    const result = await remove(`/webapi/event/${id}/users/${userId}`, token);
    return result;
  } catch (error) {
    throw new Error('cannot-create');
  }
};

export const markAsSpam = async (eventId, token) => {
  try {
    return await post('/webapi/spam/event/', { eventId }, token);
  } catch (error) {
    throw new Error('cannot-mark-as-spam');
  }
};

export const confirmEventJoin = async (eventId, token) => {
  try {
    return await put(`/webapi/event/${eventId}/confirm`, { id: eventId }, token);
  } catch (error) {
    throw new Error('cannot-confirm-event-join');
  }
};

export const eventFeedback = async (eventId, data, token) => {
  try {
    return await put(`/webapi/event/${eventId}/feedback`, data, token);
  } catch (error) {
    throw new Error('cannot-event-feedback');
  }
};

export const eventFeedbackImages = async (eventId, images, token) => {
  try {
    return await post(`/webapi/event/${eventId}/add-images`, images, token);
  } catch (error) {
    throw new Error('cannot-add-event-feedback-images');
  }
};
