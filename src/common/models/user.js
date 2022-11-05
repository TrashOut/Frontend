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
import Area from './area';
import { Record } from '../transit';

const mapLanguages = {
  en_US: 'en',
  cs_CZ: 'cs',
  de_DE: 'de',
  es_ES: 'es',
  sk_SK: 'sk',
  ru_RU: 'ru',
  pt_AU: 'pt',
  it_AU: 'it',
  hu_AU: 'hu',
  fr_AU: 'fr',
  ro_RO: 'ro',
  ka_GE: 'ka',
};

const getKey = (obj, val) => Object.keys(obj).find(key => obj[key] === val);

export default class User extends Record({
  active: false,
  areas: [],
  activity: [],
  areaId: '',
  badges: [],
  birthdate: null,
  created: '',
  confirmed: false,
  displayName: '',
  email: '',
  eventOrganizer: '',
  events: [],
  facebookUrl: '',
  firstName: '',
  googlePlusUrl: '',
  id: '',
  image: {},
  imageId: '',
  info: '',
  isSocialLogin: false,
  lastName: '',
  organizationRoleId: '',
  organizations: [],
  phoneNumber: '',
  photoURL: '',
  points: '',
  reviewed: '',
  selected: '',
  token: '',
  tokenFCM: '',
  twitterUrl: '',
  uid: '',
  userHasArea: [],
  userRole: {},
  userRoleId: '',
  stats: {},
  volunteerCleanup: false,
  trashActivityEmailNotification: true,
  language: null,
}, 'user') {
  constructor(values, fromForm) {
    if (!values) {
      super();
    } else {
      const { userRoleId, userRole } = values;
      const mapping = {
        4: 1,
        1: 2,
        2: 3,
        3: 4,
      };
      values.userRoleId = (userRoleId && mapping[userRoleId]) || (userRole || {}).id;
      values.birthdate = new Date(values.birthdate);
      values.displayName = [values.firstName, values.lastName].join(' ');
      values.areas = values.areas && values.areas.map(x => x.toJS ? x : new Area(x));

      if (fromForm) {
        values.language = getKey(mapLanguages, values.language) || '';
      } else {
        values.language = mapLanguages[values.language];
      }

      super(values);
    }
  }

  toDetail() {
    const obj = this.toJS();
    obj.fullName = `${(!obj.firstName) ? '' : obj.firstName} ${(!obj.lastName) ? '' : obj.lastName}`;
    return obj;
  }

  toUpdate() {
    const obj = this.toJS();
    if (!obj.image || obj.image.hasOwnProperty('fullDownloadUrl')) delete obj.image; // eslint-disable-line no-prototype-builtins

    const tmpDate = obj.birthdate;
    obj.birthdate = tmpDate && new Date(Date.UTC(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate()));

    delete obj.active;
    delete obj.areaId;
    delete obj.created;
    delete obj.imageId;
    delete obj.photoURL;
    delete obj.selected;
    delete obj.token;
    delete obj.userHasBadge;
    delete obj.organizations;
    delete obj.userRole;
    delete obj.userRoleId;
    delete obj.userHasArea;
    delete obj.tokenFCM;
    delete obj.reviewed;
    delete obj.points;
    delete obj.isSocialLogin;
    delete obj.events;
    delete obj.badges;
    delete obj.activity;
    delete obj.organizationRoleId;

    // const res = Object.keys(obj).reduce((prev, cur) => {
    //   const prop = obj[cur];
    //   if (!(prop === '' || prop === null || prop === undefined)) prev[cur] = prop;
    //   return prev;
    // }, {});

    return obj;
  }

  toExport(attributesNeeded) {
    const result = {};

    attributesNeeded.forEach(x => {
      switch (x) {
        case 'image':
          result[x] = (this.image || {}).fullDownloadUrl;
          return;
        case 'organizations':
          result[x] = this.organizations.map(x => x.name).join(',');
          return;
        default:
          result[x] = this.get(x);
          return;
      }
    });
    return result;
  }
}
