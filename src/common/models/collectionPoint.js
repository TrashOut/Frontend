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
import routesList from '../../browser/routesList';
import User from './user';
import { cpCategories } from '../collectionpoints/consts';
import { Record } from '../transit';

const getAreaString = (value) => {
  if (value) return `${value}, `;
  return '';
};

const concatTimes = (firstString, secondString) => `${`0${firstString}`.slice(-2)}${`0${secondString}`.slice(-2)}`;

export default class CollectionPoint extends Record({
  activityId: '',
  area: '',
  collectionPointSize: '',
  email: '',
  events: [],
  id: '',
  images: [],
  lat: '',
  long: '',
  lng: '',
  name: '',
  note: '',
  openingHours: [],
  phone: '',
  selected: false,
  spam: [],
  types: [],
  updateHistory: [],
  updateTime: '',
  url: '',
  userInfo: {},
  userDetail: new User(),
  gps: {},
  currentImage: null,
}, 'collectionPoint') {
  constructor(values, create) {
    if (!values) {
      super();
      return;
    }

    if (values.location) {
      values.lat = values.location.lat;
      values.long = values.location.lng;
    } else if (values.gps) {
      const { lat, long, area: formArea } = values.gps;
      values.lat = lat;
      values.long = long;
      values.lng = long;
      const area = Array.isArray(formArea) ? formArea[0] : formArea;
      if (area) {
        values.area = ['street', 'locality', 'zip', 'country', 'continent'].reduce((prev, cur) =>
          `${prev}${getAreaString(area[cur])}`, '');
        values.area = values.area.substring(0, values.area.length - 2);
      }
    }

    if (values.userDetail) {
      values.userDetail = new User(values.userDetail);
    }

    if (values.size) {
      values.collectionPointSize = values.size;
    }

    if (create) {
      values.openingHours = [];
      if (values.size === 'scrapyard') {
        const days = (values.days && Object.keys(values.days).reduce((prev, cur) =>
          (values.days[cur])
            ? prev.concat(cur)
            : prev, [])) || [];

        const nextDays = (values.nextHours && values.nextHours.reduce((prev, cur) => {
          prev[cur.day] = cur;
          return prev;
        }, {})) || {};

        values.openingHours = days.reduce((prev, cur) => {
          const day = {};
          day[cur] = [];
          if (nextDays[cur]) {
            const formDay = nextDays[cur];
            if (formDay[0] && formDay[0].from && formDay[0].to) {
              day[cur].push({
                Start: concatTimes(formDay[0].from.getHours(), formDay[0].from.getMinutes()),
                Finish: concatTimes(formDay[0].to.getHours(), formDay[0].to.getMinutes()),
              });
            }
            if (formDay[1] && formDay[1].from && formDay[1].to) {
              day[cur].push({
                Start: concatTimes(formDay[1].from.getHours(), formDay[1].from.getMinutes()),
                Finish: concatTimes(formDay[1].to.getHours(), formDay[1].to.getMinutes()),
              });
            }
          } else {
            if (values.timeFrom[0]) {
              day[cur].push({
                Start: concatTimes(values.timeFrom[0].getHours(), values.timeFrom[0].getMinutes()),
                Finish: concatTimes(values.timeTo[0].getHours(), values.timeTo[0].getMinutes()),
              });
            }
            if (values.timeFrom[1]) {
              day[cur].push({
                Start: concatTimes(values.timeFrom[1].getHours(), values.timeFrom[1].getMinutes()),
                Finish: concatTimes(values.timeTo[1].getHours(), values.timeTo[1].getMinutes()),
              });
            }
          }
          prev.push(day);
          return prev;
        }, []);
      }
    }

    super({ ...values, collectionPointSize: (values.collectionPointSize || values.size || '') });
  }
  toCreate() {
    const result = this.toJS();

    result.gps = {
      lat: result.lat,
      long: result.long || result.lng,
      source: 'network',
      accuracy: 0,
    };

    return {
      email: result.email,
      gps: result.gps,
      images: result.images,
      name: result.name,
      note: result.note,
      openingHours: result.openingHours || [],
      phone: result.phone,
      url: result.url,
      size: result.collectionPointSize,
      types: Object.keys(result.types).reduce((prev, cur) => {
        if (result.types[cur] === true) prev.push(cur);
        return prev;
      }, []),
    };
  }
  toUpdate() {
    const result = this.toCreate();
    result.id = this.id;
    if (result.images.length === 0) {
      result.images = [];
      result.images.push(this.get('currentImage'));
    }

    return result;
  }

  getOpeningHour = (obj) => obj[Object.keys(obj)[0]];

  createTime = (time) => {
    if (!time) return new Date();
    time = time.toString();
    const minutes = time.substring(2, 4);
    const hours = time.substring(0, 2);
    const result = new Date();
    result.setHours(parseInt(hours, 10));
    result.setMinutes(parseInt(minutes, 10));
    return result;
  }

  toMap(selected) {
    return ({
      id: this.id,
      lat: this.lat,
      long: this.long,
      label: `${this.area}`,
      selected,
    });
  }

  toExport(attributesNeeded) {
    const result = {};

    const getFromArea = (attribute, key) => {
      if (((this.gps || {}).area || [])[0]) return this.gps.area[0][key];
      return null;
    };

    const getFromGPS = (attribute, key) => {
      if (this.gps) return this.gps[key];
      return null;
    };

    const getFirstImage = () => ((this.images || [])[0] || {}).fullDownloadUrl;

    attributesNeeded.forEach(x => {
      switch (x) {
        case 'size':
          result[x] = this.collectionPointSize;
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
        case 'trashoutUrl':
          result[x] = `https://admin.trashout.ngo${routesList.collectionPointDetail.replace(':id', this.id)}`;
          return;
        default:
          result[x] = this.get(x);
          return;
      }
    });
    return result;
  }

  toForm() {
    const result = this.toJS();
    result.size = result.collectionPointSize;
    result.types = result.types.reduce((prev, key) => {
      prev[key] = true;
      return prev;
    }, {});
    result.location = { lat: parseFloat(result.lat), lng: parseFloat(result.long) };
    if (result.openingHours && result.size === 'scrapyard') {
      result.days = (result.openingHours && result.openingHours.reduce((prev, cur) => {
        prev[Object.keys(cur)[0]] = true;
        return prev;
      }, {})) || {};
      const hoursOccupation = {};

      result.openingHours.forEach((x) => {
        const occup = hoursOccupation[JSON.stringify(this.getOpeningHour(x))];
        if (occup) {
          occup.count += 1;
        } else {
          hoursOccupation[JSON.stringify(this.getOpeningHour(x))] = {
            count: 1,
            object: this.getOpeningHour(x),
            day: Object.keys(x)[0],
          };
        }
      });

      const biggestCandidate = Object.keys(hoursOccupation).reduce((prev, cur) => {
        if (prev === null) {
          return hoursOccupation[cur];
        }
        if (prev.count < hoursOccupation[cur].count) return hoursOccupation[cur];
        return prev;
      }, null);

      if (biggestCandidate) {
        const biggest = biggestCandidate && biggestCandidate.object;

        result.timeFrom = {};
        result.timeTo = {};

        if (biggest[0]) result.timeFrom[0] = this.createTime(biggest[0].Start);
        if (biggest[1]) result.timeFrom[1] = this.createTime(biggest[1].Start);
        if (biggest[0]) result.timeTo[0] = this.createTime(biggest[0].Finish);
        if (biggest[1]) result.timeTo[1] = this.createTime(biggest[1].Finish);

        let i = 0;
        result.nextHours = [];
        Object.keys(hoursOccupation).forEach((x) => {
          const object = hoursOccupation[x].object;
          if (object !== biggest) {
            result.nextHours[i] = {};
            result.nextHours[i].day = hoursOccupation[x].day;
            result.nextHours[i][0] = {};
            result.nextHours[i][1] = {};
            result.nextHours[i][0].from = object[0] && this.createTime(object[0].Start);
            result.nextHours[i][1].from = object[1] && this.createTime(object[1].Start);
            result.nextHours[i][0].to = object[0] && this.createTime(object[0].Finish);
            result.nextHours[i][1].to = object[1] && this.createTime(object[1].Finish);
            i += 1;
          }
        });
      }
    }
    result.currentImage = result.images[0];
    result.categories = Object.keys(result.types)
      .filter(x => cpCategories[x] && cpCategories[x].selectable)
      .reduce((prev, cur) => {
        prev[cur] = true;
        return prev;
      }, {});

    delete result.area;
    delete result.collectionPointSize;
    delete result.events;
    delete result.images;
    delete result.lat;
    delete result.long;
    delete result.selected;
    delete result.updateHistory;
    delete result.userInfo;
    return result;
  }
}
