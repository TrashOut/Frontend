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

export const validate = (values) => {
  const errors = {};

  if (!values.title || values.title === '') {
    errors.title = 'news.validation.nameRequired';
  }

  if (!values.body) {
    errors.body = 'news.validation.bodyRequired';
  }

  const tags = values.tags && values.tags.split(',');
  if (tags) {
    tags.forEach(x => {
      if (/.*[\t\n].*/.test(x)) errors.tags = 'news.validation.tagsInvalid';
    });
  }

  if (!values.language || values.language === '') {
    errors.language = 'news.validation.languageRequired';
  }

  return { ...errors, ...validateImages(values.images) };
};

export const asyncValidate = async (values) => {
  await validateImageRatio(values.images || []);
};

