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
import { get, post, remove, put, getQueryString } from '../api/api';

export const postArticle = async (data, token) => {
  try {
    const result = await post('/webapi/prContent/', data, token);
    return result;
  } catch (error) {
    throw new Error('cannot-create');
  }
};

export const postArticleImages = async (id, images, token) => {
  try {
    const result = await post(`/webapi/prContent/${id}/images`, { images }, token);
    return result;
  } catch (error) {
    throw new Error('cannot-add-images');
  }
};

export const deleteArticleImage = async (id, imageId, token) => {
  try {
    const result = await remove(`/webapi/prContent/${id}/images/${imageId}`, token);
    return result;
  } catch (error) {
    throw new Error('cannot-remove-image');
  }
};


export const postArticleVideos = async (id, videos, token) => {
  try {
    const result = await post(`/webapi/prContent/${id}/videos`, { videos }, token);
    return result;
  } catch (error) {
    throw new Error('cannot-add-videos');
  }
};

export const putArticleImage = async (id, imageId, isMain, token) => {
  try {
    const result = await put(`/webapi/prContent/${id}/images/${imageId}`, { isMain }, token);
    return result;
  } catch (error) {
    throw new Error('cannot-put-article-image');
  }
};

export const deleteArticleVideos = async (id, videoId, token) => {
  try {
    const result = await remove(`/webapi/prContent/${id}/videos/${videoId}`, token);
    return result;
  } catch (error) {
    throw new Error('cannot-remove-videos');
  }
};

export const putArticle = async (data, token) => {
  if (!data.id) throw new Error('cannot-create');
  try {
    const result = await put(`/webapi/prContent/${data.id}`, data, token);
    return result;
  } catch (error) {
    throw new Error('cannot-create');
  }
};

export const removeArticle = async (id, token) => {
  try {
    const result = await remove(`/webapi/prContent/${id}`, token);
    return result;
  } catch (error) {
    throw new Error('remove-error');
  }
};

export const getArticle = async (id, token) => {
  try {
    const result = await get(`/webapi/prContent/${id}`, token);
    return result;
  } catch (error) {
    throw new Error('get-error');
  }
};

export const getArticles = async (filter, token) => {
  try {
    const result = await get(`/webapi/prContent/?${getQueryString(filter)}`, token);
    return result;
  } catch (error) {
    throw new Error('get-error');
  }
};

export const getArticlesCount = async (filter, token) => {
  try {
    const result = await get(`/webapi/prContent/count/?${getQueryString(filter)}`, token);
    return result.count;
  } catch (error) {
    throw new Error('get-error');
  }
};

