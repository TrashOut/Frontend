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
import routesList from '../routesList';
import Table from '../app/components/Table';
import translate from '../../messages/translate';
import { clear } from '../../common/table/actions';
import { connect } from 'react-redux';
import { fetchEventList } from '../../common/events/actions';

@translate
@connect(state => ({
  data: state.table.map,
  filter: state.table.filter,
  tab: state.events.selectedTab,
  type: state.table.type,
}), { clear, fetchEventList })
export default class List extends Component {
  static propTypes = {
    clear: React.PropTypes.func,
    data: React.PropTypes.object,
    fetchEventList: React.PropTypes.func,
    filter: React.PropTypes.any,
    msg: React.PropTypes.func.isRequired,
    style: React.PropTypes.any,
    tab: React.PropTypes.string,
    type: React.PropTypes.string,
  };

  componentWillMount() {
    const { fetchEventList } = this.props;
    fetchEventList();
  }

  componentWillReceiveProps(nextProps) {
    const { fetchEventList, filter } = this.props;
    if (nextProps.filter !== filter) {
      fetchEventList();
    }
  }

  shouldComponentUpdate(nextProps) {
    const { tab } = this.props;
    if (nextProps.tab === 'map') return false;
    if (tab === 'map' && nextProps.tab !== 'map') return false;
    return true;
  }

  render() {
    const { style, msg, data, type, tab, clear } = this.props;
    if (type !== 'TABLE_TYPE_EVENT' || tab === 'map') {
      clear();
      return null;
    }

    return (
      <Paper style={style}>
        <Table
          header={{
            name: { label: msg('event.name'), sortable: true },
            area: { label: msg('event.meetingPoint.listHeader'), sortable: false, type: 'area', areaDescription: '{locality}, {country}' },
            startWithTimeZone: { label: msg('event.start'), sortable: true, type: 'date', orderBy: 'start' },
            id: { label: msg('event.id'), sortable: true },
          }}
          data={data}
          showLinkButton={Boolean(true)}
          urlTemplate={routesList.eventDetail.replace(':id', '{id}')}
        />
      </Paper>
    );
  }
}
