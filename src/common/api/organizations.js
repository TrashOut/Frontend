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

export const postOrganization = async (data, token) => {
  try {
    return await post('/webapi/organization', data, token);
  } catch (error) {
    throw new Error('cannot-create');
  }
};

export const putOrganization = async (data, token) => {
  if (!data.id) throw new Error('cannot-create');
  try {
    const result = await put(`/webapi/organization/${data.id}`, data, token);
    return result;
  } catch (error) {
    throw new Error('cannot-create');
  }
};

export const removeOrganization = async (id, token) => {
  try {
    const result = await remove(`/webapi/organization/${id}`, token);
    return result;
  } catch (error) {
    throw new Error('remove-error');
  }
};


export const getOrganizations = async (filter, token) => {
  try {
    const result = await get(`/webapi/organization/?${getQueryString(filter)}`, token);
    return result;
  } catch (error) {
    throw new Error('get-error');
  }
};

export const getOrganizationsCount = async (filter, token) => {
  try {
    const result = await get(`/webapi/organization/count?${getQueryString(filter)}`, token);
    return result;
  } catch (error) {
    throw error;
  }
};

export const getOrganization = async (id, token) => {
  try {
    return await get(`/webapi/organization/${id}`, token);
  } catch (error) {
    throw new Error('get-error');
  }
};

export const postOrganizationInvitation = async (id, emails, token) => {
  try {
    return await post(`/webapi/organization/${id}/sendInvitations`, { emails }, token);
  } catch (error) {
    throw new Error('cannot-create');
  }
};

export const getOrganizationActivity = async (id, token) => {
  try {
    return await get(`/webapi/organization/${id}/activity`, token);
  } catch (error) {
    throw new Error('get-error');
  }
};

export const getOrganizationUsers = async (id, filter, token) => {
  try {
    return await get(`/webapi/organization/${id}/users/?${getQueryString(filter)}`, token);
  } catch (error) {
    throw new Error('get-error');
  }
};

export const getOrganizationUsersCount = async (id, filter, token) => {
  try {
    return await get(`/webapi/organization/${id}/users/count/?${getQueryString(filter)}`, token);
  } catch (error) {
    throw new Error('get-error');
  }
};

export const postOrganizationUser = async (id, userId, token) => {
  try {
    return userId
      ? await post(`/webapi/organization/${id}/user/${userId}`, { organizationRoleId: 1 }, token)
      : await post(`/webapi/user/joinOrganization/${id}`, null, token);
  } catch (error) {
    throw new Error('cannot-create');
  }
};

export const removeOrganizationUser = async (id, userId, token) => {
  try {
    return userId
      ? await remove(`/webapi/organization/${id}/user/${userId}`, token)
      : await remove(`/webapi/user/leaveOrganization/${id}`, token);
  } catch (error) {
    throw new Error('remove-error');
  }
};

export const getOrganizationStatistics = async (id, token) => {
  try {
    return await get(`/webapi/organization/${id}/stats`, token);
  } catch (error) {
    throw new Error('get-error');
  }
};

