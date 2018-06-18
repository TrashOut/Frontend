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
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import translate from '../../messages/translate';
import { connect } from 'react-redux';
import { formValueSelector, Field, reduxForm } from 'redux-form';
import { languages } from '../../common/consts';
import { signUp } from '../../common/lib/redux-firebase/actions';
import { validateRegister as validate } from '../../common/auth/validate';

const selector = formValueSelector('register');

@translate
@reduxForm({
  form: 'register',
  validate,
})
@connect(state => ({
  agreementAccepted: selector(state, 'agreement'),
}), { signUp })
export default class Register extends Component {
  static propTypes = {
    handleSubmit: React.PropTypes.func,
    msg: React.PropTypes.func.isRequired,
    signUp: React.PropTypes.func,
    agreementAccepted: React.PropTypes.bool,
  };

  render() {
    const { agreementAccepted, handleSubmit, msg, signUp } = this.props;
    return (
      <div>
        <Paper className="paper">
          <h3 style={styles.center}>{msg('global.createNewAccount')}</h3>
          <form onSubmit={handleSubmit(values => signUp('password', values))}>
            <Field
              name="email"
              type="text"
              component={Input}
              label={msg('global.email')}
              hint={msg('global.email')}
            />
            <Field
              name="firstName"
              type="text"
              component={Input}
              label={msg('user.firstName')}
              hint={msg('user.firstName')}
            />
            <Field
              name="lastName"
              type="text"
              component={Input}
              label={msg('user.lastName')}
              hint={msg('user.lastName')}
            />
            <Field
              name="language"
              type="select"
              component={Input}
              items={languages}
              label={msg('user.language')}
              hint={msg('user.language')}
              selectPlaceholder="global.select"
            />
            <Field
              name="password"
              type="password"
              component={Input}
              label={msg('user.password')}
              hint={msg('user.password')}
            />
            <Field
              name="password_validation"
              type="password"
              component={Input}
              label={msg('user.reEnterPassword')}
              hint={msg('user.reEnterPassword')}
            />
            <Field
              name="agreement"
              type="checkbox"
              component={Input}
              label={msg('user.agreement')}
              hint={msg('user.agreement')}
              wrapperStyle={{ marginTop: '20px', marginBottom: '20px' }}
            />
            <RaisedButton
              type="submit"
              label={msg('global.createNewAccount')}
              primary={Boolean(true)}
              disabled={!agreementAccepted}
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
      </div>
    );
  }
}

const styles = {
  center: {
    textAlign: 'center',
  },
};
