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
import * as api from '../api/articles';
import * as firebaseApi from '../api/firebase';

import { fetch } from '../table/actions';
import Article from '../models/article';

export const UPDATE_ARTICLE = 'UPDATE_ARTICLE';
export const UPDATE_ARTICLE_START = 'UPDATE_ARTICLE_START';
export const UPDATE_ARTICLE_SUCCESS = 'UPDATE_ARTICLE_SUCCESS';
export const UPDATE_ARTICLE_ERROR = 'UPDATE_ARTICLE_ERROR';

export const CREATE_ARTICLE = 'CREATE_ARTICLE';
export const CREATE_ARTICLE_START = 'CREATE_ARTICLE_START';
export const CREATE_ARTICLE_SUCCESS = 'CREATE_ARTICLE_SUCCESS';
export const CREATE_ARTICLE_ERROR = 'CREATE_ARTICLE_ERROR';

export const REMOVE_ARTICLE = 'REMOVE_ARTICLE';
export const REMOVE_ARTICLE_START = 'REMOVE_ARTICLE_START';
export const REMOVE_ARTICLE_SUCCESS = 'REMOVE_ARTICLE_SUCCESS';
export const REMOVE_ARTICLE_ERROR = 'REMOVE_ARTICLE_ERROR';

export const FETCH_ARTICLE = 'FETCH_ARTICLE';
export const FETCH_ARTICLE_START = 'FETCH_ARTICLE_START';
export const FETCH_ARTICLE_SUCCESS = 'FETCH_ARTICLE_SUCCESS';
export const FETCH_ARTICLE_ERROR = 'FETCH_ARTICLE_ERROR';
export const FETCH_ARTICLE_LIST = 'FETCH_ARTICLE_LIST';

export const FETCH_ARTICLE_LIST_START = 'FETCH_ARTICLE_LIST_START';
export const FETCH_ARTICLE_LIST_SUCCESS = 'FETCH_ARTICLE_LIST_SUCCESS';
export const FETCH_ARTICLE_LIST_ERROR = 'FETCH_ARTICLE_LIST_ERROR';

const send = async (
  article,
  func,
  dispatch,
  token
) => {
  const result = await func(article, token);
  if (result) {
    const id = result.id || article.id;

    const images = await firebaseApi.uploadFiles(article.images.filter(x => !x.file.fromFirebase), token);
    if (images.length > 0) {
      await api.postArticleImages(id, images, token);
    }
    await Promise.all(article.images.filter(x => x.delete).map(image => api.deleteArticleImage(id, image.file.id, token)));
    await Promise.all(article.images.filter(x => x.change).map(image => api.putArticleImage(id, image.file.id, image.isMain, token)));

    const videosToBeDeleted = article.prContentVideo.filter(x => x.delete === true);
    const videosToBeCreated = article.prContentVideo.filter(x => x.delete !== true);
    if (videosToBeCreated.length > 0) {
      await api.postArticleVideos(id, videosToBeCreated, token);
    }
    await Promise.all(videosToBeDeleted.map(x => api.deleteArticleVideos(id, x.id, token)));
  }
  return result;
};

export const updateArticle = (data) =>
  ({ dispatch, token }) => ({
    type: UPDATE_ARTICLE,
    payload: send(
      new Article({ ...data }, true).toUpdate(),
      api.putArticle,
      dispatch,
      token
    ),
    originalObject: data,
    message: 'update-article',
  });

export const createArticle = (data) =>
  ({ dispatch, token }) => ({
    type: CREATE_ARTICLE,
    payload: send(
      new Article({ ...data }, true).toCreate(),
      api.postArticle,
      dispatch,
      token
    ),
    message: 'create-article',
  });

export const removeArticle = (articleId) => ({ token }) => ({
  type: REMOVE_ARTICLE,
  payload: api.removeArticle(articleId, token),
  message: 'remove-article',
});

export const fetchArticle = (id) => ({ token }) => ({
  type: FETCH_ARTICLE,
  payload: api.getArticle(id, token),
});

export const fetchArticleList = (filter) => ({ getState, dispatch, token }) => {
  const fetchAll = filter === 'all';
  if (!filter || fetchAll) {
    filter = getState().table.filter.toJS();
  }
  if (fetchAll) {
    filter.page = 1;
    filter.limit = 1000000;
  }
  const promise = Promise.all([
    api.getArticles(filter, token),
    api.getArticlesCount(filter, token),
  ]);

  dispatch(fetch(promise, 'TABLE_TYPE_ARTICLE'));
  return {
    type: FETCH_ARTICLE_LIST,
  };
};

export const removeArticleImage = (articleId, imageId) => ({ token }) => ({
  type: 'REMOVE_ARTICLE_IMAGE',
  payload: api.deleteArticleImage(articleId, imageId, token),
  message: 'remove-article-photo',
  then: fetchArticle(articleId),
});

