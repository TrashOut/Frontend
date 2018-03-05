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
import { Record } from '../transit';

export const Cluster = Record({
  geocell: '',
  lat: 0,
  lng: 0,
  counts: {
    stillHere: 0,
    cleaned: 0,
    less: 0,
    more: 0,
  },
  created: new Date(),
}, 'cluster');

export const TrashDetail = Record({
  id: 0,
  images: [],
  activityId: '',
  gps: {
    lat: 0,
    lng: 0,
    accuracy: 0,
    source: '',
  },
  trashSize: '',
  types: [],
  note: '',
  userId: 0,
  userInfo: {},
  anonymous: false,
  cleanedByMe: false,
  accessibility: {
    byCar: false,
    inCave: false,
    underWater: false,
    notForGeneralCleanup: false,
  },
  status: '',
  created: new Date(),
  updateTime: new Date(),
  updateHistory: [],
  url: '',
  events: [],
}, 'trashDetail');

export const TrashUpdateForm = Record({
  types: {},
  trashSize: '',
  accessibility: {},
  id: 0,
  gps: {},
  cleanedByMe: false,
}, 'trashUpdateForm');

export const toForm = (item) => {
  const form = new TrashUpdateForm(item);
  const newForm = form.set('types', item.types.reduce((o, v) => {
    o[v] = true;
    return o;
  }, {}));
  return newForm;
};

