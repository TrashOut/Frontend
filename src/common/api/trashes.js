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

export const getTrashesCount = async (filter, token) => {
  try {
    const result = await get(`/webapi/trash/count/?${getQueryString(filter)}`, token);
    return result.count;
  } catch (error) {
    throw error;
  }
};

export const getTrashes = async (filter, token) => {
  try {
    const result = await get(`/webapi/trash/?${getQueryString(filter)}`, token);
    return result;
  } catch (error) {
    throw error;
  }
};

export const postTrash = async (trash, token) => {
  try {
    const result = await post('/webapi/trash/', { ...trash }, token);
    return result;
  } catch (error) {
    throw new Error('cannot-create');
  }
};

export const removeTrash = async (id, token) => {
  try {
    const result = await remove(`/webapi/trash/${id}`, token);
    return result;
  } catch (error) {
    throw new Error('remove-error');
  }
};

export const putTrash = async (trash, token) => {
  try {
    delete trash.userId;
    const result = await put(`/webapi/trash/${trash.id}`, trash, token);
    return result;
  } catch (error) {
    throw error;
  }
};

export const getTrashActivity = async (id, token) => {
  try {
    const result = await get(`/webapi/trash/${id}/activities`, token);
    return result;
  } catch (error) {
    throw error;
  }
};

export const getTrash = async (id, token) => {
  try {
    const result = await get(`/webapi/trash/${id}`, token);
    result.trashSize = result.size;
    return result;
  } catch (error) {
    throw error;
  }
};

export const getZoomPoint = async (zoom, geocells, filter, token) => {
  try {
    const result = await get(`/webapi/trash/zoom-point/?zoomLevel=${zoom}&geocells=${geocells}&${getQueryString(filter)}`, token);
    return result;
  } catch (error) {
    throw error;
  }
};

export const removeActivityImage = async (activityId, imageId, token) => {
  try {
    return await remove(`/webapi/trash/activity/${activityId}/images/${imageId}`, token);
  } catch (error) {
    throw error;
  }
};

export const removeActivity = async (id, token) => {
  try {
    return await remove(`/webapi/trash/activity/${id}`, token);
  } catch (error) {
    throw error;
  }
};

export const postComment = async (trashId, data, token) => {
  try {
    return await post(`/webapi/trash/${trashId}/comment`, data, token);
  } catch (error) {
    throw error;
  }
};

export const removeComment = async (trashId, commentId, token) => {
  try {
    return await remove(`/webapi/trash/${trashId}/comment/${commentId}`, token);
  } catch (error) {
    throw error;
  }
};

export const markAsSpam = async (trashPointActivityId, token) => {
  try {
    return await post('/webapi/spam/', { trashPointActivityId }, token);
  } catch (error) {
    throw error;
  }
};
