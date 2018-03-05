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
import invariant from 'invariant';
import mapFirebaseUserToAppUser from './mapFirebaseUserToAppUser';
import routesList from '../../../browser/routesList';
import { createUser, getMe } from '../../api/users';
import { finishChangeEmail } from '../../users/actions';
import { getFacebookUserInfo } from '../../api/firebase';
import { push } from 'react-router-redux';
import { setCurrentLocale } from '../../intl/actions';
import { signOut } from '../../auth/actions';
import { SubmissionError } from 'redux-form';

export const FIREBASE_OFF_QUERY = 'FIREBASE_OFF_QUERY';
export const FIREBASE_ON_AUTH = 'FIREBASE_ON_AUTH';
export const FIREBASE_ON_PERMISSION_DENIED = 'FIREBASE_ON_PERMISSION_DENIED';
export const FIREBASE_ON_QUERY = 'FIREBASE_ON_QUERY';
export const FIREBASE_RESET_PASSWORD_ERROR = 'FIREBASE_RESET_PASSWORD_ERROR';
export const FIREBASE_RESET_PASSWORD_START = 'FIREBASE_RESET_PASSWORD_START';
export const FIREBASE_RESET_PASSWORD_SUCCESS = 'FIREBASE_RESET_PASSWORD_SUCCESS';
export const FIREBASE_SAVE_USER_ERROR = 'FIREBASE_SAVE_USER_ERROR';
export const FIREBASE_SAVE_USER_START = 'FIREBASE_SAVE_USER_START';
export const FIREBASE_SAVE_USER_SUCCESS = 'FIREBASE_SAVE_USER_SUCCESS';
export const FIREBASE_SIGN_IN_ERROR = 'FIREBASE_SIGN_IN_ERROR';
export const FIREBASE_SIGN_IN_START = 'FIREBASE_SIGN_IN_START';
export const FIREBASE_SIGN_IN_SUCCESS = 'FIREBASE_SIGN_IN_SUCCESS';
export const FIREBASE_SIGN_UP_ERROR = 'FIREBASE_SIGN_UP_ERROR';
export const FIREBASE_SIGN_UP_START = 'FIREBASE_SIGN_UP_START';
export const FIREBASE_SIGN_UP_SUCCESS = 'FIREBASE_SIGN_UP_SUCCESS';
export const FIREBASE_START = 'FIREBASE_START';
export const FIREBASE_UPLOAD_FILE = 'FIREBASE_UPLOAD_FILE';
export const FIREBASE_GET_FILE = 'FIREBASE_GET_FILE';
export const FIREBASE_FORGOTTEN_PASSWORD = 'FIREBASE_FORGOTTEN_PASSWORD';
export const FIREBASE_FORGOTTEN_PASSWORD_SUCCESS = 'FIREBASE_FORGOTTEN_PASSWORD_SUCCESS';
export const FIREBASE_FORGOTTEN_PASSWORD_ERROR = 'FIREBASE_FORGOTTEN_PASSWORD_ERROR';

const facebookPermissions = [
  'email',
  'public_profile',
];

export const uploadFile = file => ({ firebaseStorage }) => {
  const firebaseRef = firebaseStorage().ref();
  const ref = firebaseRef.child('temp-images/testfile.jpeg');
  const promise = ref.put(file);
  return {
    type: 'FIREBASE_UPLOAD_FILE',
    payload: promise,
  };
};

export const getFile = fileName => ({ firebaseStorage }) => {
  const ref = firebaseStorage.child(fileName);
  const url = ref.getDownloadURL().then(url => url);
  return {
    type: 'FIREBASE_GET_FILE',
    payload: {
      url,
    },
  };
};

const getFirebaseError = error => {
  const prop = {
    'auth/email-already-in-use': { email: 'profile.emailExists', _error: 'Login Failed!' },
    'auth/invalid-email': { email: 'profile.invalidEmail', _error: 'Login Failed!' },
    'auth/user-not-found': { email: 'user.register.notExists', _error: 'Login Failed!' },
    'auth/wrong-password': { password: 'profile.wrongPassword', _error: 'Login Failed!' },
    'auth/requires-recent-login': { email: 'profile.reauthenticateNeeded', _error: 'Login Failed!' },
  }[error.code];
  if (prop) return new SubmissionError(prop);

  return error;
};

