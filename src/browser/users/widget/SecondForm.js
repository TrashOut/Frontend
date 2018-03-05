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
import _ from 'lodash';
import Input from '../../app/components/Input';
import React, { PureComponent as Component } from 'react';
import translate from '../../../messages/translate';
import { connect } from 'react-redux';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import { languages } from '../../../common/consts';
import { trashTypes, trashAccessibility, trashSizes, trashStatuses } from '../../../common/trashmanagement/consts';
import { validateWidget as validate } from '../../../common/users/validate';

const selector = formValueSelector('widget');

const timeBoundaries = {
  0: { id: '0', message: 'trash.filter.lastUpdate.noLimit' },
  25: { id: '25', message: 'trash.filter.lastUpdate.lastYear' },
  50: { id: '50', message: 'trash.filter.lastUpdate.lastMonth' },
  75: { id: '75', message: 'trash.filter.lastUpdate.lastWeek' },
  100: { id: '100', message: 'trash.filter.lastUpdate.today' },
};

const getOptions = (values) => ({
  global: [
    { name: 'height', message: 'user.widget.height', nonTranslatedHint: 'user.widget.height.hint', className: 'col s4' },
    { name: 'width', message: 'user.widget.width', nonTranslatedHint: 'user.widget.width.hint', className: 'col s4' },
    { name: 'language', type: 'select', message: 'user.widget.language', className: 'col s4', items: languages, selectPlaceholder: 'global.select' },
  ],
  trashDetail: [
    { name: 'id', type: 'number', message: 'user.widget.trash.id' },
  ],
  trashMap: [
    { name: 'map', type: 'map', message: 'user.widget.map' },
    { name: 'mapLat', message: 'user.widget.map.lat', className: 'col s4', type: 'disabled', defaultValue: values.lat },
    { name: 'mapLng', message: 'user.widget.map.lng', className: 'col s4', type: 'disabled', defaultValue: values.lng },
    { name: 'mapZoom', message: 'user.widget.map.zoom', className: 'col s4', type: 'disabled', defaultValue: values.zoom },
    { name: 'filterLast', type: 'select', message: 'user.widget.filterLastUpdate', className: 'col s12', items: timeBoundaries, selectPlaceholder: 'global.select' },
    { name: 'filterStatus', type: 'checkboxList', message: 'trash.status', className: 'col s12', items: _.filter(trashStatuses, (x) => x.id !== 'stillHere' && x.id !== 'less' && x.id !== 'more'), inRow: true },
    { name: 'filterSize', type: 'checkboxList', message: 'trash.trashSize', className: 'col s12', items: trashSizes, inRow: true },
    { name: 'filterType', type: 'checkboxList', message: 'trash.trashType', className: 'col s12', items: trashTypes, inRow: true },
    { name: 'filterAccessibility', type: 'checkboxList', message: 'trash.accessibility', className: 'col s12', items: trashAccessibility, inRow: true },
  ],
  eventDetail: [
    { name: 'id', type: 'number', message: 'user.widget.event.id' },
  ],
});


@translate
@reduxForm({
  form: 'widget',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
})
@connect(state => ({
  widgetType: selector(state, 'type'),
  values: {
    lat: state.map.center[0],
    lng: state.map.center[1],
    zoom: state.map.zoom,
  },
}), null)
export default class FirstForm extends Component {
  static propTypes = {
    msg: React.PropTypes.func.isRequired,
    values: React.PropTypes.object,
    widgetType: React.PropTypes.string,
  }

  render() {
    const { msg, values, widgetType } = this.props;
    const options = getOptions(values);
    const widgetOptions = options.global.concat(options[widgetType] || []);

    return (
      <div className="row">
        {widgetOptions.map((x, key) =>
          <div className={x.className || 'col s12'}>
            <Field
              key={key}
              component={Input}
              label={msg(x.message)}
              {...x}
            />
          </div>
          )}
      </div>
    );
  }
}
