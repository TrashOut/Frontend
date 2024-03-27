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
import Input from '../app/components/Input';
import Link from '../app/components/Link';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import routesList from '../routesList';
import translate from '../../messages/translate';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { forgottenPassword } from '../../common/lib/redux-firebase/actions';
import { Match } from '../../common/app/components';
import { validateForgottenPassword as validate } from '../../common/auth/validate';

const ForgottenPasswordSuccess = translate(({ msg }) => (
  <Paper
    className="paper"
    style={styles.success}
  >
    <p>{msg('user.validation.resetPassword.success')}</p>
  </Paper>
));

@translate
@connect(null, { forgottenPassword })
@reduxForm({
  form: 'forgottenPassword',
  validate,
})
export default class ForgottenPassword extends React.Component {
  static propTypes = {
    disabled: React.PropTypes.bool.isRequired,
    msg: React.PropTypes.func.isRequired,
    forgottenPassword: React.PropTypes.func.isRequired,
    handleSubmit: React.PropTypes.func,
    submitting: React.PropTypes.bool,
  };

  forgottenPassword(values) {
    const { forgottenPassword } = this.props;
    forgottenPassword(values);
  }

  render() {
    const { submitting, msg, handleSubmit } = this.props;
    return (
      <div>
        <Match
          path={routesList.forgottenPasswordSuccess}
          exactly
          component={ForgottenPasswordSuccess}
        />
        <Paper className="paper">
          <h3 style={styles.center}>{msg('profile.resetPassword')}</h3>
          <form
            onSubmit={handleSubmit(values => this.forgottenPassword(values))}
          >
            <Field
              name="email"
              type="text"
              component={Input}
              label={msg('global.email')}
              hint={msg('global.email')}
            />
            <RaisedButton
              label={msg('profile.resetPassword')}
              type="submit"
              disabled={submitting}
              fullWidth
              primary
            />
          </form>
        </Paper>
        <p style={styles.center}>
          <Link
            to={routesList.login}
          >
            &larr; {msg('global.backToLogin')}
          </Link>
        </p>
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
  center: {
    textAlign: 'center',
  },
  success: {
    marginBottom: '15px',
  },
  accept: {
    textAlign: 'center',
  },
};
