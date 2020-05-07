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
const SuccessMessages = {
  'user-disabled': {
    id: 'users.disabled',
  },
  'create-trash': {
    id: 'trash.create.successs',
    redirect: '/trash-management/detail/{payload[id]}/',
  },
  'create-cp': {
    id: 'collectionPoint.created.success',
    redirect: '/collection-points/detail/{payload[id]}/',
  },
  'signed-in': {
    id: 'user.login.success',
    redirect: '{originalObject[redirect]}',
  },
  'update-trash': {
    id: 'trash.update.success',
    redirect: '/trash-management/detail/{originalObject[id]}/',
  },
  'update-cp': {
    id: 'collectionPoint.update.success',
    redirect: '/collection-points/detail/{originalObject[id]}/',
  },
  'remove-activity': {
    id: 'trash.removeActivity.success',
  },
  'create-comment': {
    id: 'trash.createComment.success',
  },
  'remove-comment': {
    id: 'trash.removeComment.success',
  },
  'remove-image': {
    id: 'global.imageRemoved.success',
  },
  'marked-as-spam': {
    id: 'trash.markedAsSpam.success',
  },
  'cp-marked-as-spam': {
    id: 'collectionPoint.markedAsSpam.success',
  },
  'user-updated': {
    id: 'profile.update.success',
    redirect: '/my-profile/',
  },
  'trash-removed': {
    id: 'trash.delete.success',
    redirect: '/trash-management/list/',
  },
  'cp-removed': {
    id: 'collectionPoint.removed.success',
    redirect: '/collection-points/list/',
  },
  'password-changed': {
    id: 'profile.passwordChanged.success',
    redirect: '/my-profile/',
  },
  'email-changed': {
    id: 'profile.emailChanged.success',
    redirect: '/my-profile/',
  },
  'sign-up': {
    id: 'user.register.success',
    redirect: '/register/succeed/',
  },
  signout: {
    id: 'profile.signedOut.success',
    redirect: '/signin/{originalObject[specificPath]}',
  },
  'forgotten-password': {
    id: 'profile.success.forgottenPasswordSent',
    redirect: '/forgotten-password/success/',
  },
  'update-event': {
    id: 'event.create.saved',
    redirect: '/events/detail/{originalObject[id]}',
  },
  'create-event': {
    id: 'event.created',
    redirect: '/events/detail/{payload[id]}',
  },
  'remove-event': {
    id: 'event.removed.success',
    redirect: '/events/list/',
  },
  'event-joined': {
    id: 'event.joinEventSuccessful',
  },
  'event-join-confirmed': {
    id: 'event.confirmed.success',
    redirect: '/events/detail/{originalObject[id]}',
  },
  'event-feedback': {
    id: 'event.addFeedback.success',
    redirect: '/events/detail/{originalObject[id]}',
  },
  'event-unjoined': {
    id: 'event.unjoined.success',
  },
  'resolve-spam': {
    id: 'spam.resolved.success',
  },
  'delete-spam': {
    id: 'spam.removed.success',
  },
  'user-approved': {
    id: 'user.approved.success',
    redirect: '/notifications/list/',
  },
  'user-not-approved': {
    id: 'user.notApproved.success',
  },
  'organization-updated': {
    id: 'organization.update.success',
    redirect: '/organizations/detail/{originalObject[id]}',
  },
  'organization-created': {
    id: 'organization.create.success',
    redirect: '/organizations/detail/{payload[id]}',
  },
  'organization-removed': {
    id: 'organization.removed.success',
    redirect: '/organizations/list',
  },
  'organization-joined': {
    id: 'organization.join.success',
    redirect: '/organizations/detail/{originalObject[id]}/',
  },
  'organization-leaved': {
    id: 'organization.leave.success',
  },
  'invitations-sent': {
    id: 'organization.invitationSent.success',
    redirect: '../',
  },
  'area-root-set': {
    id: 'geo.rootSet.success',
    redirect: '/geographical-areas/detail/{originalObject[id]}',
  },
  'area-root-unset': {
    id: 'geo.rootUnset.success',
    redirect: '/geographical-areas/detail/{originalObject[id]}',
  },
  'add-manager': {
    id: 'geo.userAdd.success',
    redirect: '/geographical-areas/detail/{originalObject[id]}',
  },
  'remove-manager': {
    id: 'geo.userDelete.success',
  },
  'edit-manager': {
    id: 'geo.managerEdit.success',
  },
  'edit-user-area': {
    id: 'user.editArea.success',
    redirect: '/my-profile/',
  },
  'add-user-to-area': {
    id: 'user.addToArea.success',
    redirect: '/my-profile/',
  },
  'update-article': {
    id: 'news.success.update',
    redirect: '/articles/detail/{originalObject[id]}',
  },
  'remove-article': {
    id: 'news.success.deleted',
    redirect: '/articles/list',
  },
  'create-article': {
    id: 'news.success.created',
    redirect: '/articles/detail/{payload[id]}',
  },
  'remove-user-area': {
    id: 'geo.areaRemove.success',
  },
  'remove-article-photo': {
    id: 'news.success.photo.deleted',
  },
};

export default SuccessMessages;
