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
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Input from '../app/components/Input';
import React, { PureComponent as Component } from 'react';
import translate from '../../messages/translate';
import { autobind } from 'core-decorators';
import { changeEmail } from '../../common/users/actions';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import { validateEmail as validate } from '../../common/users/validate';

@translate
@reduxForm({
  form: 'changeEmail',
  validate,
})
@connect(state => ({
  currentEmail: state.users.viewer.email,
}), { changeEmail, push })
export default class Invite extends Component {
  static propTypes = {
    changeEmail: React.PropTypes.func.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired,
  };

  @autobind
  onSubmit(values) {
    const { changeEmail } = this.props;
    changeEmail(values);
  }

  render() {
    const { handleSubmit, msg, push } = this.props;

    const buttons = [
      <FlatButton type="button" label={msg('global.cancel')} onClick={() => push('../')} />,
      <FlatButton type="submit" label={msg('global.confirm')} onClick={handleSubmit(this.onSubmit)} />,
    ];

    return (
      <Dialog
        title={msg('profile.changeEmail')}
        actions={buttons}
        open
        autoScrollBodyContent
        actionsContainerStyle={{ borderTop: '0' }}
        titleStyle={{ borderBottom: '0' }}
      >
        <form>
          <Field
            name="password"
            component={Input}
            type="password"
            label={msg('profile.currentPassword')}
          />
          <Field
            name="email"
            component={Input}
            type="text"
            label={msg('profile.newEmail')}
          />
        </form>
      </Dialog>
    );
  }
}
