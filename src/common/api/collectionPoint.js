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

export const getCollectionPointCount = async (filter, token) => {
  try {
    const result = await get(`/webapi/collection-point/count/?${getQueryString(filter)}`, token);
    return result.count;
  } catch (error) {
    throw error;
  }
};

export const getCollectionPoints = async (filter, token) => {
  try {
    const result = await get(`/webapi/collection-point/?${getQueryString(filter)}`, token);
    return result;
  } catch (error) {
    throw error;
  }
};

export const postCollectionPoint = async (data, token) => {
  try {
    const result = await post('/webapi/collection-point/', data, token);
    return result;
  } catch (error) {
    throw new Error('cannot-create');
  }
};

export const removeCollectionPoint = async (id, token) => {
  try {
    const result = await remove(`/webapi/collection-point/${id}`, token);
    return result;
  } catch (error) {
    throw new Error('remove-error');
  }
};

export const putCollectionPoint = async (data, token) => {
  if (!data.id) throw new Error('cannot-create');
  try {
    const result = await put(`/webapi/collection-point/${data.id}`, data, token);
    return result;
  } catch (error) {
    throw error;
  }
};

export const getCollectionPoint = async (id, token) => {
  try {
    const result = await get(`/webapi/collection-point/${id}`, token);
    result.trashSize = result.size;
    return result;
  } catch (error) {
    throw error;
  }
};

export const removeImage = async (activityId, imageId, token) => {
  try {
    return await remove(`/webapi/collection-point/activity/${activityId}/images/${imageId}`, token);
  } catch (error) {
    throw error;
  }
};

export const markAsSpam = async (collectionPointActivityId, token) => {
  try {
    return await post('/webapi/spam/collection-point/', { collectionPointActivityId, userId: '33957' }, token);
  } catch (error) {
    throw error;
  }
};
