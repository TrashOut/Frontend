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
import App from './App';
import React from 'react';
import { clearMessages } from '../../common/messages/actions';
import { connect, Provider as Redux } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { deleteBreadcrumbs } from '../../common/breadcrumbs/actions';
import { Route } from 'react-router-dom';
import { setLocation } from '../../common/app/actions';
import { StyleRoot } from 'radium';
import { withRouter } from 'react-router';

@withRouter
@connect(state => ({
  pathname: state.app.location && state.app.location.pathname,
}), { clearMessages, deleteBreadcrumbs, setLocation })
export class AppWithRouter extends React.PureComponent {
  static propTypes = {
    clearMessages: React.PropTypes.func,
    deleteBreadcrumbs: React.PropTypes.func,
    getPosition: React.PropTypes.func,
    location: React.PropTypes.object,
    pathname: React.PropTypes.string,
    setLocation: React.PropTypes.func,
  };

  componentWillMount() {
    const { location, setLocation } = this.props;
    setLocation(location);
  }

  componentWillUpdate(nextProps) {
    const { clearMessages, location, setLocation, deleteBreadcrumbs } = this.props;
    if (location.pathname !== nextProps.location.pathname) {
      setLocation(nextProps.location);
      deleteBreadcrumbs();
      clearMessages();
    }
  }

  render() {
    return <Route path="/" component={App} />;
  }
}

const Root = ({ userAgent, store, history }) => (
  <StyleRoot radiumConfig={{ userAgent }} >
    <Redux store={store}>
      <ConnectedRouter history={history}>
        <AppWithRouter />
      </ConnectedRouter>
    </Redux>
  </StyleRoot>
);

Root.propTypes = {
  history: React.PropTypes.object,
  store: React.PropTypes.object,
  userAgent: React.PropTypes.string,
};

export default connect(state => ({ userAgent: state.device.userAgent }))(Root);
