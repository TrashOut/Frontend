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
const config = {
  firebase: {
    apiKey: 'key-here',
    authDomain: 'trashoutngo-dev.firebaseapp.com',
    databaseURL: 'https://trashoutngo-dev.firebaseio.com',
    storageBucket: 'trashoutngo-dev.appspot.com',
    projectId: 'trashoutngo-dev',
  },
};

const getConfiguration = () => {
  try {
    return { ...config, ...require('./json/both.json') }; // eslint-disable-line import/no-unresolved
  } catch (error) {
    return config;
  }
};

export default getConfiguration();