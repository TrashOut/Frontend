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
import { validEmail, validPhone, validUrl, validFacebook, validTwitter, validateImage } from '../validations';

const validate = values => {
  const errors = {};

  if (values.info && values.info.length > 180) {
    errors.info = 'global.validation.noteTooLong';
  }

  if (values.phoneNumber && !validPhone(values.phoneNumber)) {
    errors.phoneNumber = 'global.validation.phoneInvalid';
  }

  if (values.googlePlusUrl && !validUrl(values.googlePlusUrl)) {
    errors.googlePlusUrl = 'global.validation.invalidgooglePlusUrl';
  }

  if (values.twitterUrl && !validTwitter(values.twitterUrl)) {
    errors.twitterUrl = 'global.validation.invalidtwitterUrl';
  }

  if (values.facebookUrl && !validFacebook(values.facebookUrl)) {
    errors.facebookUrl = 'global.validation.invalidfacebookUrl';
  }

  return { ...errors, ...validateImage(values.fileToCrop, 'fileToCrop') };
};

export const validateEmail = values => {
  const { email } = values;
  const errors = {};

  if (!email) {
    errors.email = 'profile.validation.emailRequired';
  } else if (!validEmail(email)) {
    errors.email = 'profile.validation.invalidEmail';
  }

  return errors;
};

export const validateUserEmail = values => {
  const { managerEmail, managers } = values;
  const errors = {};

  if (Object.keys(managers || {}).length) {
    return {};
  }

  if (!managerEmail) {
    errors.managerEmail = 'profile.validation.emailRequired';
  } else if (!validEmail(managerEmail)) {
    errors.email = 'profile.validation.invalidEmail';
  }

  return errors;
};

export const validateWidget = values => {
  const errors = {};

  if (!values.type) {
    errors.type = 'profile.widget.validation.typeNeeded';
  }

  if (values.height && !/[0-9]{1,4}[ ]{0,1}(px|em|%)/.test(values.height)) {
    errors.height = 'profile.widget.validation.heightFormat';
  }

  if (values.width && !/[0-9]{1,4}[ ]{0,1}(px|em|%)/.test(values.width)) {
    errors.width = 'profile.widget.validation.widthFormat';
  }

  if (!values.language) {
    errors.language = 'profile.widget.languageNeeded';
  }

  if (values.type === 'trashDetail' || values.type === 'eventDetail') {
    if (!values.id) {
      errors.id = 'profile.widget.idNeeded';
    }
  }

  return errors;
};

export default validate;
