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
import { validEmail, validPhone, validateImages, validateImageRatio } from '../validations';

export const validateCreate = values => { // eslint-disable-line import/prefer-default-export
  const errors = {};

  if (!values.name) {
    errors.name = 'event.validation.nameRequired';
  }

  if (!values.cleaningArea) {
    errors.cleaningArea = 'event.validation.areaRequired';
  }

  errors.start = {};
  errors.end = {};

  if (!values.start || !values.start.date) {
    errors.start.date = 'event.validation.startDateRequired';
  }
  if (!values.start || !values.start.time) {
    errors.start.time = 'event.validation.startTimeRequired';
  }

  if (!values.end || !values.end.date) {
    errors.end.date = 'event.validation.endDateRequired';
  }
  if (!values.end || !values.end.time) {
    errors.end.time = 'event.validation.endTimeRequired';
  }

  if ((values.start || {}).date && (values.end || {}).date) {
    const { date: startDate, time: startTime } = values.start;
    const { date: endDate, time: endTime } = values.end;

    const getFullTime = (date, time) => {
      date.setHours(time ? time.getHours() : 0);
      date.setMinutes(time ? time.getMinutes() : 0);
      date.setSeconds(0, 0);
      return date;
    };

    if (getFullTime(startDate).getTime() > getFullTime(endDate).getTime()) {
      errors.start.date = 'event.validation.eventShouldEndAfterStartDate';
      errors.end.date = errors.start.date;
    } else if (startDate.getTime() === endDate.getTime() && startTime && endTime) {
      if (getFullTime(startDate, startTime) >= getFullTime(endDate, endTime)) {
        errors.start.time = 'event.validation.eventShouldEndAfterStartTime';
        errors.end.time = errors.start.time;
      }
    }
  }

  errors.contact = {};
  if (!values.contact || !values.contact.email) {
    errors.contact.email = 'profile.validation.emailRequired';
  } else if (!validEmail(values.contact.email)) {
    errors.contact.email = 'profile.validation.invalidEmail';
  }

  if (!values.contact || !values.contact.phone) {
    errors.contact.phone = 'global.validation.phoneRequired';
  } else if (!validPhone(values.contact.phone)) {
    errors.contact.phone = 'global.validation.phoneInvalid';
  }

  if (!values.contact || !values.contact.name) {
    errors.contact.name = 'event.validation.nameRequired';
  }
  return errors;
};

export const validateFeedback = (values) => {
  const errors = {};
  const regex = /^([1-9]\d*|0)$/;

  if (!regex.test(values.feedbackGuessGuestCount)) errors.feedbackGuessGuestCount = 'event.feedback.integerRequired';
  if (!regex.test(values.feedbackGuessTrashCount)) errors.feedbackGuessTrashCount = 'event.feedback.integerRequired';

  if (!values.feedbackGuessGuestCount) errors.feedbackGuessGuestCount = 'event.feedbackGuessGuestCount.required';
  if (!values.feedbackGuessTrashCount) errors.feedbackGuessTrashCount = 'event.feedbackGuessTrashCount.required';

  return { ...errors, ...validateImages(values.images) };
};

export const asyncValidate = async (values) => {
  await validateImageRatio(values.images || []);
};
