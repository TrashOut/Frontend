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
import Email from './Email';
import Match from '../../common/app/components/Match';
import Paper from 'material-ui/Paper';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import Social from './Social';
import translate from '../../messages/translate';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Locale from "./Locale";

const UserDisabled = translate(({ msg }) => (
  <Paper className="paper" style={styles.disabled}>
    <h3 style={styles.disabled.text}>{msg('global.accountDisabled.title')}</h3>
    <p>{msg('global.accountDisabled.text')}</p>
  </Paper>
));

const UserActivated = translate(({ msg }) => (
  <Paper className="paper" style={styles.disabled}>
    <h3 style={styles.disabled.text}>{msg('global.accountActivated.title')}</h3>
    <p>{msg('global.accountActivated.text')}</p>
  </Paper>
));

@translate
@connect(state => ({
  disabled: state.auth.formDisabled,
}))
export default class SignInPage extends Component {
  propTypes = {
    location: React.PropTypes.object,
    disabled: React.PropTypes.bool.isRequired,
    msg: React.PropTypes.func.isRequired,
  };

  render() {
    const { location, msg } = this.props;
    const pathname = (((location || {}).state || {}).from || {}).pathname || routesList.trashList;

    return (
      <div>
        <Match
          path={routesList.userDisabled}
          exactly
          component={UserDisabled}
        />
        <Match
          path={routesList.userActivated}
          exactly
          component={UserActivated}
        />
        <Paper className="paper">
          <h3 style={styles.heading}>{msg('global.signIn')}</h3>
          <Email redirect={pathname} />
          <Social redirect={pathname} />
        </Paper>
        <p style={styles.content}>
          <Link to={routesList.forgottenPassword}>
            {msg('profile.resetPassword')}
          </Link>
          <span style={{ margin: '0 30px' }}>|</span>
          <Link to={routesList.register}>
            {msg('global.createNewAccount')}
          </Link>
        </p>
        <Locale/>
        <p style={styles.accept}>
          {msg('global.signUp.acceptRegister.startSentense')}
          <a href="https://www.trashout.ngo/policy"> {msg('global.signUp.acceptRegister.privatePolicy')} </a>
          {msg('global.signUp.acceptRegister.and')}
          <a href="https://www.trashout.ngo/terms"> {msg('global.signUp.acceptRegister.terms')} </a>
        </p>
      </div>
    );
  }
}

const styles = {
  disabled: {
    marginBottom: '20px',
    text: {
      textAlign: 'center',
    },
  },
  heading: {
    textAlign: 'center',
  },
  content: {
    textAlign: 'center',
  },
  accept: {
    textAlign: 'center',
  },
};
