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

const objToString = obj =>
  (Object.keys(obj).reduce((prev, cur) =>
    (obj[cur] === true) ? prev.concat([`${cur}`]) : prev,
    [])
  );

const areaOrNull = (name) => (name === 'all' || name === 'select' || !name) ? '' : name;

export class TrashFilter extends Record({
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
  updateNeeded: '',
  timeBoundaryFrom: null,
  timeBoundaryTo: null,
  trashStatus: null,
  trashSize: null,
  trashType: null,
  trashAccessibility: null,
  trashNote: '',
  trashIds: '',
  userIds: '',
  organizationId: '',
  attributesNeeded: 'id,note,status,size,gpsFull,created,images',
  page: 1,
  orderBy: '-id',
  limit: 10,
}, 'trashFilter') {
  constructor(values) {
    if (!values) {
      super(values);
      return;
    }

    const areas = {
      geoAreaAa1: areaOrNull(values.aa1),
      geoAreaAa2: areaOrNull(values.aa2),
      geoAreaAa3: areaOrNull(values.aa3),
      geoAreaContinent: areaOrNull(values.continent),
      geoAreaCountry: areaOrNull(values.country),
      geoAreaLocality: areaOrNull(values.locality),
      geoAreaSubLocality: areaOrNull(values.subLocality),
    };

    super({ ...values, ...areas });
  }

  toFilter(noLimit) {
    const formValues = this.toJS();
    if (formValues.timeBoundaryFrom) formValues.timeBoundaryFrom = formValues.timeBoundaryFrom.toISOString();
    if (formValues.timeBoundaryTo) formValues.timeBoundaryTo = formValues.timeBoundaryTo.toISOString();
    if (formValues.trashStatus) formValues.trashStatus = objToString(formValues.trashStatus).join(',');
    if (formValues.trashSize) formValues.trashSize = objToString(formValues.trashSize).join(',');
    if (formValues.trashType) formValues.trashType = objToString(formValues.trashType).join(',');
    if (formValues.trashAccessibility) formValues.trashAccessibility = objToString(formValues.trashAccessibility).join(',');
    if (typeof formValues.unreviewed === 'boolean') formValues.unreviewed = !formValues.unreviewed;
    // if (typeof formValues.updateNeeded === 'boolean') formValues.updateNeeded = Boolean(formValues.updateNeeded);
    formValues.orderBy = formValues.orderBy.replace('trashSize', 'size');

    if (noLimit) {
      delete formValues.page;
      delete formValues.limit;
    }

    Object.keys(formValues).forEach(x => {
      if (!formValues[x]) delete formValues[x];
    });

    return formValues;
  }
}

export class UserFilter extends Record({
  organizationIds: '',
  limit: 10,
  page: 1,
  areaIds: '',
  minPoints: '',
  maxPoints: '',
  userIds: '',
  orderBy: '',
  reviewed: '',
  emails: '',
}, 'userFilter') {
  constructor(values) {
    if (!values) {
      super({});
      return;
    }

    if (values.areaId) values.areaIds = values.areaId;
    super(values);
  }
  toFilter() {
    const values = this.toJS();
    return values;
  }
}

export class CollectionPointFilter extends Record({
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
  collectionPointSize: '',
  collectionPointType: '',
  colelctionPointNote: '',
  collectionPointIds: '',
  userIds: '',
  attributesNeeded: 'id,types,name,gpsFull,gpsFull,size',
  page: 1,
  orderBy: '',
  limit: 10,
  collectionPointNote: '',
}, 'collectionPointFilter') {
  constructor(values) {
    if (!values) {
      super(values);
      return;
    }

    const areas = {
      geoAreaAa1: areaOrNull(values.aa1),
      geoAreaAa2: areaOrNull(values.aa2),
      geoAreaAa3: areaOrNull(values.aa3),
      geoAreaContinent: areaOrNull(values.continent),
      geoAreaCountry: areaOrNull(values.country),
      geoAreaLocality: areaOrNull(values.locality),
      geoAreaSubLocality: areaOrNull(values.subLocality),
    };

    super({ ...values, ...areas });
  }

  toFilter() {
    const result = this.toJS();
    if (result.collectionPointSize) result.collectionPointSize = objToString(result.collectionPointSize).join(',');
    if (result.collectionPointType) result.collectionPointType = objToString(result.collectionPointType).join(',');
    return result;
  }
}

