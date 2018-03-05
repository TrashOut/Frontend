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
import { validEmail, validPhone, validUrl, validateImage, validateImageRatio } from '../validations';

export const validateCreate = values => { // eslint-disable-line import/prefer-default-export
  const errors = {};

  if (!values.size) {
    errors.size = 'trash.validation.sizeRequired';
  }
  if (!values.types || !Object.keys(values.types).reduce((prev, cur) => prev || values.types[cur], false)) {
    errors.types = 'collectionPoint.validation.typeRequired';
  }
  if (!values.location || (values.location && (!values.location.lat || !values.location.lng))) {
    errors.location = 'global.validation.locationRequired';
  }

  if (values.email && !validEmail(values.email)) {
    errors.email = 'profile.validation.invalidEmail';
  }

  if (!values.phone) {
    errors.phone = 'global.validation.phoneRequired';
  } else if (!validPhone(values.phone)) {
    errors.phone = 'global.validation.phoneInvalid';
  }

  if (values.url && !validUrl(values.url)) {
    errors.url = 'global.validation.urlInvalid';
  }

  if (values.size === 'scrapyard') {
    if (!values.name) {
      errors.name = 'collectionPoint.validation.nameRequired';
    }
    if (!values.days || !Object.keys(values.days).reduce((prev, cur) => prev || values.days[cur], false)) {
      errors.days = 'collectionPoint.validation.dayRequired';
    }
    if (!values.timeFrom || !values.timeFrom[0]) {
      errors.timeFrom = { 0: 'collectionPoint.validation.timeFromRequired' };
    }
    if (!values.timeTo || !values.timeTo[0]) {
      errors.timeTo = { 0: 'collectionPoint.validation.timeToRequired' };
    }
    if (values.timeFrom && values.timeTo && values.timeFrom[0] && values.timeTo[0] && values.timeFrom[0] > values.timeTo[0]) {
      errors.timeFrom = { 0: 'collectionPoint.validation.timeToMustBeGreater' };
    }
    if (values.timeFrom && values.timeTo && values.timeFrom[1] && values.timeTo[1] && values.timeFrom[1] > values.timeTo[1]) {
      errors.timeFrom = { 1: 'collectionPoint.validation.timeToMustBeGreater' };
    }
    if (values.timeFrom && values.timeTo && values.timeTo[0] && values.timeFrom[1] && values.timeTo[0] > values.timeFrom[1]) {
      errors.timeTo = { 0: 'collectionPoint.validation.timeFromMustBeGreater' };
    }
    if (values.nextHours) {
      const occupiedDays = [];
      errors.nextHours = values.nextHours.reduce((prev, cur) => {
        if (cur === undefined) return prev;
        let currentErrors = {};
        if (!cur || !cur[0] || !cur[0].from) {
          currentErrors = { ...currentErrors, 0: { from: 'global.required' } };
        }
        if (!cur || !cur[0] || !cur[0].to) {
          currentErrors = { ...currentErrors, 0: Object.assign((currentErrors[0] || {}), { to: 'global.required' }) };
        }
        if (cur && cur[1] && (cur[1].from && !cur[1].to)) {
          currentErrors = { ...currentErrors, 1: Object.assign((currentErrors[1] || {}), { to: 'global.required' }) };
        }
        if (cur && cur[1] && (cur[1].to && !cur[1].from)) {
          currentErrors = { ...currentErrors, 1: Object.assign((currentErrors[1] || {}), { to: 'global.required' }) };
        }
        if (cur && cur[0] && cur[0].from && cur[0].to && cur[0].from > cur[0].to) {
          currentErrors = { ...currentErrors, 0: Object.assign((currentErrors[0] || {}), { from: 'collectionPoint.validation.timeToMustBeGreater' }) };
        }
        if (cur && cur[1] && cur[1].from && cur[1].to && cur[1].from > cur[1].to) {
          currentErrors = { ...currentErrors, 1: Object.assign((currentErrors[1] || {}), { from: 'collectionPoint.validation.timeToMustBeGreater' }) };
        }
        if (cur && cur[0] && cur[1] && cur[0].to && cur[1].from && cur[0].to > cur[1].from) {
          currentErrors = { ...currentErrors, 0: Object.assign((currentErrors[0] || {}), { to: 'collectionPoint.validation.timeFromMustBeGreater' }) };
        }
        if (cur && (!cur.day || cur.day === '')) {
          currentErrors = { ...currentErrors, day: 'collectionPoint.validation.chooseDay' };
        } else if (cur && cur.day && occupiedDays.indexOf(cur.day) !== -1) {
          currentErrors = { ...currentErrors, day: 'collectionPoint.validation.dayIsUsed' };
        } else {
          occupiedDays.push(cur.day);
        }
        prev.push(currentErrors);
        return prev;
      }, []);
    }
  }
  return { ...errors, ...validateImage(values.images) };
};

export const asyncValidate = async (values) => {
  await validateImageRatio(values.images || []);
};
