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
import geolib from 'geolib';

export const getPointsBound = (points) => {
  if (!points) return null;

  const result = {
    upperLeft: {},
    bottomRight: {},
  };

  const isMultiplePoint = (p) => {
    let lastPoint = null;
    let isSame = true;
    p.forEach((x) => {
      if (!lastPoint) {
        lastPoint = x;
      } else if (lastPoint !== x) {
        isSame = false;
      }
    });
    return isSame;
  };

  let coords = {};
  if (points.length === 1 || isMultiplePoint(points)) {
    const { lat, long } = points[0].gps;
    const pointObj = { lat, lon: long };
    const upperLeftPoint = geolib.computeDestinationPoint(pointObj, 20, 315);
    const bottomRightPoint = geolib.computeDestinationPoint(pointObj, 20, 135);
    coords = {
      minLat: bottomRightPoint.latitude,
      maxLat: upperLeftPoint.latitude,
      minLng: upperLeftPoint.longitude,
      maxLng: bottomRightPoint.longitude,
    };
  } else {
    coords = geolib.getBounds(points.map(x => ({
      latitude: x.gps.lat,
      longitude: x.gps.long,
    })));
  }

  result.upperLeft = {
    lat: coords.maxLat,
    long: coords.minLng,
  };
  result.bottomRight = {
    lat: coords.minLat,
    long: coords.maxLng,
  };
  return result;
};

export const getCenterFromBounds = (bounds) => {
  if (!bounds) return null;

  return {
    lat: (bounds.upperLeft.lat + bounds.bottomRight.lat) / 2.0,
    lng: (bounds.upperLeft.long + bounds.bottomRight.long) / 2.0,
  };
};

export const getRectangleDiagonal = ({ east, south, north, west }) => {
  const p1 = {
    latitude: north,
    longitude: east,
  };
  const p2 = {
    latitude: south,
    longitude: west,
  };

  return east && south && north && west && geolib.getDistance(p1, p2);
};
