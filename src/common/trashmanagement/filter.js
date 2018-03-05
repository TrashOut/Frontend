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

export default class Filter extends Record({
  area: '',
  geoAreaSubLocality: '',
  geoAreaZip: '',
  geoAreaLocality: '',
  geoAreaAa3: '',
  geoAreaAa2: '',
  geoAreaAa1: '',
  geoAreaCountry: '',
  geoAreaContinent: '',
  spam: '',
  unreviewed: '',
  timeBoundaryFrom: '',
  timeBoundaryTo: '',
  trashStatus: '',
  trashSize: '',
  trashType: '',
  trashAccesibility: '',
  trashNote: '',
  trashIds: '',
  userIds: '',
  attributesNeeded: 'id,note,status,size,gpsShort',
  page: 1,
  orderBy: '+id',
  limit: 10,
}, 'myFilter') {
  constructor(values) {
    if (!values) {
      super(values);
      return;
    }

    const areas = {
      geoAreaAa1: values.aa1,
      geoAreaAa2: values.aa2,
      geoAreaAa3: values.aa3,
      geoAreaContinent: values.continent,
      geoAreaCountry: values.country,
      geoAreaLocality: values.locality,
      geoAreaSubLocality: values.subLocality,
    };

    super({ ...values, ...areas });
  }
}

