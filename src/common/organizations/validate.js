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
import { validEmail, validPhone, validUrl, validFacebook, validTwitter, validateImage, validateImageRatio } from '../validations';


export const validateCreate = (values) => {
  const errors = {};
  if (!values.name || values.name.length === 0) {
    errors.name = 'organizations.validation.name';
  }

  if (values.contactPhone && !validPhone(values.contactPhone)) {
    errors.contactPhone = 'global.validation.phoneInvalid';
  }

  if (values.contactGooglePlus && !validUrl(values.contactGooglePlus)) {
    errors.contactGooglePlus = 'global.validation.invalidgooglePlusUrl';
  }

  if (values.contactUrl && !validUrl(values.contactUrl)) {
    errors.contactUrl = 'global.validation.invalidUrl';
  }

  if (values.contactTwitter && !validTwitter(values.contactTwitter)) {
    errors.contactTwitter = 'global.validation.invalidtwitterUrl';
  }

  if (values.contactFacebook && !validFacebook(values.contactFacebook)) {
    errors.contactFacebook = 'global.validation.invalidfacebookUrl';
  }

  if (!values.contactEmail) {
    errors.contactEmail = 'profile.validation.emailRequired';
  } else if (!validEmail(values.contactEmail)) {
    errors.contactEmail = 'profile.validation.invalidEmail';
  }

  return { ...errors, ...validateImage(values.images) };
};

export const asyncValidate = async (values) => {
  await validateImageRatio(values.images || []);
};

export const validateInvitation = (values) => {
  const errors = {};
  if (!values.file && !values.text) {
    errors.text = 'global.oneOfRequired';
    errors.file = 'global.oneOfRequired';
  }
  if (values.text) {
    const emails = values.text.replace(/[ \t]/g, '').replace(/[\n]/g, ',').split(',');
    emails.forEach(email => {
      if (!validEmail(email)) {
        errors.text = 'profile.validation.invalidEmail';
      }
    });
  }
  return errors;
};

export const validateManager = (values) => {
  const errors = {};
  if (Object.keys(values.managers || {}).length === 0) {
    errors.managerEmail = 'profile.validation.emailRequired';
  }

  return errors;
};
