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
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const Colors = {
  primary: '#73b02e',
  secondary: '#8cc947',
  dark: '#434343',
  gray: '#434343',
  darkFont: '#6e6e6e',
  lightFont: '#8b8b8b',
  orange: '#F5B249',
  white: '#FFFFFF',
  lightGray: '#E0E0E0',
  darkGray: '#9b9b9b',
  yellow: '#FAFAD2',
  red: '#FF3333',
};

export const muiTheme = getMuiTheme({
  palette: {
    primary1Color: Colors.primary,
    primary2Color: Colors.secondary,
    primary3Color: Colors.dark,
    pickerHeaderColor: Colors.primary,
    accent1Color: Colors.darkFont,
  },
}, {
  avatar: {
    borderColor: null,
  },
});

export default Colors;
