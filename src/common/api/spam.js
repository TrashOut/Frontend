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
import { get, remove, put, getQueryString } from '../api/api';

const getBaseUrl = (type) => {
  let baseUrl = 'spam';
  switch (type) {
    case 'event':
      baseUrl = 'spam/event';
      break;
    case 'trash':
      baseUrl = 'spam/trash';
      break;
    case 'collectionPoint':
      baseUrl = 'spam/collection-point';
      break;
    case 'unreviewed':
      baseUrl = 'user/unreviewedWithActivity';
      break;
    default:
      baseUrl = 'spam';
  }
  return baseUrl;
};

export const getSpams = async ({ type, ...filter }, token) => {
  try {
    const result = await get(`/webapi/${getBaseUrl(type)}?${getQueryString(filter)}`, token);
    return result;
  } catch (error) {
    throw error;
  }
};

export const getSpamsCount = async ({ type, ...filter }, token) => {
  try {
    const result = await get(`/webapi/${getBaseUrl(type)}/count?${getQueryString(filter)}`, token);
    return result;
  } catch (error) {
    return 1;
  }
};

export const getSpam = async (id, token) => {
  try {
    return await get(`/webapi/spam/${id}`, token);
  } catch (error) {
    throw error;
  }
};

export const putSpam = async (id, token) => {
  try {
    return await put(`/webapi/spam/${id}`, null, token);
  } catch (error) {
    throw error;
  }
};

export const deleteSpam = async (id, token) => {
  try {
    return await remove(`/webapi/spam/${id}`, token);
  } catch (error) {
    throw error;
  }
};

export const deleteCollectionPointSpam = async (id, token) => {
  try {
    return await remove(`/webapi/spam/collection-point/${id}`, token);
  } catch (error) {
    throw error;
  }
};

export const deleteTrashPointSpam = async (id, token) => {
  try {
    return await remove(`/webapi/spam/trash/${id}`, token);
  } catch (error) {
    throw error;
  }
};
