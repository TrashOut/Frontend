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
/* eslint-disable react/require-extension */
const onWindowIntl = () => {
  // require('babel-polyfill');
  window.Promise = require('../common/configureBluebird');

  // App locales are defined in src/server/config.js
  const { addLocaleData } = require('react-intl');
  const cs = require('react-intl/locale-data/cs');
  const en = require('react-intl/locale-data/en');
  const de = require('react-intl/locale-data/de');
  const es = require('react-intl/locale-data/es');
  const ru = require('react-intl/locale-data/ru');
  const sk = require('react-intl/locale-data/sk');
  const pt = require('react-intl/locale-data/pt');
  const it = require('react-intl/locale-data/it');
  const hu = require('react-intl/locale-data/hu');
  const fr = require('react-intl/locale-data/fr');
  const ro = require('react-intl/locale-data/ro');
  const ka = require('react-intl/locale-data/ka');
  const sr = require('react-intl/locale-data/sr');
  const uk = require('react-intl/locale-data/uk');

  [cs, en, de, es, ru, sk, pt, it, hu, fr, ro, ka, sr, uk].forEach(locale => addLocaleData(locale));

  require('./main');
};

// github.com/andyearnshaw/Intl.js/#intljs-and-browserifywebpack
if (!window.Intl) {
  require.ensure([
    'intl',
    'intl/locale-data/jsonp/cs.js',
    'intl/locale-data/jsonp/en.js',
    'intl/locale-data/jsonp/de.js',
    'intl/locale-data/jsonp/es.js',
    'intl/locale-data/jsonp/ru.js',
    'intl/locale-data/jsonp/sk.js',
    'intl/locale-data/jsonp/pt.js',
    'intl/locale-data/jsonp/it.js',
    'intl/locale-data/jsonp/hu.js',
    'intl/locale-data/jsonp/fr.js',
    'intl/locale-data/jsonp/ro.js',
    'intl/locale-data/jsonp/ka.js',
    'intl/locale-data/jsonp/sr.js',
    'intl/locale-data/jsonp/uk.js',
  ], (require) => {
    require('intl');
    require('intl/locale-data/jsonp/cs.js');
    require('intl/locale-data/jsonp/en.js');
    require('intl/locale-data/jsonp/de.js');
    require('intl/locale-data/jsonp/es.js');
    require('intl/locale-data/jsonp/ru.js');
    require('intl/locale-data/jsonp/sk.js');
    require('intl/locale-data/jsonp/pt.js');
    require('intl/locale-data/jsonp/it.js');
    require('intl/locale-data/jsonp/hu.js');
    require('intl/locale-data/jsonp/fr.js');
    require('intl/locale-data/jsonp/ro.js');
    require('intl/locale-data/jsonp/ka.js');
    require('intl/locale-data/jsonp/sr.js');
    require('intl/locale-data/jsonp/uk.js');

    onWindowIntl();
  });
} else {
  onWindowIntl();
}
