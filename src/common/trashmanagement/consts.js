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
export { continents, spams, unreviewed, updateNeeded, anonymous, cleanedByMe } from '../consts';


export const trashTypes = {
  automotive: { id: 'automotive', message: 'trash.types.automotive', img: '/img/icons/type_automotive.png', imgActive: '/img/icons/type_automotive_active.png', background: '#567980' },
  construction: { id: 'construction', message: 'trash.types.construction', img: '/img/icons/type_construction.png', imgActive: '/img/icons/type_construction_active.png', background: '#FF904E' },
  dangerous: { id: 'dangerous', message: 'trash.types.dangerous', img: '/img/icons/type_dangerous.png', imgActive: '/img/icons/type_dangerous_active.png', background: '#FF4444' },
  deadAnimals: { id: 'deadAnimals', message: 'trash.types.deadAnimals', img: '/img/icons/type_animals.png', imgActive: '/img/icons/type_animals_active.png', background: '#C2660B' },
  electronic: { id: 'electronic', message: 'trash.types.electronic', img: '/img/icons/type_electronic.png', imgActive: '/img/icons/type_electronic_active.png', background: '#35567B' },
  domestic: { id: 'domestic', message: 'trash.types.domestic', img: '/img/icons/type_household.png', imgActive: '/img/icons/type_household_active.png', background: '#B88854' },
  liquid: { id: 'liquid', message: 'trash.types.liquid', img: '/img/icons/type_liquid.png', imgActive: '/img/icons/type_liquid_active.png', background: '#E0DB39' },
  metal: { id: 'metal', message: 'trash.types.metal', img: '/img/icons/type_metal.png', imgActive: '/img/icons/type_metal_active.png', background: '#D1D1D1' },
  organic: { id: 'organic', message: 'trash.types.organic', img: '/img/icons/type_organic.png', imgActive: '/img/icons/type_organic_active.png', background: '#80A920' },
  plastic: { id: 'plastic', message: 'trash.types.plastic', img: '/img/icons/type_plastic.png', imgActive: '/img/icons/type_plastic_active.png', background: '#6DBAE1' },
  glass: { id: 'glass', message: 'trash.types.glass', img: '/img/icons/type_glass.png', imgActive: '/img/icons/type_glass_active.png', background: '#188650' },
};

export const trashAccessibility = {
  byCar: { id: 'byCar', message: 'trash.accessibility.byCar' },
  inCave: { id: 'inCave', message: 'trash.accessibility.inCave' },
  underWater: { id: 'underWater', message: 'trash.accessibility.underWater' },
  notForGeneralCleanup: { id: 'notForGeneralCleanup', message: 'trash.accessibility.notForGeneralCleanup' },
};

export const trashProperties = {
  0: { id: 0, message: 'global.markedAsSpam' },
  1: { id: 1, message: 'global.reviewed' },
};

export const trashSizes = {
  bag: { id: 'bag', message: 'trash.size.bag', img: '/img/icons/size_bag.png', imgActive: '/img/icons/size_bag_active.png' },
  wheelbarrow: { id: 'wheelbarrow', message: 'trash.size.wheelbarrow', img: '/img/icons/size_wheelbarrow.png', imgActive: '/img/icons/size_wheelbarrow_active.png' },
  car: { id: 'car', message: 'trash.size.carNeeded', img: '/img/icons/size_car.png', imgActive: '/img/icons/size_car_active.png' },
};

export const trashStatuses = {
  cleaned: { id: 'cleaned', message: 'trash.status.cleaned' },
  stillHere: { id: 'stillHere', message: 'trash.status.stillHere' },
  less: { id: 'less', message: 'trash.status.less' },
  more: { id: 'more', message: 'trash.status.more' },
  reported: { id: 'reported', message: 'profile.reported' },
};

export const attributes = {
  id: { id: 'id', message: 'trash.id' },
  latitude: { id: 'latitude', message: 'global.latitude' },
  longitude: { id: 'longitude', message: 'global.longitude' },
  continent: { id: 'continent', message: 'geo.continent' },
  country: { id: 'country', message: 'geo.country' },
  aa1: { id: 'aa1', message: 'geo.aa1' },
  aa2: { id: 'aa2', message: 'geo.aa2' },
  aa3: { id: 'aa3', message: 'geo.aa3' },
  locality: { id: 'locality', message: 'geo.locality' },
  subLocality: { id: 'subLocality', message: 'geo.sublocality' },
  types: { id: 'types', message: 'trash.trashType' },
  updateTime: { id: 'updateTime', message: 'trash.updateTime' },
  updateNeeded: { id: 'updateNeeded', message: 'trash.updateNeeded' },
  note: { id: 'note', message: 'trash.note' },
  url: { id: 'url', message: 'trash.url' },
  status: { id: 'status', message: 'trash.status' },
  size: { id: 'size', message: 'trash.trashSize' },
  anonymous: { id: 'anonymous', message: 'trash.anonymous' },
  created: { id: 'created', message: 'trash.created' },
  accessibility: { id: 'accessibility', message: 'trash.accessibility' },
  image: { id: 'image', message: 'global.image' },
};
