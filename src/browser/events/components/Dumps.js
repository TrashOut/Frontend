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
import { fetchEventTrashes } from '../../../common/events/actions';
import { setTable } from '../../../common/table/actions';
import { trashStatuses, trashSizes } from '../../../common/trashmanagement/consts';

const tableHeader = (msg) => ({
  image: {
    label: msg('trash.image'),
    sortable: false,
    type: 'trashImage',
  },
  status: { label: msg('trash.status'), sortable: true },
  trashSize: { label: msg('trash.trashSize'), sortable: true },
  area: { label: msg('trash.address'), sortable: false, type: 'area', areaDescription: '{locality}, {country}' },
  created: { label: msg('trash.created'), sortable: true, type: 'date' },
  id: { label: msg('trash.id'), sortable: true },
  showDetail: { label: msg('global.showDetail'), sortable: false, type: 'link', linkName: msg('global.showDetail'), template: routesList.trashDetail.replace(':id', '{id}') },
});

@connect(state => ({
  filter: state.table.filter,
  items: state.table.map,
}), { fetchEventTrashes, setTable })
@translate
export default class DumpsTable extends Component {
  static propTypes = {
    data: React.PropTypes.array,
    fetchEventTrashes: React.PropTypes.func,
    items: React.PropTypes.array,
    msg: React.PropTypes.func.isRequired,
    setTable: React.PropTypes.func.isRequired,
    shouldFetch: React.PropTypes.bool,
  };

  componentWillMount() {
    const { fetchEventTrashes, shouldFetch, setTable } = this.props;

    if (shouldFetch) {
      setTable('TABLE_TYPE_TRASH');
      fetchEventTrashes();
    }
  }

  renderStaticTable() {
    const { data, msg } = this.props;

    return (
      <Paper>
        <Table
          header={tableHeader(msg)}
          data={data}
          isLocal
          showLinkButton={Boolean(false)}
          isPagination={Boolean(false)}
          selectable={Boolean(false)}
          translatedFields={{
            status: trashStatuses,
            trashSize: trashSizes,
          }}
        />
      </Paper>
    );
  }

  renderDynamicTable() {
    const { fetchEventTrashes, items, msg } = this.props;

    return (
      <Paper>
        <Table
          header={tableHeader(msg)}
          onPageChange={() => fetchEventTrashes()}
          data={items}
          showLinkButton={Boolean(false)}
          selectable={Boolean(false)}
          translatedFields={{
            status: trashStatuses,
            trashSize: trashSizes,
          }}
        />
      </Paper>
    );
  }

  render() {
    const { shouldFetch } = this.props;
    return shouldFetch
      ? this.renderDynamicTable()
      : this.renderStaticTable();
  }
}
