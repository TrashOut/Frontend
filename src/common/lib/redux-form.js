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
import { reducer as formReducer } from 'redux-form';

const reducer = formReducer.plugin({
  login: (state, action) => {
    switch (action.type) {
      case 'FIREBASE_SIGN_IN_ERROR':
        return {
          ...state,
          syncErrors: action.payload.errors,
        };
      default:
        return state;
    }
  },

  register: (state, action) => {
    switch (action.type) {
      case 'FIREBASE_SIGN_UP_ERROR':
        return {
          ...state,
          syncErrors: action.payload.errors,
        };
      default:
        return state;
    }
  },

  forgottenPassword: (state, action) => {
    switch (action.type) {
      case 'FIREBASE_FORGOTTEN_PASSWORD_ERROR':
        return {
          ...state,
          syncErrors: action.payload.errors,
        };
      default:
        return state;
    }
  },

  createOrganization: (state, action) => {
    switch (action.type) {
      case 'USER_NOT_FOUND':
        return {
          ...state,
          syncErrors: action.payload,
        };
      default:
        return state;
    }
  },

  areaAddManager: (state, action) => {
    switch (action.type) {
      case 'USER_NOT_FOUND':
        return {
          ...state,
          syncWarnings: action.payload,
        };
      default:
        return state;
    }
  },

  changeEmail: (state, action) => {
    switch (action.type) {
      case 'FIREBASE_CHANGE_EMAIL_ERROR': {
        return {
          ...state,
          syncErrors: action.payload.errors,
        };
      }
      default:
        return state;
    }
  },

  change_password: (state, action) => {
    switch (action.type) {
      case 'FIREBASE_CHANGE_PASSWORD_ERROR': {
        const { errors } = action.payload;
        if (errors.password) {
          errors.oldPassword = errors.password;
          errors.password = undefined;
        }

        return {
          ...state,
          syncErrors: action.payload.errors,
        };
      }
      default:
        return state;
    }
  },
});

export default reducer;
