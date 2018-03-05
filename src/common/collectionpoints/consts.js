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
export { continents, spams, unreviewed, days } from '../consts';

export const cpDustbinTypes = {
  paper: { id: 'paper', message: 'collectionPoint.types.paper' },
  glassAll: { id: 'glassAll', message: 'collectionPoint.types.glassAll' },
  glassWhite: { id: 'glassWhite', message: 'collectionPoint.types.glassWhite' },
  glassGold: { id: 'glassGold', message: 'collectionPoint.types.glassGold' },
  glassGreen: { id: 'glassGreen', message: 'collectionPoint.types.glassGreen' },
  metal: { id: 'metal', message: 'collectionPoint.types.metal' },
  plastic: { id: 'plastic', message: 'collectionPoint.types.plastic' },
  dangerous: { id: 'dangerous', message: 'collectionPoint.types.dangerous' },
  cardboard: { id: 'cardboard', message: 'collectionPoint.types.cardboard' },
  clothes: { id: 'clothes', message: 'collectionPoint.types.clothes' },
  biodegradable: { id: 'biodegradable', message: 'collectionPoint.types.biodegradable' },
  electronic: { id: 'electronic', message: 'collectionPoint.types.electronic' },
  everything: { id: 'everything', message: 'collectionPoint.types.everything' },
  recyclables: { id: 'recyclables', message: 'collectionPoint.types.recyclables' },
};

export const cpCategories = {
  recyclables: {
    id: 'recyclables',
    message: 'collectionPoint.category.recyclabes',
    selectable: true,
    types: ['paper', 'glassAll', 'glassGold', 'glassGreen', 'metal', 'plastic', 'cardboard', 'biodegradable'],
  },
  dangerous: {
    id: 'dangerous',
    message: 'collectionPoint.category.dangerous',
    selectable: true,
    types: ['battery', 'oil', 'fluorescentLamps', 'neonLamps', 'lightBulbs', 'color', 'thinner'],
  },
  construction: {
    id: 'construction',
    message: 'collectionPoint.category.construction',
    selectable: false,
    types: ['wiredGlass', 'buildingRubble', 'materialsFromBituminousPaper', 'eternitCoverings', 'asbestos', 'slag', 'glassWool', 'cinder', 'asphalt', 'bitumenPaper'],
  },
  household: {
    id: 'household',
    message: 'collectionPoint.category.household',
    selectable: false,
    types: ['electronic', 'woodenAndUpholsteredFurniture', 'carpets', 'window', 'mirror', 'fireplaces'],
  },
  automotive: {
    id: 'automotive',
    message: 'collectionPoint.category.automotive',
    selectable: false,
    types: ['tires', 'carParts'],
  },
  other: {
    id: 'other',
    message: 'collectionPoint.category.other',
    selectable: false,
    types: ['clothes', 'iron', 'wooden', 'medicines'],
  },
  everything: {
    id: 'everything',
    message: 'collectionPoint.category.everything',
    selectable: true,
    selectAll: true,
  },
};

