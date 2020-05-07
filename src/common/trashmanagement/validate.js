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
import { validateImages, validateImageRatio } from '../validations';

export const validateCreate = values => {
  const errors = {};

  if (!values.trashSize) {
    errors.trashSize = 'trash.validation.sizeRequired';
  }
  if (!values.types || !Object.keys(values.types).reduce((prev, cur) => prev || values.types[cur], false)) {
    errors.types = 'trash.validation.typeRequired';
  }
  if (!values.location || (values.location && (!values.location.lat || !values.location.lng))) {
    errors.location = 'global.validation.locationRequired';
  }

  if (!values.images || values.images.length === 0) {
    errors.images = 'global.validation.imagesRequired';
  }

  return { ...errors, ...validateImages(values.images) };
};

export const asyncValidate = async (values) => {
  await validateImageRatio(values.images || []);
};

export const validateUpdate = values => {
  const errors = {};

  if (!values.trashSize) {
    errors.trashSize = 'trash.validation.sizeRequired';
  }
  if (!values.status) {
    errors.status = 'trash.validation.statusRequired';
  }
  if (!values.types || !Object.keys(values.types).reduce((prev, cur) => prev || values.types[cur], false)) {
    errors.types = 'trash.validation.typeRequired';
  }
  if (!values.images || values.images.length === 0) {
    errors.images = 'global.validation.imagesRequired';
  }

  return { ...errors, ...validateImages(values.images) };
};

export const validateFilter = values => {
  const errors = {};
  if (values.timeBoundaryFrom && values.timeBoundaryTo && values.timeBoundaryFrom > values.timeBoundaryTo) {
    errors.timeBoundaryFrom = 'collectionPoint.validation.timeFromMustBeGreater';
  }
  return errors;
};

export const validateComment = values => {
  const errors = {};

  if (!values.body) {
    errors.body = 'comment.validation.bodyIsRequired';
  }

  return errors;
};
