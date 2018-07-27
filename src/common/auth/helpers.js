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
export const roles = {
  superAdmin: 1,
  admin: 2,
  manager: 3,
  authenticated: 4,
};

export const areaRoles = {
  admin: 1,
  manager: 2,
  user: 3,
};

export const organizationRoles = {
  manager: 1,
  member: 2,
};

export const hasAuthorization = (role, roleId = 4, exactRole = false) => {
  if (!role) return true;
  const selectedRoleId = roles[role];
  return exactRole ? (roleId === selectedRoleId) : (roleId <= selectedRoleId);
};

export const hasAreaAuthorization = (userAreas, area, role, exactRole = false) =>
  userAreas.reduce((prev, { userAreaRoleId, area: curArea }) => {
    if (prev) return prev;
    const userArea = curArea[curArea.type];
    if (!area || userArea !== area[curArea.type]) return false;

    const selectedRoleId = areaRoles[role];
    return exactRole
      ? (userAreaRoleId === selectedRoleId)
      : (userAreaRoleId <= selectedRoleId);
  }, false);

export const hasEventAuthorization = (user, event) => user.id === parseInt(event.userId, 10);

export const hasOrganizationAuthorization = (user, organization, roleId) => {
  const o = user.organizations.filter(x => x.id === organization.id)[0];
  if (!o) return null;

  const organizationRoleId = o.organizationRoleId || organizationRoles.member;
  return parseInt(organizationRoleId, 10) <= organizationRoles[roleId];
};

export const hasArticleAuthorization = (user, article) =>
  (user.id === article.userId && user.userRoleId === roles.manager) || user.userRoleId < 3;
