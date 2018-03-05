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
import { validEmail } from '../validations';

export const validateRegister = values => {
  const errors = validatePassword(values);

  if (!values.email) {
    errors.email = 'profile.validation.emailRequired';
  } else if (!validEmail(values.email)) {
    errors.email = 'profile.validation.invalidEmail';
  }

  if (!values.firstName) {
    errors.firstName = 'user.validation.firstNameRequired';
  }

  if (!values.lastName) {
    errors.lastName = 'user.validation.lastNameRequired';
  }

  Object.keys(values).forEach((key) => {
    if (values[key].length > 255) errors[key] = 'global.validation.tooLong';
  });

  return errors;
};

export const validatePassword = values => {
  const errors = {};

  if (!values.password) {
    errors.password = 'profile.validation.passwordRequired';
  } else if (values.password.length < 8) {
    errors.password = 'user.validation.passwordTooShort';
  } else if (values.password.length > 50) {
    errors.password = 'global.validation.passwordTooLong';
  } else if (values.password.search(/\d/) === -1) {
    errors.password = 'user.validation.passwordShouldContain';
  } else if (values.password.search(/[A-Z]/) === -1) {
    errors.password = 'user.validation.passwordShouldContain';
  } else if (values.password.search(/[a-z]/) === -1) {
    errors.password = 'user.validation.passwordShouldContain';
  } else if (values.password !== values.password_validation) {
    errors.password = 'user.validation.passwordsNotMatch';
  }

  return errors;
};

export const validateLogin = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'profile.validation.emailRequired';
  } else if (!validEmail(values.email)) {
    errors.email = 'profile.validation.invalidEmail';
  }
  if (!values.password) {
    errors.password = 'profile.validation.passwordRequired';
  }
  return errors;
};

export const validateForgottenPassword = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'profile.validation.emailRequired';
  } else if (!validEmail(values.email)) {
    errors.email = 'profile.validation.invalidEmail';
  }
  return errors;
};

