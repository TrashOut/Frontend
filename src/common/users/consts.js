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
export { unreviewed as reviewed } from '../consts';

export const userRoles = {
  admin: { id: 1, value: '1', message: 'user.roles.admin' },
  manager: { id: 2, value: '2', message: 'user.roles.manager' },
  viewer: { id: 3, value: '3', message: 'user.roles.viewer' },
};

export const attributes = {
  id: { id: 'id', message: 'user.id' },
  firstName: { id: 'firstName', message: 'user.firstName' },
  lastName: { id: 'lastName', message: 'user.lastName' },
  userRoleId: { id: 'userRoleId', message: 'profile.role' },
  email: { id: 'email', message: 'global.email' },
  info: { id: 'info', message: 'user.info' },
  birthdate: { id: 'birthdate', message: 'user.birthday' },
  created: { id: 'created', message: 'user.created' },
  facebookUrl: { id: 'facebookUrl', message: 'user.facebook' },
  twitterUrl: { id: 'twitterUrl', message: 'user.twitter' },
  googlePlusUrl: { id: 'googlePlusUrl', message: 'user.google' },
  phoneNumber: { id: 'phoneNumber', message: 'global.phone' },
  points: { id: 'points', message: 'user.points' },
  reviewed: { id: 'reviewed', message: 'user.reviewed' },
  eventOrganizer: { id: 'eventOrganizer', message: 'user.export.eventOrganizer' },
  volunteerCleanup: { id: 'volunteerCleanup', message: 'user.export.volunteerCleanup' },
  image: { id: 'image', message: 'global.image' },
  language: { id: 'language', message: 'user.language' },
  organizations: { id: 'organizations', message: 'user.organizations' },
};
