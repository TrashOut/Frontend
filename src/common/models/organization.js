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
import marked from 'marked';
import { Record } from '../transit';

export default class Organization extends Record({
  id: '',
  name: '',
  description: '',
  created: '',
  contactEmail: '',
  contactPhone: '',
  contactTwitter: '',
  contactFacebook: '',
  contactGooglePlus: '',
  contactUrl: '',
  parentId: '',
  mailBody: '',
  mailBodyMarkdown: '',
  mailSubject: '',
  organizationType: {},
  imageId: '',
  image: null,
  gpsId: '',
  activity: '',
  users: '',
  selected: false,
  areaId: null,
  area: null,
  parent: null,
  usersCount: 0,
  statistics: {},
}, 'organization') {
  constructor(values, fromForm) {
    if (fromForm) {
      const createFromForm = (v) => {
        v.image = (v.images && v.images[0]) || v.currentImage;
        return v;
      };

      values = createFromForm(values);
    }

    super(values);
  }


  toCreate() {
    const result = this.toJS();

    result.mailBody = result.mailBodyMarkdown && marked(result.mailBodyMarkdown);
    result.organizationTypeId = '1';

    if (!result.parentId) delete result.parentId;
    if (!result.areaId) delete result.areaId;
    if (!result.image) delete result.image;

    delete result.gpsId;
    delete result.id;
    delete result.created;
    delete result.activity;
    delete result.organizationType;
    delete result.imageId;
    delete result.selected;
    delete result.users;
    delete result.area;
    delete result.parent;
    delete result.usersCount;

    return result;
  }

  toUpdate() {
    const result = this.toCreate();
    result.id = this.get('id');

    return result;
  }

  toForm() {
    const result = this.toJS();
    const fields = ['continent', 'country', 'aa1', 'aa2', 'aa3', 'locality', 'subLocality'];

    result.parentId = result.parentId
      ? parseInt(result.parentId, 10)
      : '';

    if (result.area) {
      fields.forEach(x => {
        result[x] = result.area[x];
      });
      delete result.area;
    }

    result.currentImage = result.image;
    return result;
  }
}
