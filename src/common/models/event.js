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
import geolib from 'geolib';
import moment from 'moment';
import { getPointsBound } from '../events/helper';
import { Record } from '../transit';
import Area from '../models/area';

export default class Event extends Record({
  action: '',
  bring: '',
  childFriendly: true,
  cleaningArea: null,
  collectionPointIds: [],
  collectionPoints: [],
  contact: {},
  description: '',
  distance: 0,
  duration: 0,
  end: null,
  googleAddress: {},
  gps: {},
  have: '',
  id: '',
  images: [],
  lat: 0,
  long: 0,
  name: '',
  selected: false,
  start: null,
  startWithTimeZone: null,
  trashPointIds: {},
  trashPoints: [],
  userId: 0,
  users: [],
}, 'event') {
  constructor(values) {
    if (!values) {
      super({});
      return;
    }

    if (values.location) {
      values.lat = values.location.lat;
      values.long = values.location.lng;
    }

    if (values.gps) {
      const { lat, lng, long, area } = values.gps;
      values.lat = lat;
      values.long = lng || long;
      values.gps.area = new Area((area && (area[0] || area)) || {});
    }

    if (values.trashPoints) {
      values.trashPointIds = values.trashPoints.reduce((prev, cur) => {
        prev[parseInt(cur.id, 10)] = true;
        return prev;
      }, {});
    }

    if (!values.cleaningArea) {
      values.cleaningArea = getPointsBound(values.trashPoints);
    }

    if (values.cleaningArea && values.cleaningArea.bottomRight && values.cleaningArea.upperLeft) {
      values.cleaningArea = {
        south: parseFloat(values.cleaningArea.bottomRight.lat),
        east: parseFloat(values.cleaningArea.bottomRight.long),
        west: parseFloat(values.cleaningArea.upperLeft.long),
        north: parseFloat(values.cleaningArea.upperLeft.lat),
      };

      const { east, south, north, west } = values.cleaningArea;
      const p1 = {
        latitude: north,
        longitude: east,
      };
      const p2 = {
        latitude: south,
        longitude: west,
      };

      values.distance = geolib.getDistance(p1, p2);
    }

    if (values.startWithTimeZone && values.duration) {
      const start = moment(values.startWithTimeZone).toDate().toString();
      const end = moment(start).add(values.duration, 'minutes').toDate().toString();

      values.start = {
        date: start,
        time: start,
      };

      values.end = {
        date: end,
        time: end,
      };
    }

    super(values);
  }

  toCreate() {
    const result = this.toJS();

    result.gps = {
      lat: result.lat,
      long: result.long,
      accuracy: 50,
      source: 'network',
    };

    const { north, east, west, south } = result.cleaningArea;
    result.cleaningArea = {
      upperLeft: {
        lat: north,
        long: west,
        accuracy: 50,
        source: 'network',
      },
      bottomRight: {
        lat: south,
        long: east,
        accuracy: 50,
        source: 'network',
      },
    };

    const { date: startDate, time: startTime } = result.start;
    startDate.setHours(startTime.getHours());
    startDate.setMinutes(startTime.getMinutes());
    result.start = startDate;

    const { date: endDate, time: endTime } = result.end;
    endDate.setHours(endTime.getHours());
    endDate.setMinutes(endTime.getMinutes());

    result.duration = moment(endDate).diff(startDate, 'minutes');

    result.trashPointIds = Object.keys(result.trashPointIds).reduce((prev, cur) => {
      if (result.trashPointIds[cur] === true) prev.push(parseInt(cur, 10));
      return prev;
    }, []);

    result.collectionPointIds = Object.keys(result.collectionPointIds).reduce((prev, cur) => {
      if (result.collectionPointIds[cur] === true) prev.push(parseInt(cur, 10));
      return prev;
    }, []);

    delete result.lat;
    delete result.long;
    delete result.selected;
    delete result.distance;
    delete result.googleAddress;
    delete result.end;
    delete result.action;

    return result;
  }

  toUpdate() {
    const result = this.toCreate();
    result.id = this.get('id');
    delete result.trashPoints;
    delete result.collectionPoints;
    return result;
  }

  toForm() {
    const result = this.toJS();

    const form = {
      id: result.id,
      contact: result.contact,
      childFriendly: result.childFriendly,
      bring: result.bring,
      have: result.have,
      duration: result.duration,
      end: result.end,
      start: result.start,
      cleaningArea: result.cleaningArea,
      name: result.name,
      trashPointIds: result.trashPointIds,
      collectionPointIds: result.collectionPointIds,
      description: result.description,
      gps: {
        lat: parseFloat(result.gps.lat),
        lng: parseFloat(result.gps.long),
      },
    };

    return form;
  }
}