export const changePassword = ({ oldPassword, password }) =>
  ({ firebaseAuth }: any) => {
    const getPromise = async () => {
      try {
        const user = await firebaseAuth().currentUser;
        await firebaseAuth().signInWithEmailAndPassword(user.email, oldPassword);
        await user.updatePassword(password);
        const credential = firebaseAuth.EmailAuthProvider.credential(
            user.email,
            password
        );
        await user.reauthenticateWithCredential(credential);
        return user;
      } catch (error) {
        throw getFirebaseError(error);
      }
    };
    return {
      type: 'FIREBASE_CHANGE_PASSWORD',
      payload: getPromise(),
      message: 'password-changed',
    };
  };

export const changeEmail = ({ password, email }) => ({ firebaseAuth, dispatch }) => {
  const promise = async () => {
    try {
      const user = await firebaseAuth().currentUser;
      const credential = firebaseAuth.EmailAuthProvider.credential(
        user.email,
        password || ''
      );
      await user.reauthenticateWithCredential(credential);
      await user.updateEmail(email);
      await user.sendEmailVerification();
      dispatch(signOut('verify-email'));
      return user;
    } catch (error) {
      throw getFirebaseError(error);
    }
  };

  return {
    type: 'FIREBASE_CHANGE_EMAIL',
    payload: promise(),
  };
};

export const forgottenPassword = ({ email }) => ({ firebaseAuth }) => {
  const getPromise = async () => {
    try {
      return await firebaseAuth().sendPasswordResetEmail(email);
    } catch (error) {
      throw getFirebaseError(error);
    }
  };
  return {
    type: FIREBASE_FORGOTTEN_PASSWORD,
    payload: getPromise(),
    message: 'forgotten-password',
  };
};

const emailSignIn = async (firebaseAuth, validate, { email, password }, dispatch) => {
  try {
    const firebaseUser = await firebaseAuth().signInWithEmailAndPassword(email, password);

    if (!firebaseUser.emailVerified && firebaseUser.email !== 'superadmin@trashout.ngo') {
      await firebaseAuth().signOut();
      dispatch(push({
        pathname: routesList.verifyEmail,
        state: { email, password },
      }));
      throw getFirebaseError({ code: 'needEmailVerified' });
    }

    const token = await firebaseUser.getIdToken();

    try {
      await authorizeUser(firebaseUser, token, dispatch);
      return firebaseUser;
    } catch (error) {
      const appUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
      };
      await createUser(appUser, token);
      await authorizeUser(firebaseUser, token, dispatch);
      return firebaseUser;
    }
  } catch (error) {
    dispatch({ type: 'BAD_LOGIN' });
    throw getFirebaseError(error);
  }
};

const socialSignIn = async (firebaseAuth, providerName, dispatch) => {
  invariant(providerName === 'facebook',
   `${providerName} provider is not yet supported.`);

  const provider = new firebaseAuth.FacebookAuthProvider();
  provider.addScope(facebookPermissions.join(','));

  let promise = null;
  try {
    promise = await firebaseAuth().signInWithPopup(provider);
  } catch (error) {
    if (error.code === 'auth/popup-blocked') {
      promise = await firebaseAuth().signInWithRedirect(provider);
    }
    throw error;
  }

  const token = await promise.user.getIdToken();
  try {
    await authorizeUser(promise.user, token, dispatch);
    return promise;
  } catch (error) {
    const fbUser = await getFacebookUserInfo(promise.credential.accessToken);
    const appUser = {
      uid: promise.user.uid,
      email: promise.user.email,
      firstName: fbUser.first_name,
      lastName: fbUser.last_name,
      birthday: fbUser.birthday,
      facebookUrl: `https://facebook.com/${fbUser.id}`,
    };
    await createUser(appUser, token);
    await authorizeUser(promise.user, token, dispatch);
    return promise;
  }
};

const authorizeUser = async (firebaseUser, token, dispatch) => {
  const dbUser = await getMe(token);
  const user = mapFirebaseUserToAppUser(firebaseUser, dbUser).set('token', token);
  if (user.language) dispatch(setCurrentLocale(user.language, true));

  dispatch(onAuth(user));
  if (firebaseUser.emailVerified && dbUser.email !== firebaseUser.email) dispatch(finishChangeEmail(firebaseUser.email));
};

export const onAuth = user => ({
  type: FIREBASE_ON_AUTH,
  payload: { user },
});

