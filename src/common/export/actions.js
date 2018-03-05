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
import { saveAs } from '../table/actions';
import { BaseError } from 'make-error';

export const EXPORT_TO_CSV = 'EXPORT_TO_CSV';

export const exportToCsv = (attributesNeeded, limit, getItems, getCount, mapping, idsName) => ({ token, getState, dispatch }) => {
  const filter = getState().table.filter.toFilter();
  const selectedItems = getState().table.map.filter(x => x.selected).map(x => x.id).join(',');
  if (selectedItems.length > 0) filter[idsName] = selectedItems;

  filter.limit = limit;
  if (attributesNeeded !== false) {
    if (attributesNeeded.length === 0) attributesNeeded.push('id');
    filter.attributesNeeded = attributesNeeded.join();
  }
  const numberOfPages = async () => {
    const fetchedCount = await getCount(filter, token);
    const count = Number.isInteger(fetchedCount) ? fetchedCount : fetchedCount.count;
    return Math.ceil(count / filter.limit);
  };

  const receiveFile = async (page) => {
    filter.page = page;
    return await getItems(filter, token);
  };

  const initReceiveing = async () => {
    const pages = await numberOfPages();
    if (pages === 0) {
      throw new BaseError('no-results');
    }
    dispatch({ type: 'EXPORT_TO_CSV_COUNT', payload: pages });
    const result = [];
    for (let i = 1; i <= pages; i += 1) {
      if (getState().table.exportCount === 0) throw new BaseError('canceled-action');
      result.push(await receiveFile(i));
      dispatch({ type: 'EXPORT_TO_CSV_CHANGE', payload: i + 1 });
    }
    dispatch(saveAs(result, mapping));
    return result;
  };

  const payload = initReceiveing();
  return ({
    type: EXPORT_TO_CSV,
    payload,
  });
};
