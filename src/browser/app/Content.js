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
import AppBar from '../app/components/AppBar';
import AreaIndex from '../areas';
import ArticleIndex from '../articles/index';
import ChangeMyPassword from '../users/ChangePassword';
import CollectionPoints from '../collectionpoints';
import EditMyProfile from '../users/Edit';
import EventIndex from '../events/index';
import MyProfile from '../users/MyProfile';
import ErrorPage from './ErrorPage';
import OrganizationIndex from '../organizations/index';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import SpamIndex from '../spam/index';
import translate from '../../messages/translate';
import TrashManagementIndex from '../trashmanagement';
import Users from '../users/index';
import { connect } from 'react-redux';
import { Match } from '../../common/app/components';
import { Switch, Route, Redirect } from 'react-router-dom';
import { toggleMenu } from '../../common/window/actions';
import SignOut from '../auth/SignOut';

@translate
@connect(state => ({
  device: state.device.get('device'),
  breadcrumbs: state.breadcrumbs.get('list'),
}), { toggleMenu })
export default class Content extends Component {
  static propTypes = {
    breadcrumbs: React.PropTypes.object,
    device: React.PropTypes.string,
    msg: React.PropTypes.func.isRequired,
    toggleMenu: React.PropTypes.func.isRequired,
  }

  render() {
    const { breadcrumbs, device, toggleMenu, msg } = this.props;
    return (
      <div className="colmain" style={styles.content}>
        <AppBar
          showMenuIconButton={(device === 'mobile')}
          onMenuClick={toggleMenu}
          breadcrumbs={breadcrumbs}
        />
        <div style={styles.pages}>
          <Switch>
            <Match
              path={routesList.trashBase}
              component={TrashManagementIndex}
              breadcrumb={msg('trash.header')}
            />
            <Match
              path={routesList.collectionPointBase}
              component={CollectionPoints}
              breadcrumb={msg('collectionPoint.header')}
            />
            <Match
              userRole="admin"
              path={routesList.notificationBase}
              component={SpamIndex}
              breadcrumb={msg('notifications.header')}
            />
            <Match
              path={routesList.eventBase}
              component={EventIndex}
              breadcrumb={msg('event.header')}
            />
            <Match
              path={routesList.organizationsBase}
              component={OrganizationIndex}
              breadcrumb={msg('organizations.header')}
            />
            <Match
              path={routesList.userBase}
              userRole="admin"
              component={Users}
              breadcrumb={msg('user.header')}
            />
            <Match
              path={routesList.editProfile}
              component={EditMyProfile}
              breadcrumb={msg('tab.profile')}
            />
            <Match
              exact
              path={routesList.changePassword}
              component={ChangeMyPassword}
              breadcrumb={msg('profile.changePassword')}
            />
            <Match
              path={routesList.myProfile}
              component={MyProfile}
              breadcrumb={msg('user.myProfile')}
            />
            <Match
              userRole="manager"
              path={routesList.areaBase}
              component={AreaIndex}
              breadcrumb={msg('geo.header')}
            />
            <Match
              path={routesList.articleBase}
              component={ArticleIndex}
              breadcrumb={msg('news.header')}
            />
            <Match
              path={routesList.unauthorized}
              component={ErrorPage}
              customProps={{ type: 'unauthorized' }}
              breadcrumb={msg('global.unauthorized')}
            />
            <Match
              path={routesList.notFound}
              component={ErrorPage}
              customProps={{ type: 'notFound' }}
              breadcrumb={msg('global.pageNotFound')}
            />
            <Match
              path={routesList.signout}
              component={SignOut}
              breadcrumb={msg('global.signOut')}
            />
            <Route
              exact
              path={routesList.base}
              render={() => <Redirect to={routesList.trashList} />}
            />
            <Route
              exact
              path={routesList.signin}
              render={() => <Redirect to={routesList.trashList} />}
            />
            <Route
              render={() => <Redirect to={routesList.notFound} />}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

const styles = {
  content: {
    background: '#F0F0F0',
    minHeight: '100vh',
  },
  pages: {
    zIndex: '0',
    position: 'relative',
  },
};

