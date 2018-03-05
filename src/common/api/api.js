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
import fetch from 'isomorphic-fetch';
import { BaseError } from 'make-error';
import { renewToken } from '../lib/redux-firebase/actions';

const dispatchNewTokenPromise = async () => {
  if (!process.env.IS_BROWSER) return null;
  const { store } = require('../../browser/main');

  const dispatchResult = store.dispatch(renewToken());
  return await dispatchResult.meta.action.payload;
};

const parseJSON = async (response) => {
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

const getHeaders = (token, headers) => {
  if ((!headers || !headers['X-Token']) && token) {
    headers = { ...headers, 'X-Token': token };
  }
  if ((headers || {})['content-type']) return headers;
  return { 'content-type': 'application/json', ...headers };
};

export const get = async (url, token, headers, stop) => {
  const response = await fetch(url, { headers: getHeaders(token, headers) });

  if (!response.ok) {
    if (response.status === 440 && !stop) {
      const newToken = await dispatchNewTokenPromise();
      return await get(url, newToken, headers, true);
    }
    throw new BaseError(await response.json());
  }

  const responseJson = await response.json();
  return responseJson;
};

export const post = async (url, data, token, customHeaders, stop) => {
  const headers = getHeaders(token, customHeaders);
  const response = await fetch(url, {
    method: 'POST',
    body: headers['content-type'] === 'application/json' ? data && JSON.stringify(data) : data,
    headers,
  });
  if (!response.ok) {
    if (response.status === 440 && !stop) {
      const newToken = await dispatchNewTokenPromise();
      return await get(url, newToken, headers, true);
    }
    throw new BaseError(await response.json());
  }
  if (response.status === 204) return true;
  return await response.json();
};

export const put = async (url, data, token, headers, stop) => {
  const response = await fetch(url, {
    method: 'PUT',
    body: data && JSON.stringify(data),
    headers: getHeaders(token, headers),
  });
  if (!response.ok) {
    if (response.status === 440 && !stop) {
      const newToken = await dispatchNewTokenPromise();
      return await get(url, newToken, headers, true);
    }
    throw new BaseError(await response.json());
  }
  if (response.status === 204) return true;
  return await response.json();
};

export const patch = async (url, data, token, headers, stop) => {
  const response = await fetch(url, {
    method: 'PATCH',
    body: data && JSON.stringify(data),
    headers: getHeaders(token, headers),
  });
  if (!response.ok) {
    if (response.status === 440 && !stop) {
      const newToken = await dispatchNewTokenPromise();
      return await get(url, newToken, headers, true);
    }
    throw new BaseError(response);
  }
  return await parseJSON(response);
};

export const remove = async (url, token, headers, stop) => {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: getHeaders(token, headers),
  });

  if (!response.ok) {
    if (response.status === 440 && !stop) {
      const newToken = await dispatchNewTokenPromise();
      return await get(url, newToken, headers, true);
    }
    throw new BaseError(response);
  }
  try {
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return true;
  }
};

export const getQueryString = (filter, prefix) => (
  filter &&
  Object.keys(filter).reduce((array, cur) => {
    if (filter[cur] === null) {
      return array;
    } else if (typeof filter[cur] === 'object') {
      array.push(getQueryString(filter[cur], cur));
    } else if (filter[cur] !== null && filter[cur] !== '') {
      array.push(`${prefix ? `${prefix}[` : ''}${encodeURIComponent(cur)}${prefix ? ']' : ''}=${encodeURIComponent(filter[cur])}`);
    }
    return array;
  }, []).join('&')
);