export const signIn = (providerName: string, fields: Object, redirect: string) =>
  ({ firebaseAuth, validate, dispatch }: any) => {
    const promise = providerName === 'password'
      ? emailSignIn(firebaseAuth, validate, fields, dispatch)
      : socialSignIn(firebaseAuth, providerName, dispatch);
    return {
      type: 'FIREBASE_SIGN_IN',
      payload: promise,
      meta: { providerName, fields },
      message: 'signed-in',
      originalObject: { redirect },
    };
  };

export const removeUser = () => ({ firebaseAuth, dispatch }) => {
  const promise = async () => {
    const user = firebaseAuth().currentUser;
    await user.delete();
    dispatch(push(routesList.userDisabled));
  };

  return {
    type: 'REMOVE_FIREBASE_USER',
    payload: promise(),
    message: 'user-removed',
  };
};

const mapLanguages = {
  en: 'en_US',
  cs: 'cs_CZ',
  de: 'de_DE',
  es: 'es_ES',
  sk: 'sk_SK',
  ru: 'ru_RU',
};

export const signUp = (providerName: string, fields: Object) =>
  ({ firebaseAuth }: any) => {
    const getPromise = async () => {
      invariant(providerName === 'password',
       `${providerName} provider is not supported.`);
      const { email, password, password_validation, ...other } = fields; // eslint-disable-line no-unused-vars
      try {
        const firebaseUser = await firebaseAuth().createUserWithEmailAndPassword(email, password);
        const token = await firebaseUser.getIdToken();
        await createUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...other, language: mapLanguages[other.language] }, token);
        await firebaseUser.sendEmailVerification();
        await firebaseAuth().signOut();
        return firebaseUser;
      } catch (error) {
        throw getFirebaseError(error);
      }
    };
    return {
      type: 'FIREBASE_SIGN_UP',
      payload: getPromise(),
      message: 'sign-up',
    };
  };

export const onPermissionDenied = (message: string) => ({
  type: FIREBASE_ON_PERMISSION_DENIED,
  payload: { message },
});

export const resetPassword = (email: string, onSuccess: Function) =>
  ({ firebaseAuth, validate }: any) => {
    const getPromise = async () => {
      await validate({ email })
        .prop('email')
          .required()
          .email()
        .promise;
      try {
        await firebaseAuth().sendPasswordResetEmail(email);
      } catch (error) {
        throw getFirebaseError(error);
      }
      if (onSuccess) onSuccess();
    };
    return {
      type: 'FIREBASE_RESET_PASSWORD',
      payload: getPromise(),
    };
  };

export const renewToken = (callback) => ({ firebaseAuth, dispatch }) => {
  const promise = async () => {
    const firebaseUser = await firebaseAuth().currentUser;
    const token = await firebaseUser.getIdToken(true);
    const user = mapFirebaseUserToAppUser(firebaseUser, await getMe(token)).set('token', token);
    dispatch(onAuth(user));
    if (callback) callback(token);
    return token;
  };

  return {
    type: 'RENEW_TOKEN',
    payload: promise(),
  };
};

export const sendEmailVerification = (email, password) => ({ firebaseAuth }) => {
  const sendVerification = async () => {
    const firebaseUser = await firebaseAuth().signInWithEmailAndPassword(email, password);

    if (!firebaseUser.emailVerified && firebaseUser.email !== 'superadmin@trashout.ngo') {
      const result = await firebaseUser.sendEmailVerification();
      await firebaseAuth().signOut();
      return result;
    }
    return false;
  };

  return {
    type: 'SEND_EMAIL_VERIFICATION',
    payload: sendVerification(),
  };
};

export const firebaseStart = () => ({ dispatch, firebaseAuth, getState }) => {
  firebaseAuth().getRedirectResult().then(result => {
    if (!result.credential) return;
    dispatch({ type: FIREBASE_SIGN_IN_SUCCESS, payload: result });
  }, error => {
    if (error.code === 'auth/operation-not-supported-in-this-environment') {
      return;
    }
    dispatch({ type: FIREBASE_SIGN_IN_ERROR, payload: error });
  });

  firebaseAuth().onAuthStateChanged(async firebaseUser => {
    if (firebaseUser) {
      if (getState().users.userLoaded) return;
      const token = await firebaseUser.getIdToken();
      const dbUser = await getMe(token);

      const user = mapFirebaseUserToAppUser(firebaseUser, dbUser).set('token', token);
      if (user.language) dispatch(setCurrentLocale(user.language));

      dispatch(onAuth(user));
    } else {
      dispatch(onAuth(firebaseUser));
    }
  });

  return {
    type: FIREBASE_START,
  };
};
