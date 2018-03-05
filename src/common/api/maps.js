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

export const getTimezone = async (lat, long, timestamp) => {
  try {
    const result = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${long}&timestamp=${timestamp || '1331161200'}`);
    return await result.json();
  } catch (error) {
    throw new Error('get-error');
  }
};

export const getAddress = async (lat, long) => {
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}`);
    const { results } = await response.json();
    if (results) {
      return {
        address: results[0].formatted_address,
        state: results[results.length - 1].formatted_address,
      };
    }
    return {};
  } catch (error) {
    return {};
  }
};
