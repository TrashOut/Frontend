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
import User from './user';
import { Record } from '../transit';
import { trashStatuses } from '../trashmanagement/consts';

const getAreaString = (value) => {
  if (value) return `${value}, `;
  return '';
};

export default class Trash extends Record({
  accessibility: {},
  accuracy: '',
  activity: [],
  activityId: 0,
  anonymous: false,
  area: '',
  created: new Date(),
  id: '',
  events: [],
  images: [],
  lat: '',
  lng: '',
  note: '',
  selected: false,
  spam: [],
  status: '',
  trashSize: '0',
  types: {},
  updateHistory: [],
  updateTime: '',
  userDetail: new User(),
  userInfo: {},
  organizationId: null,
  organization: null,
  updateNeeded: 0,
  gps: {},
  cleanedByMe: false,
  url: '',
  comments: [],
}, 'trash') {
  constructor(values) {
    if (!values) {
      super();
      return;
    }
    if (values.location) {
      values.lat = values.location.lat;
      values.lng = values.location.lng;
    }
    if (values.gps) {
      const { lat, long, area: areaForm } = values.gps;
      values.lat = lat;
      values.lng = long;
      const area = Array.isArray(areaForm) ? areaForm[0] : areaForm;
      if (area) {
        values.area = ['street', 'locality', 'zip', 'country', 'continent'].reduce((prev, cur) =>
          `${prev}${getAreaString(area[cur])}`, '');
        values.area = values.area.substring(0, values.area.length - 2);
      }
    }
    if (values.userDetail) {
      values.userDetail = new User(values.userDetail);
    }
    if (values.organizationId) {
      if (values.organizationId === '0') {
        values.anonymous = true;
        values.organizationId = null;
      } else {
        values.organizationId = parseInt(values.organizationId);
      }
    }
    if (Array.isArray(values.updateHistory)) {
      values.updateHistory = values.updateHistory.reverse();
    }

    super({ ...values, trashSize: (values.size ? values.size : values.trashSize) });
  }

  toCreate() {
    const result = this.toJS();

    result.gps = {
      lat: result.lat,
      long: result.lng,
      source: 'network',
      accuracy: '500',
    };

    return {
      images: result.images,
      size: result.trashSize,
      gps: result.gps,
      note: result.note,
      types: Object.keys(result.types).reduce((prev, cur) => {
        if (result.types[cur] === true) prev.push(cur);
        return prev;
      }, []),
      anonymous: (result.anonymous === true),
      organizationId: result.organizationId,
      accessibility: result.accessibility,
    };
  }
  toUpdate() {
    const result = this.toJS();

    result.gps = {
      lat: result.lat,
      long: result.lng,
      source: 'wifi',
      accuracy: 50,
    };

    return {
      images: result.images,
      size: result.trashSize,
      id: result.id,
      status: result.status,
      note: result.note,
      types: Object.keys(result.types).reduce((prev, cur) => {
        if (result.types[cur] === true) prev.push(cur);
        return prev;
      }, []),
      anonymous: result.anonymous.anonymous === true,
      accessibility: result.accessibility,
      gps: result.gps,
      cleanedByMe: result.status === trashStatuses.cleaned.id && result.cleanedByMe.cleanedByMe === true,
    };
  }

  toMap(selected, isText = true) {
    return ({
      id: this.id,
      lat: this.lat,
      long: this.lng,
      name: `${this.id} - ${this.area}`,
      isText,
      selected,
    });
  }

  toExport(attributesNeeded) {
    const result = {};

    const getFromArea = (attribute, key) => {
      if ((this.gps || {}).area) return this.gps.area[key];
      return null;
    };

    const getFromGPS = (attribute, key) => {
      if (this.gps) return this.gps[key];
      return null;
    };

    const getFromAccessibility = () =>
      Object.keys(this.accessibility).reduce((acc, cur) => {
        const curValue = this.accessibility[cur];
        if (curValue) return acc.concat([cur]);
        return acc;
      }, []).join(', ');

    const getFirstImage = () => ((this.images || [])[0] || {}).fullDownloadUrl;

    attributesNeeded.forEach(x => {
      switch (x) {
        case 'size':
          result[x] = this.trashSize;
          return;
        case 'latitude':
          result[x] = getFromGPS(x, 'lat');
          return;
        case 'longitude':
          result[x] = getFromGPS(x, 'long');
          return;
        case 'continent':
          result[x] = getFromArea(x, 'continent');
          return;
        case 'country':
          result[x] = getFromArea(x, 'country');
          return;
        case 'aa1':
          result[x] = getFromArea(x, 'aa1');
          return;
        case 'aa2':
          result[x] = getFromArea(x, 'aa2');
          return;
        case 'aa3':
          result[x] = getFromArea(x, 'aa3');
          return;
        case 'locality':
          result[x] = getFromArea(x, 'locality');
          return;
        case 'subLocality':
          result[x] = getFromArea(x, 'subLocality');
          return;
        case 'image':
          result[x] = getFirstImage();
          return;
        case 'accessibility':
          result[x] = getFromAccessibility();
          return;
        case 'updateNeeded':
          result[x] = Boolean(this.updateNeeded);
          return;
        default:
          result[x] = this.get(x);
          return;
      }
    });
    return result;
  }
}
