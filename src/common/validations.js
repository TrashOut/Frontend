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
import { isValidPhoneNumber } from 'react-phone-number-input';

const IMAGE_MAX_FILESIZE = 2000000;
const IMAGE_MAX_FILESCOUNT = 20;

export const validEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
export const validPhone = (phone) => isValidPhoneNumber(phone);
export const validUrl = (url) => /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url); // eslint-disable-line no-useless-escape
export const validFacebook = (url) => /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/g.test(url);  // eslint-disable-line no-useless-escape
export const validTwitter = (url) => /(?:(http:\/\/|https:\/\/))?(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/.test(url);

export const validateImages = (images, inputName = 'images') => {
  const errors = {};

  errors[inputName] = (images || []).reduce((acc, image) => {
    if (image.size && image.size > IMAGE_MAX_FILESIZE) return 'global.validation.sizeExceeded';
    return acc;
  }, undefined);

  if ((images || []).length > IMAGE_MAX_FILESCOUNT) {
    errors[inputName] = 'global.validation.maxiumNumberReached';
  }

  return errors[inputName] ? errors : {};
};

export const validateImage = (image, inputName = 'images') => {
  const error = (image || []).reduce((acc, image) => {
    if (image.size && image.size > IMAGE_MAX_FILESIZE) return 'global.validation.sizeExceeded';
    return acc;
  }, undefined);
  return error ? { [inputName]: error } : {};
};

export const validateImageRatio = (images) => Promise.all(images.map(({ preview }) => new Promise((resolve, reject) => {
  const image = new Image(); // eslint-disable-line no-undef
  image.addEventListener('load', () => {
    const { width, height } = image;
    const ratio = width / height;
    if (ratio < 0.5 || ratio > 2) reject({ images: 'global.validation.imageRatio' }); // eslint-disable-line no-throw-literal
    resolve();
  });
  image.src = preview;
})));
