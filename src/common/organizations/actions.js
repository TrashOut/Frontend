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
import * as api from '../api/organizations';
import * as areaApi from '../api/areas';
import Organization from '../models/organization';
import { fetch } from '../table/actions';
import { fetchMe } from '../users/actions';
import { uploadFile } from '../api/firebase';

export const CREATE_INVITATION = 'CREATE_INVITATION';
export const CREATE_ORGANIZATION = 'CREATE_ORGANIZATION';
export const FETCH_ORGANIZATION = 'FETCH_ORGANIZATION';
export const FETCH_ORGANIZATION_ACTIVITY = 'FETCH_ORGANIZATION_ACTIVITY';
export const FETCH_ORGANIZATION_LIST = 'FETCH_ORGANIZATION_LIST';
export const FETCH_ORGANIZATION_SUCCESS = 'FETCH_ORGANIZATION_SUCCESS';
export const FETCH_ORGANIZATION_USERS = 'FETCH_ORGANIZATION_USERS';
export const FETCH_ORGANIZATION_USERS_SUCCESS = 'FETCH_ORGANIZATION_USERS_SUCCESS';
export const JOIN_ORGANIZATION = 'JOIN_ORGANIZATION';
export const LEAVE_ORGANIZATION = 'LEAVE_ORGANIZATION';
export const REMOVE_ORGANIZATION = 'REMOVE_ORGANIZATION';
export const UPDATE_ORGANIZATION = 'UPDATE_ORGANIZATION';

const send = async (organization, func, dispatch, token, removeImage) => {
  if (organization.image) {
    const image = await uploadFile(organization.image, token);
    if (!image) {
      return Promise.reject(new Error('Error in sending images'));
    }
    organization.image = image;
  }

  if (removeImage) {
    organization.image = {};
    organization.imageId = null;
  }

  return func(organization, token);
};

export const createOrganization = (data) =>
  ({ dispatch, token }) =>
({
  type: CREATE_ORGANIZATION,
  payload: send(
    new Organization(data, true).toCreate(),
    api.postOrganization,
    dispatch,
    token
  ),
  originalObject: data,
  then: fetchMe(),
  message: 'organization-created',
});

export const updateOrganization = (data, removeImage) =>
  ({ dispatch, token }) =>
({
  type: UPDATE_ORGANIZATION,
  payload: send(
    new Organization(data, true).toUpdate(),
    api.putOrganization,
    dispatch,
    token,
    removeImage,
  ),
  originalObject: data,
  message: 'organization-updated',
  then: removeImage && fetchOrganization(data.id),
});

export const fetchOrganizationList = (filter) => ({ dispatch, token, getState }) => {
  const fetchAll = filter === 'all';
  if (!filter || fetchAll) {
    filter = getState().table.filter.toJS();
  }
  if (fetchAll) {
    delete filter.page;
    delete filter.limit;
  }
  const promise = Promise.all([
    api.getOrganizations(filter, token),
    api.getOrganizationsCount(filter, token),
  ]);

  dispatch(fetch(promise, 'TABLE_TYPE_ORGANIZATION'));
  return {
    type: FETCH_ORGANIZATION_LIST,
  };
};

export const fetchOrganization = (id) => ({ token }) => {
  const promise = async () => {
    const organization = await api.getOrganization(id, token);
    const area = organization.areaId
      ? await areaApi.getArea(organization.areaId, token)
      : null;
    const usersCount = await api.getOrganizationUsersCount(id, { }, token);
    const parent = (organization.parentId && organization.parentId > 0)
      ? await api.getOrganization(organization.parentId, token)
      : null;
    // const statistics = await api.getOrganizationStatistics(id, token);

    return [organization, usersCount, area, parent]; // Second param for users
  };

  return {
    type: FETCH_ORGANIZATION,
    payload: promise(),
  };
};


export const removeOrganization = (id) => ({ token }) => ({
  type: REMOVE_ORGANIZATION,
  payload: api.removeOrganization(id, token),
  message: 'organization-removed',
});

export const joinOrganization = (organizationId, userId) => ({ getState, token, dispatch }) => {
  const filter = getState().table.filter.toJS();

  const postOrganizationPromise = async () => {
    if (Array.isArray(userId)) {
      return Promise.all(userId.map(async x => await api.postOrganizationUser(organizationId, x, token)));
    }
    return await api.postOrganizationUser(organizationId, userId, token);
  };

  const promise = async () => {
    await dispatch(fetchOrganization(organizationId));
    await dispatch(fetchOrganizationUsers(organizationId, filter));
  };

  return {
    type: JOIN_ORGANIZATION,
    payload: postOrganizationPromise(),
    originalObject: { id: organizationId },
    thenPromise: promise,
    then: fetchMe(),
    message: 'organization-joined',
  };
};

export const leaveOrganization = (organizationId, userId) => ({ getState, token, dispatch }) => {
  const filter = getState().table.filter.toJS();

  const promise = async () => {
    await dispatch(fetchOrganization(organizationId));
    await dispatch(fetchOrganizationUsers(organizationId, filter));
  };

  return {
    type: LEAVE_ORGANIZATION,
    payload: api.removeOrganizationUser(organizationId, userId, token),
    thenPromise: promise,
    then: fetchMe(),
    message: 'organization-leaved',
  };
};

export const sendInvitations = (organizationId, emails) => ({ token }) => ({
  type: CREATE_INVITATION,
  payload: api.postOrganizationInvitation(organizationId, emails, token),
  message: 'invitations-sent',
});

export const fetchOrganizationUsers = (organizationId, filter) => ({ token, dispatch }) => {
  dispatch(fetch(Promise.all([
    api.getOrganizationUsers(organizationId, filter, token),
    api.getOrganizationUsersCount(organizationId, filter, token),
  ])));
  return {
    type: FETCH_ORGANIZATION_USERS,
  };
};
