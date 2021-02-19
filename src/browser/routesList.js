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
export default {
  base: '/',
  collectionPointCreate: '/collection-points/create/',
  collectionPointDetail: '/collection-points/detail/:id',
  collectionPointExport: '/collection-points/list/export/',
  collectionPointList: '/collection-points/list/',
  collectionPointMap: '/collection-points/map/',
  collectionPointBase: '/collection-points/',
  collectionPointUpdate: '/collection-points/update/:id',
  eventCreate: '/events/create/',
  eventDetail: '/events/detail/:id/',
  eventConfirm: '/events/detail/:id/confirm/',
  eventFeedback: '/events/detail/:id/feedback/',
  eventExport: '/events/list/export/',
  eventList: '/events/list/',
  eventUpdate: '/events/update/:id',
  notificationDetail: '/notifications/detail/:id',
  notificationExport: '/notifications/list/export/',
  notificationList: '/notifications/list/',
  organizationsCreate: '/organizations/create/',
  organizationsDetail: '/organizations/detail/:id/',
  organizationsExport: '/organizations/list/export/',
  organizationsList: '/organizations/list/',
  organizationsUpdate: '/organizations/update/:id',
  organizationsAddArea: '/organizations/detail/:id/add-area',
  organizationsEditArea: '/organizations/detail/:organizationId/edit-area/:id/',
  organizationsInvitations: '/organizations/detail/:id/invite/',
  organizationsManagers: '/organizations/detail/:id/managers/',
  organizationsEditMember: '/organizations/detail/:id/edit-member/:userId/:val',
  trashCreate: '/trash-management/create/',
  trashDetail: '/trash-management/detail/:id',
  trashExport: '/trash-management/list/export/',
  trashList: '/trash-management/list/',
  trashMap: '/trash-management/map/',
  trashBase: '/trash-management/',
  userTrashList: '/trash-management/list/user-stats/',
  trashUpdate: '/trash-management/update/:id',
  commentCreate: '/trash-management/comment-create/:id',
  userDetail: '/users/detail/:id',
  userExport: '/users/list/export/',
  userList: '/users/list/',
  userAddArea: '/my-profile/add-area/',
  userEditArea: '/my-profile/edit-area/:id/',
  userChangeEmail: '/my-profile/edit/change-email/',
  login: '/signin/',
  forgottenPassword: '/forgotten-password/',
  forgottenPasswordSuccess: '/forgotten-password/success/',
  register: '/register/',
  registered: '/register/succeed/',
  myProfile: '/my-profile/',
  verifyEmail: '/signin/verify-email',
  changePassword: '/my-profile/change-password/',
  editProfile: '/my-profile/edit/',
  eventBase: '/events/',
  organizationsBase: '/organizations/',
  userBase: '/users/',
  notificationBase: '/notifications/',
  areaBase: '/geographical-areas',
  areaDetail: '/geographical-areas/detail/:id',
  areaAddAlias: '/geographical-areas/detail/:id/add-alias/',
  articleBase: '/articles/',
  articleList: '/articles/list',
  articleDetail: '/articles/detail/:id',
  articleCreate: '/articles/create/',
  articleUpdate: '/articles/update/:id',
  areaAddManager: '/geographical-areas/detail/:id/add-manager/',
  areaAddAdmin: '/geographical-areas/detail/:id/add-admin/',
  areaChooseArea: '/geographical-areas/:id/choose',
  notificationUserDetail: '/notifications/user-detail/:id',
  generateApiKey: '/my-profile/apikey/',
  generateApiKeyForWidget: '/my-profile/generate-widget/apikey/',
  generateWidget: '/my-profile/generate-widget/',
  userDisabled: '/signin/disabled/',
  userActivated: '/signin/email-verified/',
  unauthorized: '/unauthorized',
  notFound: '/not-found',
  signout: '/signout',
};
