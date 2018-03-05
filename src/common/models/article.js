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
import marked from 'marked';
import User from './user';
import { Record } from '../transit';

export default class Article extends Record({
  id: '',
  title: '',
  body: '',
  bodyMarkdown: '',
  url: '',
  language: '',
  tags: '',
  userId: '',
  appIosUrl: '',
  appAndroidUrl: '',
  appWindowsUrl: '',
  areaId: '',
  selected: false,
  images: [],
  tagsArray: [],
  prContentVideo: [],
  created: '',
  user: new User(),
  area: new Area(),
}, 'organization') {
  constructor(values, fromForm) {
    if (!values) {
      super({});
      return;
    }
    if (!fromForm) {
      values.user = new User(values.user);
      values.area = new Area(values.area);
    } else {
      values.prContentVideo = (values.prContentVideo || []).map(url => {
        if ((values.oldVideos || []).map(x => x.url).indexOf(url) < 0) return { url };
        return null;
      }).concat((values.oldVideos || []).map(x => {
        if (values.prContentVideo.indexOf(x.url) < 0) return { url: x.url, delete: true, id: x.id };
        return null;
      })).filter(x => x && x.url);

      values.images = (values
        .oldImages || [])
        .map(x => ({
          file: x,
          delete: values.images.filter(y => y.preview === x.preview).length === 0,
          isMain: values.mainImage === x.preview,
          change: x.fromFirebase && x.oldMain !== (values.mainImage === x.preview),
        }))
        .concat((values
          .images || [])
          .filter(x => !x.fromFirebase)
          .map(x => ({
            file: x,
            isMain: values.mainImage === x.preview,
          }))
        );
    }

    super(values);
  }

  toCreate() {
    const result = this.toJS();
    result.body = marked(result.bodyMarkdown);

    delete result.id;
    delete result.appIosUrl;
    delete result.appWindowUrl;
    delete result.appAndroidUrl;
    delete result.selected;
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

    if (result.area) {
      fields.forEach(x => {
        result[x] = result.area[x];
      });
      delete result.area;
    }

    result.oldImages = result.images.map(x => ({ id: x.id, preview: x.fullDownloadUrl, fromFirebase: true, oldMain: x.isMain }));
    result.mainImage = (result.images.filter(x => x.isMain)[0] || {}).fullDownloadUrl;
    result.images = result.oldImages.slice();

    result.oldVideos = result.prContentVideo;
    result.prContentVideo = result.prContentVideo.map(x => x.url);
    return result;
  }
}
