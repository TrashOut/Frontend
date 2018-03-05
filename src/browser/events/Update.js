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
import Form from './form/Form';
import React, { PureComponent as Component } from 'react';
import translate from '../../messages/translate';
import { connect } from 'react-redux';
import { fetchDataForForm, updateEvent, cleanFormData, toggleLocation, fetchEvent, fetchDataForFormByIds, fetchForUpdate } from '../../common/events/actions';
import { formValueSelector, change, initialize, reduxForm } from 'redux-form';
import withRole from '../../common/app/withRole';

const selector = formValueSelector('eventCreate');

@translate
@withRole(state => ({
  event: state.events.item,
  viewer: state.users.viewer,
  isFetching: state.users.isFetching || state.events.isFetching,
}), 'event')
@connect(state => ({
  data: state.events.item,
  cleaningArea: selector(state, 'cleaningArea'),
  selectedTrashes: selector(state, 'trashPointIds'),
  item: state.events.item,
  dumb: state.events.dumb,
  isFetching: state.events.isFetching,
}), {
  toggleLocation,
  fetchDataForForm,
  fetchEvent,
  change,
  updateEvent,
  cleanFormData,
  fetchDataForFormByIds,
  initialize,
  fetchForUpdate,
})
@reduxForm({
  form: 'eventCreate',
})
export default class Update extends Component {
  static propTypes = {
    change: React.PropTypes.func,
    cleanFormData: React.PropTypes.func,
    cleaningArea: React.PropTypes.any,
    collectionPoints: React.PropTypes.object,
    data: React.PropTypes.object,
    fetchDataForForm: React.PropTypes.func,
    fetchEvent: React.PropTypes.func,
    fetchForUpdate: React.PropTypes.func,
    isFetching: React.PropTypes.bool,
    item: React.PropTypes.object,
    match: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    selectedTrashes: React.PropTypes.object,
    trashes: React.PropTypes.object,
    updateEvent: React.PropTypes.func,
  };

  state = {
    trashes: {},
    valuesLoaded: false,
  }

  componentWillMount() {
    const { fetchEvent, match } = this.props;
    fetchEvent(match.params.id);
  }

  componentWillUpdate(nextProps) {
    const { cleaningArea, fetchForUpdate } = this.props;
    if (!cleaningArea && nextProps.cleaningArea) fetchForUpdate();
  }

  render() {
    const {
      msg,
      updateEvent,
      data,
      isFetching,
    } = this.props;

    if (isFetching || !data) return null;
    const formData = data.toForm();

    return (
      <Form
        onSubmit={updateEvent}
        onToggleLocation={toggleLocation}
        defaultSelectAll={Boolean(true)}
        label={msg('event.edit.header')}
        data={{
          ...formData,
          start: {
            date: new Date(formData.start.date),
            time: new Date(formData.start.date),
          },
          end: {
            date: new Date(formData.end.date),
            time: new Date(formData.end.date),
          },
        }}
      />
    );
  }
}

