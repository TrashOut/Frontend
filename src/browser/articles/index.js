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
import Create from './Create';
import Detail from './Detail';
import List from './Listpage';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import Update from './Update';
import { Match } from '../../common/app/components';
import { Switch } from 'react-router-dom';

export default class Index extends Component {
  render() {
    return (
      <Switch>
        <Match
          exact
          path={routesList.articleCreate}
          component={Create}
          userRole="manager"
        />
        <Match
          path={routesList.articleList}
          component={List}
        />
        <Match
          path={routesList.articleDetail}
          component={Detail}
        />
        <Match
          path={routesList.articleUpdate}
          component={Update}
          userRole="manager"
        />
      </Switch>
    );
  }
}
