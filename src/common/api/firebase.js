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
import { get } from './api';
import FormData from 'isomorphic-form-data';
import fetch from 'isomorphic-fetch';
import { BaseError } from 'make-error';

export const getFile = async (name, { firebaseStorage }) => {
  const firebaseRef = firebaseStorage().ref();
  const ref = firebaseRef.child(`temp-images/${name}`);
  return await ref.getDownloadURL();
};

export const uploadFile = async (data, token) => {
  if (!data || 'fullDownloadUrl' in data || data.fromFirebase) return data;
  try {
    const finalData = data && (data.file || data);
    const formData = new FormData();
    formData.append('file', finalData);

    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'x-token': token,
      },
    });

    if (response.status !== 200) {
      throw new BaseError('upload-error');
    }

    const result = await response.json();
    return {
      ...result,
      isMain: data.isMain,
    };
  } catch (error) {
    throw new BaseError('upload-error');
  }
};

export const uploadFiles = async (files, token) =>
  await Promise.all(files.reduce(async (prev, cur) => {
    const file = await uploadFile(cur, token);
    if (file) (await prev).push(file);
    return prev;
  }, []));

export const getFacebookUserInfo = async (token) => {
  try {
    return await get(`https://graph.facebook.com/me/?access_token=${token}&fields=first_name,last_name,birthday,about`);
  } catch (error) {
    throw error;
  }
};

