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
import * as actions from './actions';
import { Map } from 'immutable';
import { Record } from '../transit';

const State = Record({
  currentPosition: null,
  mapAllowed: true,
  center: [50.001, 14.0001],
  geocell: [],
  map: null,
  customMaps: Map(),
  zoom: 7,
  bounds: null,
  viewport: null,
  drawingEnabled: true,
  drawing: null,
  positionReceiveDenied: false,
  isScrollwheelEnabled: false,
}, 'map');

const mapReducer = (state = new State(), action) => {
  switch (action.type) {

    case actions.SET_POSITION:
    case actions.RECEIVE_POSITION: {
      const { lat, lng } = action.payload;
      if (state.positionReceiveDenied) return state;
      return state
        .set('currentPosition', [lat, lng])
        .set('center', [lat, lng])
        .set('positionReceiveDenied', true);
    }
    case actions.GET_POSITION: {
      return state.set('mapAllowed', true);
    }
    case actions.SET_POSITION_ACCES: {
      return state.set('mapAllowed', false);
    }
    case actions.SET_MAP: {
      const { map, context } = action.payload;
      const nextState = context
        ? state.setIn(['customMaps', context], map)
        : state.set('map', map);

      return nextState.set('isScrollwheelEnabled', false);
    }
    case actions.SET_CENTER: {
      const { bounds, coords, zoom } = action.payload;

      const newState = state
        .set('center', coords)
        .set('bounds', bounds)
        .set('positionReceiveDenied', true);

      return zoom ? newState.set('zoom', zoom) : newState;
    }
    case actions.SET_ZOOM: {
      const { zoom } = action.payload;
      return state.set('zoom', zoom);
    }
    case actions.SWITCH_DRAWING: {
      return state
        .update('drawingEnabled', (v) => !v)
        .set('drawing', action.payload);
    }
    case actions.CLEAR_MAP: {
      return state
        .set('drawingEnabled', false)
        .set('drawing', null)
        .set('isScrollwheelEnabled', false);
    }
    case actions.ENABLE_SCROLLWHEEL: {
      return state
        .set('isScrollwheelEnabled', true);
    }
    default:
      return state;
  }
};

export default mapReducer;
