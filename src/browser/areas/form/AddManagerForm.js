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
import CircularProgress from 'material-ui/CircularProgress';
import Input from '../../app/components/Input';
import LookupTable from '../../app/components/LookupTable';
import React, { PureComponent as Component } from 'react';
import translate from '../../../messages/translate';
import { autobind } from 'core-decorators';
import { change, Field, formValueSelector, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { findUserByEmail } from '../../../common/users/actions';
import { validateUserEmail as validate } from '../../../common/users/validate';

const selector = formValueSelector('areaAddManager');

@translate
@connect(state => ({
  email: selector(state, 'managerEmail'),
  managers: selector(state, 'managers'),
  usersFetching: state.users.isFetching,
}), { change, findUserByEmail })
@reduxForm({
  form: 'areaAddManager',
  validate,
})
export default class AddManagerForm extends Component {
  static propTypes = {
    button: React.PropTypes.string,
    change: React.PropTypes.func,
    email: React.PropTypes.string,
    findUserByEmail: React.PropTypes.func,
    handleSubmit: React.PropTypes.func,
    label: React.PropTypes.string,
    managers: React.PropTypes.array,
    msg: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func,
    usersFetching: React.PropTypes.bool,
  };

  @autobind
  async onManagerAdd() {
    const { findUserByEmail, email, managers } = this.props;
    if (!email) return;
    await findUserByEmail(email, managers, 'areaAddManager', 'managers', 'managerEmail');
  }

  @autobind
  onManagerRemove(id) {
    const { change, managers } = this.props;
    const result = { ...managers };
    delete result[id];
    change('managers', result);
  }

  render() {
    const { label, button, handleSubmit, managers, msg, onSubmit, usersFetching } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        { (usersFetching && <CircularProgress size={80} thickness={5} />) ||
          <LookupTable
            values={managers}
            attributes={['id', 'firstName', 'lastName', 'email']}
            showRemove
            onRemove={this.onManagerRemove}
          />
        }
        <Field
          name="managerEmail"
          type="lookup"
          label={label || msg('global.findUser')}
          addLabel={button || msg('global.selectUser')}
          onAdd={this.onManagerAdd}
          component={Input}
        />
      </form>
    );
  }
}