export const cpScrapyardTypes = {
  paper: { id: 'paper', message: 'collectionPoint.types.paper' },
  glassAll: { id: 'glassAll', message: 'collectionPoint.types.glassAll' },
  glassWhite: { id: 'glassWhite', message: 'collectionPoint.types.glassWhite' },
  glassGold: { id: 'glassGold', message: 'collectionPoint.types.glassGold' },
  glassGreen: { id: 'glassGreen', message: 'collectionPoint.types.glassGreen' },
  metal: { id: 'metal', message: 'collectionPoint.types.metal' },
  plastic: { id: 'plastic', message: 'collectionPoint.types.plastic' },
  dangerous: { id: 'dangerous', message: 'collectionPoint.types.dangerous' },
  cardboard: { id: 'cardboard', message: 'collectionPoint.types.cardboard' },
  clothes: { id: 'clothes', message: 'collectionPoint.types.clothes' },
  biodegradable: { id: 'biodegradable', message: 'collectionPoint.types.biodegradable' },
  electronic: { id: 'electronic', message: 'collectionPoint.types.electronic' },
  everything: { id: 'everything', message: 'collectionPoint.types.everything' },
  recyclables: { id: 'recyclables', message: 'collectionPoint.types.recyclables' },
  wiredGlass: { id: 'wiredGlass', message: 'collectionPoint.types.wiredGlass' },
  battery: { id: 'battery', message: 'collectionPoint.types.battery' },
  tires: { id: 'tires', message: 'collectionPoint.types.tires' },
  iron: { id: 'iron', message: 'collectionPoint.types.iron' },
  woodenAndUpholsteredFurniture: { id: 'woodenAndUpholsteredFurniture', message: 'collectionPoint.types.woodenAndUpholsteredFurniture' },
  carpets: { id: 'carpets', message: 'collectionPoint.types.carpets' },
  wooden: { id: 'wooden', message: 'collectionPoint.types.wooden' },
  window: { id: 'window', message: 'collectionPoint.types.window' },
  buildingRubble: { id: 'buildingRubble', message: 'collectionPoint.types.buildingRubble' },
  oil: { id: 'oil', message: 'collectionPoint.types.oil' },
  fluorescentLamps: { id: 'fluorescentLamps', message: 'collectionPoint.types.fluorescentLamps' },
  neonLamps: { id: 'neonLamps', message: 'collectionPoint.types.neonLamps' },
  lightBulbs: { id: 'lightBulbs', message: 'collectionPoint.types.lightBulbs' },
  color: { id: 'color', message: 'collectionPoint.types.color' },
  thinner: { id: 'thinner', message: 'collectionPoint.types.thinner' },
  mirror: { id: 'mirror', message: 'collectionPoint.types.mirror' },
  carParts: { id: 'carParts', message: 'collectionPoint.types.carParts' },
  medicines: { id: 'medicines', message: 'collectionPoint.types.medicines' },
  materialsFromBituminousPaper: { id: 'materialsFromBituminousPaper', message: 'collectionPoint.types.materialsFromBituminousPaper' },
  eternitCoverings: { id: 'eternitCoverings', message: 'collectionPoint.types.eternitCoverings' },
  asbestos: { id: 'asbestos', message: 'collectionPoint.types.asbestos' },
  fireplaces: { id: 'fireplaces', message: 'collectionPoint.types.fireplaces' },
  slag: { id: 'slag', message: 'collectionPoint.types.slag' },
  glassWool: { id: 'glassWool', message: 'collectionPoint.types.glassWool' },
  cinder: { id: 'cinder', message: 'collectionPoint.types.cinder' },
  asphalt: { id: 'asphalt', message: 'collectionPoint.types.asphalt' },
  bitumenPaper: { id: 'bitumenPaper', message: 'collectionPoint.types.bitumenPaper' },
};

export const collectionPointTypes = {
  dustbin: { id: 'dustbin', message: 'collectionPoint.size.recyclingBin' },
  scrapyard: { id: 'scrapyard', message: 'collectionPoint.size.recyclingCenter' },
};

export const collectionPointSizes = {
  dustbin: { id: 'dustbin', message: 'collectionPoint.size.recyclingBin' },
  scrapyard: { id: 'scrapyard', message: 'collectionPoint.size.recyclingCenter' },
};

export const attributes = {
  id: { id: 'id', message: 'collectionPoint.id' },
  latitude: { id: 'latitude', message: 'global.latitude' },
  longitude: { id: 'longitude', message: 'global.longitude' },
  types: { id: 'types', message: 'collectionPoint.type' },
  size: { id: 'size', message: 'collectionPoint.size' },
  name: { id: 'name', message: 'collectionPoint.name' },
  note: { id: 'note', message: 'collectionPoint.note' },
  email: { id: 'email', message: 'global.email' },
  phone: { id: 'phone', message: 'global.phone' },
  created: { id: 'created', message: 'collectionPoint.created' },
  url: { id: 'url', message: 'global.url' },
  continent: { id: 'continent', message: 'geo.continent' },
  country: { id: 'country', message: 'geo.country' },
  aa1: { id: 'aa1', message: 'geo.aa1' },
  aa2: { id: 'aa2', message: 'geo.aa2' },
  aa3: { id: 'aa3', message: 'geo.aa3' },
  locality: { id: 'locality', message: 'geo.locality' },
  subLocality: { id: 'subLocality', message: 'geo.sublocality' },
  image: { id: 'image', message: 'global.image' },
  trashoutUrl: { id: 'trashoutUrl', message: 'global.trashoutURL' },
};

