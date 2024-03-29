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
  appName: require('../package.json').name,
  appVersion: process.env.appVersion || process.env.HEROKU_SLUG_COMMIT,
  defaultLocale: 'en',
  gcloud: {
    projectId: 'trashoutngo-stage',
  },
  googleAnalyticsId: 'UA-00000000-0',
  googleTagManagerId: 'GTM-0000000',
  isProduction: process.env.NODE_ENV === 'production',
  locales: ['cs', 'de', 'en', 'es', 'sk', 'ru', 'pt', 'it', 'hu', 'fr', 'ro', 'ka', 'sr', 'uk'],
  port: 8080,
  remoteHotReload: false,
  sentryUrl: process.env.NODE_ENV === 'production'
    ? 'https://d609d84e844f4bc3905f44f4b94f5836@sentry.io/232508'
    : 'https://ac67ade7cf7143809fc3978851b42572@sentry.io/232513',
  googleMaps: 'AIzaSyAbe7pSzBnjsU2x6bk3FqyVFcYtemI7zBM',
  api: {
    externalAPI: 'https://dev-api.trashout.ngo/v1/',
    internalAPI: 'http://localhost:8888/v1/',
  },
};

const getConfiguration = () => {
  try {
    return { ...config, ...require('./json/server.json') }; // eslint-disable-line import/no-unresolved
  } catch (error) {
    return config;
  }
};

export default getConfiguration();
