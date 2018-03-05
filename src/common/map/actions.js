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
export const GET_POSITION = 'GET_POSITION';
export const SET_POSITION_ACCESS_DENIED = 'SET_POSITION_ACCESS_DENIED';
export const RECEIVE_POSITION = 'RECEIVE_POSITION';
export const SET_CENTER = 'SET_CENTER';
export const SET_ZOOM = 'SET_ZOOM';
export const SET_MAP = 'SET_MAP';
export const SET_POSITION = 'SET_POSITION';
export const SWITCH_DRAWING = 'SWITCH_DRAWING';
export const CLEAR_MAP = 'CLEAR_MAP';
export const ENABLE_SCROLLWHEEL = 'ENABLE_SCROLLWHEEL';

export const receivePosition = (position) => ({
  type: 'RECEIVE_POSITION',
  payload: {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  },
});

export const setPosition = ({ coords: { latitude: lat, longitude: lng } }) => ({
  type: 'SET_POSITION',
  payload: {
    lat,
    lng,
  },
});

export const getPosition = () => ({ dispatch }) => {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  const success = position => {
    dispatch(receivePosition(position));
  };

  const error = err => ({
    type: 'SET_POSITION_ACCESS_DENIED',
    payload: { err },
  });

  if (global.window.navigator.geolocation) {
    global.window.navigator.geolocation.getCurrentPosition(success, error, options);
    return {
      type: 'GET_POSITION',
      payload: {},
    };
  }
  return {
    type: 'SET_POSITION_ACCESS_DENIED',
    payload: {},
  };
};

const getCenter = (map) => {
  const center = map && map.getCenter();
  const lat = center && center.lat();
  const lng = center && center.lng();
  return [lat || 0, lng || 0];
};

export const setCenter = (coords) => ({ getState }) => {
  if (!coords) {
    coords = getCenter(getState().map.map);
  } else if (coords.lat && typeof coords.lat === 'function') {
    coords = [coords.lat(), coords.lng()];
  } else {
    coords = [coords.lat, coords.lng];
  }

  if (!coords[0] || !coords[1]) {
    coords = [0.0, 0.0];
  }
  const map = getState().map.map;
  const zoom = map && map.getZoom();
  const bounds = map && map.getBounds();

  return {
    type: 'SET_CENTER',
    payload: {
      coords,
      zoom,
      bounds,
    },
  };
};

export const setZoom = (zoom) => ({
  type: 'SET_ZOOM',
  payload: {
    zoom,
  },
});


export const setMap = (map) => ({
  type: 'SET_MAP',
  payload: {
    map,
    coords: getCenter(map),
    bounds: map && map.getBounds(),
    zoom: map && map.getZoom(),
  },
});

export const switchDrawing = (data) => ({ getState }) => {
  const drawing = getState().map.drawing;
  if (drawing) drawing.overlay.setMap(null);
  return ({
    type: 'SWITCH_DRAWING',
    payload: data,
  });
};

export const clearMap = () => ({ getState }) => {
  const drawing = getState().map.drawing;
  if (drawing) drawing.overlay.setMap(null);
  return {
    type: CLEAR_MAP,
  };
};

export const enableScrollwheel = () => ({
  type: ENABLE_SCROLLWHEEL,
});
