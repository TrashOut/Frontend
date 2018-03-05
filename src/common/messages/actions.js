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
import errorToMessage from '../app/errorToMessage';
import IntlMessageFormat from 'intl-messageformat';
import successToMessage from '../app/successToMessage';
import { BaseError } from 'make-error';
import { push, goBack } from 'react-router-redux';
import { renewToken } from '../lib/redux-firebase/actions';

export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
export const REDIRECTED = 'REDIRECTED';
export const CLOSE_MESSAGE = 'CLOSE_MESSAGE';
export const MESSAGE_ADD_SUCCESS = 'MESSAGE_ADD_SUCCESS';
export const MESSAGE_ADD_ERROR = 'MESSAGE_ADD_ERROR';

const formatUrl = (message, values) => {
  const messageFormat = new IntlMessageFormat(message, 'en');
  return messageFormat.format(values);
};

export const addMessage = (action, value, isSuccess) => ({ dispatch }) => {
  const payload = {
    code: action.message,
    payload: value,
    originalObject: action.originalObject,
    user: action.user,
  };

  if (value instanceof BaseError && value.message) {
    if (value.message === 'reauthenticateNeeded') {
      dispatch(renewToken(() => dispatch(action)));
    }

    const error = ((value || {}).message || {}).error || {};

    if (error.status === 500 && !action.useCustomErrorMessage) {
      dispatch(goBack());
      payload.code = 'api-error';
    }

    if (error.status === 404 && !action.useCustomErrorMessage) {
      dispatch(push('/not-found'));
      payload.code = 'not-found';
    }

    if (error.code === 'AUTHORIZATION_REQUIRED') dispatch(push('/unauthorized'));
  }

  const getMessage = (toMessage) => toMessage(payload);
  const message = getMessage(isSuccess ? successToMessage : errorToMessage);

  if (((message || {}).message || {}).redirect) {
    dispatch(push(formatUrl(message.message.redirect, message.values)));
  }

  return {
    type: isSuccess ? MESSAGE_ADD_SUCCESS : MESSAGE_ADD_ERROR,
    payload,
  };
};

export const clearMessages = () => ({
  type: CLEAR_MESSAGES,
});

export const toggleRedirect = () => ({
  type: REDIRECTED,
});

export const closeMessage = (name) => ({
  type: CLOSE_MESSAGE,
  payload: name,
});
