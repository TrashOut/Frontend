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
import './style.css';
import ForgottenPassword from './ForgottenPassword';
import React, { PureComponent as Component } from 'react';
import Register from './Register';
import RegisterSuccess from './RegisterSuccess';
import routesList from '../routesList';
import SignIn from './SignInPage';
import translate from '../../messages/translate';
import VerifyEmail from './VerifyEmail';
import { Link, Switch, Redirect } from 'react-router-dom';
import { Match } from '../../common/app/components';
import { TrashoutLogoVertical } from '../app/components/Icons';
import { withRouter } from 'react-router';
import Radium from 'radium';

@withRouter
@translate
@Radium
export default class Index extends Component {
  static propTypes = {
    location: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
  };

  render() {
    const { location, msg } = this.props;

    return (
      <div className="loginBox">
        <h1>
          <Link to={routesList.base}>
            <TrashoutLogoVertical
              style={{ width: '250px', height: '250px' }}
              viewBox="0 0 130 130"
            />
          </Link>
        </h1>
        <Switch>
          <Match
            exact
            path={routesList.registered}
            component={RegisterSuccess}
            breadcrumb={msg('global.accountCreated')}
          />
          <Match
            exact
            path={routesList.verifyEmail}
            component={VerifyEmail}
            breadcrumb={msg('global.verifyNewEmail')}
          />
          <Match
            exact
            path={routesList.register}
            component={Register}
            breadcrumb={msg('global.createNewAccount')}
          />
          <Match
            path={routesList.forgottenPassword}
            component={ForgottenPassword}
            breadcrumb={msg('profile.resetPassword')}
          />
          <Match
            path={routesList.login}
            component={SignIn}
          />
          <Match
            exact
            path={routesList.base}
            component={SignIn}
          />
          <Redirect
            to={{
              pathname: routesList.login,
              state: { from: location },
            }}
          />
        </Switch>
      </div>
    );
  }
}
