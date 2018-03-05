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
import React, { PureComponent as Component } from 'react';
import translate from '../../messages/translate';
import { Field, reduxForm } from 'redux-form';
import { notifications } from '../../common/consts';

@translate
@reduxForm({
  form: 'filter',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
})
export default class NotificationForm extends Component {
  static propTypes = {
    handleSubmit: React.PropTypes.func,
    msg: React.PropTypes.func,
    area: React.PropTypes.object,
  };

  render() {
    const { handleSubmit, msg, area } = this.props;
    const defaultValue = area ? Object.keys(notifications).indexOf(`${area.notificationFrequency}`) : 1;

    return (
      <form onSubmit={handleSubmit}>
        <Field
          name="notification"
          component={Input}
          type="slider"
          label={msg('user.geo.notificationFrequency')}
          min={0}
          max={Object.keys(notifications).length - 1}
          step={1}
          value={defaultValue}
          defaultValue={defaultValue}
          items={notifications}
        />
      </form>
    );
  }
}
