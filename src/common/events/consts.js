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
export { spams, unreviewed } from '../consts';

export const childFriendly = {
  // pick: { id: '', message: 'global.pickOne' },
  true: { id: 'true', message: 'event.childFriendly.true' },
  false: { id: 'false', message: 'event.childFriendly.false' },
};

export const eventsUpcomingOrOld = {
  dustbin: { id: '0', message: 'event.filter.showUpcoming' },
  scrapyard: { id: '1', message: 'event.filter.showOld' },
};

export const MAX_AREA_TRESHOLD = 30000;
export const MAX_TRASH_POINTS = 5000;
