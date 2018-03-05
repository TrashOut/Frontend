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
import Link from '../app/components/Link';
import Paper from 'material-ui/Paper';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import translate from '../../messages/translate';
import { sendEmailVerification } from '../../common/lib/redux-firebase/actions';
import { connect } from 'react-redux';

@translate
@connect(null, { sendEmailVerification })
export default class VerifyEmail extends Component {
  static propTypes = {
    msg: React.PropTypes.func.isRequired,
    sendEmailVerification: React.PropTypes.func,
    location: React.PropTypes.object,
  };

  state = {
    emailResent: false,
  };

  resendVerificationEmail(email, password) {
    const { sendEmailVerification } = this.props;

    if (email && password) {
      sendEmailVerification(email, password);
      this.setState({ emailResent: true });
    }
  }

  render() {
    const { msg, location: { state } } = this.props;
    const { email, password } = state || {};

    return (
      <div>
        {this.state.emailResent &&
          <Paper className="paper" style={{ marginBottom: '20px' }}>
            <h3>{msg('global.emailResent')}</h3>
          </Paper>
        }
        <Paper className="paper">
          <h3 style={styles.center}>{msg('global.activateAccount.header')}</h3>
          <p>{msg('global.activateAccount')}</p>
        </Paper>
        <p style={styles.center}>
          <Link
            to={routesList.login}
          >
            &larr; {msg('global.backToLogin')}
          </Link>
          {email && password && [
            <span style={{ margin: '0 30px' }}>|</span>,
            <a href="#resend" onClick={() => this.resendVerificationEmail(email, password)}>
              {msg('global.resendVerificationEmail')}
            </a>]
          }
        </p>
      </div>
    );
  }
}

const styles = {
  center: {
    textAlign: 'center',
  },
};
