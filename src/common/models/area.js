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

const getAreaString = (value) => {
  if (value) return `${value}, `;
  return '';
};

export default class Area extends Record({
  id: '',
  centerLat: 0.0,
  centerLong: 0.0,
  type: '',
  continent: '',
  country: '',
  aa1: '',
  aa2: '',
  aa3: '',
  locality: '',
  subLocality: '',
  street: '',
  zip: '',
  zoomLevel: 7,
  aliasId: null,
  stillHere: 0,
  more: 0,
  less: 0,
  cleaned: 0,
  diagonal: 0,
  selected: false,
  aliases: [],
  users: [],
  name: '',
}, 'area') {
  constructor(values) {
    if (!values) {
      super();
      return;
    }
    values.name = ['street', 'locality', 'zip', 'aa1', 'aa2', 'aa3', 'country', 'continent'].reduce((prev, cur) =>
      `${prev}${getAreaString(values[cur])}`, '');
    values.name = values.name.substring(0, values.name.length - 2);

    super({ ...values });
  }
  toForm() {
    const result = this.toJS();
    result.parentId = parseInt(result.parentId, 10);
    return result;
  }
}
