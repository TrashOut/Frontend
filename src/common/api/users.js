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
import { get, patch, post, put, remove, getQueryString } from './api';

export const createUser = async (user, token) => {
  try {
    return await post('/webapi/user', user, token);
  } catch (error) {
    throw error;
  }
};

export const getMe = async (token) => {
  try {
    return await get('/webapi/user/me/', token);
  } catch (error) {
    throw error;
  }
};

export const getUserEvents = async (userId, token) => {
  try {
    return await get(`/webapi/user/${userId}/activity?type=event`, token);
  } catch (error) {
    throw error;
  }
};

export const getUserEventsCount = async (userId, token) => {
  try {
    return await get(`/webapi/user/${userId}/userActivity/count?type=event`, token);
  } catch (error) {
    throw error;
  }
};

export const patchDisableUser = async (userId, token) => {
  try {
    return await patch(`/webapi/user/disable/${userId}`, null, token);
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId, token) => {
  try {
    return await remove(`/webapi/user/${userId}`, token);
  } catch (error) {
    throw error;
  }
};

export const editUser = async (user, token) => {
  const id = user.id;
  const data = user;
  delete data.id;
  delete data.organizations;
  delete data.displayName;
  try {
    return await put(`/webapi/user/${id}`, data, token);
  } catch (error) {
    throw error;
  }
};

export const deleteUserPhoto = async (userId, data, token) => {
  try {
    return await put(`/webapi/user/${userId}`, data, token);
  } catch (error) {
    throw error;
  }
};


export const getUser = async (id, token) => {
  try {
    return await get(`/webapi/user/${id}`, token);
  } catch (error) {
    throw error;
  }
};

export const getReviewActivity = async (filter, id, token) => {
  try {
    return await get(`/webapi/user/${id}/reviewActivity?${getQueryString(filter)}`, token);
  } catch (error) {
    throw error;
  }
};

export const getUserActivity = async (filter, id, token) => {
  try {
    return await get(`/webapi/user/${id}/userActivity?${getQueryString(filter)}`, token);
  } catch (error) {
    throw error;
  }
};

export const getUsers = async (filter, token) => {
  try {
    return await get(`/webapi/user?${getQueryString(filter)}`, token);
  } catch (error) {
    throw error;
  }
};

export const getUsersForManager = async (filter, token) => {
  try {
    return await get(`/webapi/user/usersForOrganizationManager?${getQueryString(filter)}`, token);
  } catch (error) {
    throw error;
  }
};

export const getUsersCount = async (filter, token) => {
  try {
    return await get(`/webapi/user/count?${getQueryString(filter)}`, token);
  } catch (error) {
    throw error;
  }
};

export const postUserArea = async (userId, areaId, userAreaRoleId, frequency, token) => {
  try {
    const data = {
      areaId,
      userAreaRoleId,
      notificationFrequency: frequency,
      notificaiton: !!frequency,
    };
    return await post(`/webapi/user/${userId}/area`, data, token);
  } catch (error) {
    if (error.message.error.message === 'This relation already exists.') {
      return true;
    }
    throw error;
  }
};

export const putUserArea = async (userId, fkId, userAreaRoleId, frequency, token) => {
  try {
    const data = {
      areaId: fkId,
      notificaiton: !!frequency,
      notificationFrequency: frequency,
      userAreaRoleId,
    };

    return await put(`/webapi/user/${userId}/area/${fkId}`, data, token);
  } catch (error) {
    throw error;
  }
};

export const deleteUserArea = async (userId, areaId, token) => {
  try {
    return await remove(`/webapi/user/${userId}/area/${areaId}`, token);
  } catch (error) {
    throw error;
  }
};

export const getAreaUsers = async (rootAreaId, userAreaRoleId, token) => {
  try {
    return await get(`/webapi/user/area/?${getQueryString({ rootAreaId, userAreaRoleId })}`, token);
  } catch (error) {
    throw error;
  }
};

export const putApiKey = async (userId, token) => {
  try {
    return await put('/webapi/api-key/regenerate', { userId }, token);
  } catch (error) {
    throw error;
  }
};

export const postApiKey = async (userId, limitPerHour = 50, token) => {
  try {
    return await post('/webapi/api-key/', { userId, limitPerHour }, token);
  } catch (error) {
    throw error;
  }
};

export const getApiKey = async (userIds, token) => {
  try {
    return await get(`/webapi/api-key/?${getQueryString({ userIds })}`, token);
  } catch (error) {
    throw error;
  }
};
