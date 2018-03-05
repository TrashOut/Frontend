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
import Colors from '../../common/app/colors';
import Input from '../app/components/Input';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import Recaptcha from 'react-recaptcha';
import translate from '../../messages/translate';
import { clearBadLoginCount } from '../../common/auth/actions';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { signIn } from '../../common/lib/redux-firebase/actions';
import { validateLogin as validate } from '../../common/auth/validate';

@translate
@connect(state => ({
  disabled: state.auth.formDisabled,
  error: state.auth.error,
  badLoginCount: state.auth.badLoginCount,
}), { clearBadLoginCount, signIn })
@reduxForm({
  form: 'login',
  validate,
})
export default class Email extends React.Component {
  static propTypes = {
    badLoginCount: React.PropTypes.number,
    clearBadLoginCount: React.PropTypes.func.isRequired,
    disabled: React.PropTypes.bool.isRequired,
    error: React.PropTypes.string,
    handleSubmit: React.PropTypes.func,
    msg: React.PropTypes.func.isRequired,
    redirect: React.PropTypes.bool,
    signIn: React.PropTypes.func.isRequired,
  };

  signInViaPassword(values) {
    const { signIn, redirect } = this.props;
    signIn('password', values, redirect);
  }

  renderRecaptcha() {
    const { clearBadLoginCount } = this.props;

    return (
      <div style={styles.recaptcha}>
        <Recaptcha
          sitekey="6LcvrjEUAAAAAE_3Sd4nhLNtU-EiPJimP_TA9mFG"
          render="explicit"
          verifyCallback={() => clearBadLoginCount()}
        />
      </div>
    );
  }

  render() {
    const { badLoginCount, error, msg, handleSubmit } = this.props;
    const needRecaptcha = badLoginCount > 2;

    return (
      <div>
        <form onSubmit={handleSubmit(values => this.signInViaPassword(values))}>
          <Field
            name="email"
            type="text"
            component={Input}
            label={msg('global.email')}
            hint={msg('global.email')}
          />
          <Field
            name="password"
            type="password"
            component={Input}
            label={msg('global.password')}
            hint={msg('global.password')}
          />
          {needRecaptcha && this.renderRecaptcha()}
          {error && <strong>{error}</strong>}
          <RaisedButton
            label={msg('global.signIn')}
            type="submit"
            backgroundColor={Colors.secondary}
            labelColor="white"
            fullWidth="true"
            disabled={needRecaptcha}
          />
        </form>
      </div>
    );
  }
}

const styles = {
  recaptcha: {
    float: 'left',
    marginTop: '15px',
    marginBottom: '15px',
  },
};
