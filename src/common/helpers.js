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

const {languages, organizationTypes} = require("./consts");

export const getLanguagesGlobal = () => {
  let ret = {};

  for (const key in languages){
    const value = languages[key];

    ret[value.globalId] = {
      id: value.globalId,
      message: value.message
    };
  }

  return ret;
}

export const getOrganizationTypeList = () => {
  let ret = {};

  for(const type of organizationTypes) {
    ret[type] = { id : type, message: 'organization.type.' + type };
  }

  return ret;
}

export const getLanguageSimpleList = () => {
  return Object.keys(languages);
}
