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
import { trashSelect, setPage, setPageItemsLimit, toggleOrderBy, fetchTrashList } from '../../common/trashmanagement/actions';
import { trashStatuses, trashSizes } from '../../common/trashmanagement/consts';

@translate
@connect(state => ({
  filter: state.table.filter,
  data: state.table.get('map'),
  type: state.table.type,
  tab: state.trashes.selectedTab,
}), { clear, trashSelect, setPageItemsLimit, setPage, toggleOrderBy, fetchTrashList })
export default class List extends Component {
  static propTypes = {
    clear: React.PropTypes.func,
    data: React.PropTypes.object,
    fetchTrashList: React.PropTypes.func,
    filter: React.PropTypes.any,
    msg: React.PropTypes.func.isRequired,
    pathname: React.PropTypes.string,
    setTable: React.PropTypes.func,
    style: React.PropTypes.any,
    tab: React.PropTypes.string,
    type: React.PropTypes.string,
  };

  componentWillMount() {
    const { fetchTrashList } = this.props;
    fetchTrashList();
  }

  componentWillReceiveProps(nextProps) {
    const { fetchTrashList, filter } = this.props;

    if (nextProps.filter !== filter) {
      fetchTrashList();
    }
  }

  shouldComponentUpdate(nextProps) {
    const { tab } = this.props;
    if (nextProps.tab === 'map') return false;
    if (tab === 'map' && nextProps.tab !== 'map') return false;
    return true;
  }

  render() {
    const { style, msg, data } = this.props;

    return (
      <Paper style={style}>
        <Table
          header={{
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
          }}
          data={data}
          showLinkButton={Boolean(true)}
          urlTemplate={routesList.trashDetail.replace(':id', '{id}')}
          translatedFields={{
            status: trashStatuses,
            trashSize: trashSizes,
          }}
        />
      </Paper>
    );
  }
}
