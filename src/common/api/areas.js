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
import { get, put, getQueryString } from '../api/api';

export const getArea = async (id, token) => {
  try {
    const result = await get(`/webapi/area/${id}`, token);
    return result;
  } catch (error) {
    throw new Error('get-error');
  }
};

export const putArea = async (areaId, rootAreaId, token) => {
  if (!areaId) throw new Error('cannot-create');
  try {
    const result = await put(`/webapi/area/${areaId}`, { rootAreaId }, token);
    return result;
  } catch (error) {
    throw new Error('cannot-create');
  }
};

export const removeAlias = async (areaId, token) => {
  if (!areaId) throw new Error('cannot-create');
  try {
    const result = await put(`/webapi/area/${areaId}`, { rootAreaId: null }, token);
    return result;
  } catch (error) {
    throw new Error('get-error');
  }
};

export const getAreaList = async (filter, token) => {
  try {
    const result = await get(`/webapi/area/?${getQueryString(filter)}`, token);
    return result;
  } catch (error) {
    throw new Error('get-error');
  }
};

export const getAreaCount = async (filter, token) => {
  try {
    const result = await get(`/webapi/area/count/?${getQueryString(filter)}`, token);
    return result.count;
  } catch (error) {
    throw new Error('get-error');
  }
};

export const getAliasesForArea = async (id, token) => {
  try {
    return await get(`/webapi/area/aliases/${id}`, token);
  } catch (error) {
    throw new Error('cannot-get');
  }
};

