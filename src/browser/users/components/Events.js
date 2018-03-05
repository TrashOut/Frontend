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
import Paper from 'material-ui/Paper';
import React, { PureComponent as Component } from 'react';
import routesList from '../../routesList';
import Table from '../../app/components/Table';
import translate from '../../../messages/translate';
import { connect } from 'react-redux';
import { setTable, changeFilterItem } from '../../../common/table/actions';
import { fetchUserEvents } from '../../../common/users/actions';

const activityEventActions = {
  create: { id: 'create', message: 'profile.myEvents.userRole.creator' },
  join: { id: 'join', message: 'profile.myEvents.userRole.joined' },
};

const tableHeader = (msg) => ({
  name: {
    label: msg('event.name'),
    sortable: false,
    type: 'link',
    template: routesList.eventDetail.replace(':id', '{id}'),
    style: {
      width: '120px',
    },
  },
  start: {
    label: msg('event.start'),
    sortable: false,
    type: 'date',
  },
  action: {
    label: msg('profile.myEvents.userRole'),
    sortable: false,
  },
  timeDecisions: {
    label: msg('profile.myEvents.timeDecision'),
    sortable: false,
    type: 'calculated',
    calculatedValue: (x) => new Date(x.start) < new Date()
      ? msg('profile.myEvents.timeDecision.past')
      : msg('profile.myEvents.timeDecision.future'),
  },
});

@connect(state => ({
  filter: state.table.filter,
  items: state.table.map,
}), { changeFilterItem, fetchUserEvents, setTable })
@translate
export default class EventsTable extends Component {
  static propTypes = {
    fetchUserEvents: React.PropTypes.func.isRequired,
    items: React.PropTypes.array,
    msg: React.PropTypes.func.isRequired,
    setTable: React.PropTypes.func.isRequired,
    userId: React.PropTypes.number,
  };

  componentWillMount() {
    const { fetchUserEvents, setTable, userId } = this.props;

    setTable('TABLE_TYPE_EVENT');
    fetchUserEvents(userId);
  }

  render() {
    const { items, msg } = this.props;
    return (
      <Paper>
        <Table
          header={tableHeader(msg)}
          data={items}
          showLinkButton={Boolean(false)}
          selectable={Boolean(false)}
          isPagination={Boolean(false)}
          translatedFields={{
            action: activityEventActions,
          }}
        />
      </Paper>
    );
  }
}
