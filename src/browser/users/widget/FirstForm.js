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
import Input from '../../app/components/Input';
import React, { PureComponent as Component } from 'react';
import translate from '../../../messages/translate';
import { Field, reduxForm } from 'redux-form';
import { validateWidget as validate } from '../../../common/users/validate';

export const widgetTypes = {
  trashDetail: { id: 'trashDetail', message: 'user.widget.trashDetail', url: '/trashdetail.html' },
  trashMap: { id: 'trashMap', message: 'user.widget.trashMap', url: '/trashmap.html' },
  eventDetail: { id: 'eventDetail', message: 'user.widget.eventDetail', url: '/eventdetail.html' },
  trashStatistics: { id: 'trashStatistics', message: 'user.widget.trashStatistics', url: '/statistics.html' },
};

@translate
@reduxForm({
  form: 'widget',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
})
export default class FirstForm extends Component {
  static propTypes = {
    handleSubmit: React.PropTypes.func.isRequired,
    msg: React.PropTypes.func.isRequired,
  }

  render() {
    const { handleSubmit, msg } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Field
          name="type"
          items={widgetTypes}
          type="radioList"
          component={Input}
          label={msg('user.widget.type')}
          inRow
        />
      </form>
    );
  }
}
