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
export const days = {
  Monday: { id: 'Monday', message: 'global.days.Monday' },
  Tuesday: { id: 'Tuesday', message: 'global.days.Tuesday' },
  Wednesday: { id: 'Wednesday', message: 'global.days.Wednesday' },
  Thursday: { id: 'Thursday', message: 'global.days.Thursday' },
  Friday: { id: 'Friday', message: 'global.days.Friday' },
  Saturday: { id: 'Saturday', message: 'global.days.Saturday' },
  Sunday: { id: 'Sunday', message: 'global.days.Sunday' },
};

export const anonymous = {
  anonymous: { id: 'anonymous', message: 'trash.sendAnonymously' },
};

export const cleanedByMe = {
  cleanedByMe: { id: 'cleanedByMe', message: 'trash.cleanedByMe' },
};

export const select = {
  false: { id: false, message: 'global.select' },
};

export const continents = {
  1: { id: 1, message: 'global.continent.europe' },
  2: { id: 2, message: 'global.continent.southAmerica' },
  3: { id: 3, message: 'global.continent.northAmerica' },
  4: { id: 4, message: 'global.continent.africa' },
  5: { id: 5, message: 'global.continent.asia' },
  6: { id: 6, message: 'global.continent.australia' },
  7: { id: 7, message: 'global.continent.antarctica' },
};

export const spams = {
  true: { id: 'true', message: 'global.yes' },
  false: { id: 'false', message: 'global.no' },
};

export const unreviewed = spams;
export const updateNeeded = spams;
export const trueFalse = spams;

export const notifications = {
  0: { frequency: 0, message: 'global.geo.notificationFrequency.never' },
  86400: { frequency: 86400, message: 'global.geo.notificationFrequency.perDay' },
  604800: { frequency: 604800, message: 'global.geo.notificationFrequency.perWeek' },
  2419200: { frequency: 2419200, message: 'global.geo.notificationFrequency.perMonth' },
};

export const languages = {
  en: { id: 'en', globalId: 'en_US', message: 'global.language.english' },
  cs: { id: 'cs', globalId: 'cs_CZ', message: 'global.language.czech' },
  de: { id: 'de', globalId: 'de_DE', message: 'global.language.germany' },
  es: { id: 'es', globalId: 'es_ES', message: 'global.language.espana' },
  sk: { id: 'sk', globalId: 'sk_SK', message: 'global.language.slovakia' },
  ru: { id: 'ru', globalId: 'ru_RU', message: 'global.language.russia' },
  pt: { id: 'pt', globalId: 'pt_AU', message: 'global.language.portuguese' },
  it: { id: 'it', globalId: 'it_AU', message: 'global.language.italian' },
  hu: { id: 'hu', globalId: 'hu_AU', message: 'global.language.hungarian' },
  fr: { id: 'fr', globalId: 'fr_AU', message: 'global.language.france' },
  ro: { id: 'fr', globalId: 'ro_RO', message: 'global.language.romanian' },
  ka: { id: 'ka', globalId: 'ka_GE', message: 'global.language.georgian' },
};

export const areaTypes = {
  continent: { id: 'continent', message: 'geo.continent' },
  country: { id: 'country', message: 'geo.country' },
  aa1: { id: 'aa1', message: 'geo.aa1' },
  aa2: { id: 'aa2', message: 'geo.aa2' },
  aa3: { id: 'aa3', message: 'geo.aa3' },
  locality: { id: 'locality', message: 'geo.locality' },
  subLocality: { id: 'subLocality', message: 'geo.subLocality' },
  zip: { id: 'zip', message: 'geo.zip' },
  street: { id: 'street', message: 'geo.street' },
};

export const organizationTypes = [ 'other', 'government', 'municipality', 'business', 'ngo', 'school' ];