export class EventFilter extends Record({
  area: '',
  geocells: '',
  geoAreaStreet: '',
  geoAreaZip: '',
  geoAreaCity: '',
  geoAreaAa3: '',
  geoAreaAa2: '',
  geoAreaAa1: '',
  geoAreaCountry: '',
  geoAreaContinent: '',
  spam: '',
  unreviewed: '',
  startFrom: '',
  startTo: '',
  eventDescription: '',
  eventIds: '',
  userPosition: '',
  userIds: '',
  attributesNeeded: 'id,name,gpsFull,gpsShort,duration,start',
  page: 1,
  orderBy: '-start',
  limit: 10,
}, 'eventFilter') {
  constructor(values) {
    if (!values) {
      super(values);
      return;
    }

    const currentDate = new Date();

    if (values.startFrom) {
      values.startFrom.setHours(currentDate.getHours());
      values.startFrom.setMinutes(currentDate.getMinutes());
      values.startFrom.setSeconds(0, 0);
    }

    if (values.startTo) {
      values.startTo.setHours(currentDate.getHours());
      values.startTo.setMinutes(currentDate.getMinutes());
      values.startTo.setSeconds(0, 0);
    }

    const areas = {
      geoAreaAa1: areaOrNull(values.aa1),
      geoAreaAa2: areaOrNull(values.aa2),
      geoAreaAa3: areaOrNull(values.aa3),
      geoAreaContinent: areaOrNull(values.continent),
      geoAreaCountry: areaOrNull(values.country),
      geoAreaLocality: areaOrNull(values.locality),
      geoAreaSubLocality: areaOrNull(values.subLocality),
    };

    super({ ...values, ...areas });
  }
  toFilter(removeLimit) {
    const result = this.toJS();
    if (removeLimit) {
      delete result.page;
      delete result.limit;
    }
    if (result.startFrom) result.startFrom = result.startFrom.toISOString();
    if (result.startTo) result.startTo = result.startTo.toISOString();
    return result;
  }
}

export const NoFilter = Record({
  limit: 10,
  page: 1,
  orderBy: '',
}, 'nofilter');

export const SpamFilter = Record({
  limit: 10,
  page: 1,
  orderBy: '',
  group: 'true',
  type: 'trash',
}, 'spamFilter');

export const OrganizationFilter = Record({
  limit: 10,
  page: 1,
  orderBy: '',
  name: '',
  description: '',
  type: '',
  gpsId: '',
  mailSubject: '',
  mailBody: '',
  contactEmail: '',
  contactPhone: '',
  contactTwitter: '',
  contactFacebook: '',
  contactUrl: '',
  imageId: '',
  parentId: '',
}, 'organizationFilter');


export class ArticleFilter extends Record({
  language: '',
  geoAreaAa1: '',
  geoAreaAa2: '',
  geoAreaAa3: '',
  geoAreaContinent: '',
  geoAreaCountry: '',
  geoAreaLocality: '',
  geoAreaSubLocality: '',
  searchKeyWord: '',
  page: 1,
  limit: 10,
  orderBy: '-created',
}, 'articleFilter') {
  constructor(values) {
    if (!values) {
      super(values);
      return;
    }

    const areas = {
      geoAreaAa1: areaOrNull(values.aa1),
      geoAreaAa2: areaOrNull(values.aa2),
      geoAreaAa3: areaOrNull(values.aa3),
      geoAreaContinent: areaOrNull(values.continent),
      geoAreaCountry: areaOrNull(values.country),
      geoAreaLocality: areaOrNull(values.locality),
      geoAreaSubLocality: areaOrNull(values.subLocality),
    };

    super({ ...values, ...areas });
  }
  toJS() {
    const result = super.toJS();
    return result;
  }
}

export const mapFilterFromForm = (formValues) => {
  let filter = new TrashFilter(formValues);
  if (formValues.trashProperties) filter = filter.set('spam', formValues.trashProperties[0] ? true : null);
  if (formValues.trashProperties) filter = filter.set('unreviewed', formValues.trashProperties[1] ? true : null);
  if (formValues.trashStatus) filter = filter.set('trashStatus', Object.keys(formValues.trashStatus).map(x => (formValues.trashStatus[x] === true) ? `${x}` : '').join(','));
  if (formValues.trashSize) filter = filter.set('trashSize', Object.keys(formValues.trashSize).map(x => (formValues.trashSize[x] === true) ? `${x}` : '').join(','));
  if (formValues.trashType) filter = filter.set('trashType', Object.keys(formValues.trashType).map(x => (formValues.trashType[x] === true) ? `${x}` : '').join(','));
  if (formValues.trashProperties) filter = filter.remove('trashProperties');
  return filter;
};
