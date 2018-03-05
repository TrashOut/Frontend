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
import Colors from '../../common/app/colors';
import Paper from 'material-ui/Paper';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import SecondAppBar from '../app/components/SecondAppBar';
import Table from '../app/components/Table';
import translate from '../../messages/translate';
import { connect } from 'react-redux';
import { fetchOrganizationList } from '../../common/organizations/actions';
import { toggleFilter, setFilter, setTable } from '../../common/table/actions';

@translate
@connect(state => ({
  filter: state.table.filter,
  data: state.table.map,
}), { setFilter, toggleFilter, setTable, fetchOrganizationList })
export default class ListPage extends Component {
  static propTypes = {
    msg: React.PropTypes.func.isRequired,
    setTable: React.PropTypes.func,
    fetchOrganizationList: React.PropTypes.func,
    filter: React.PropTypes.object,
    data: React.PropTypes.object,
  };
  componentWillMount() {
    const { setTable, fetchOrganizationList } = this.props;
    setTable('TABLE_TYPE_ORGANIZATION');
    fetchOrganizationList();
  }

  componentWillReceiveProps(nextProps) {
    const { fetchOrganizationList, filter } = this.props;
    if (nextProps.filter !== filter) {
      fetchOrganizationList();
    }
  }

  render() {
    const { data, msg } = this.props;
    return (
      <div>
        <SecondAppBar
          rightUpperButtons={[
            {
              name: 'add',
              label: msg('global.create'),
              linkTo: routesList.organizationsCreate,
            },
          ]}
        />
        <div className="main-content">
          <Paper style={style}>
            <Table
              header={{
                logo: {
                  label: msg('organizations.logo'),
                  sortable: false,
                  type: 'organizationImage',
                },
                name: {
                  label: msg('organizations.name'),
                  sortable: true,
                },
                url: {
                  label: msg('global.url'),
                  sortable: false,
                  type: 'link',
                  linkName: '{contactUrl}',
                  template: '{contactUrl}',
                },
                area: {
                  label: msg('organizations.address'),
                  sortable: false,
                  type: 'calculated',
                  calculatedValue: (value) => {
                    const { country, locality } = value.area || {};
                    return [locality, country].filter(x => x).join(', ');
                  },
                },
                id: {
                  label: msg('organizations.id'),
                  sortable: true,
                },
              }}
              data={data}
              showLinkButton={Boolean(true)}
              hasPrimaryColor={Boolean(true)}
              urlTemplate={routesList.organizationsDetail.replace(':id', '{id}')}
            />
          </Paper>
        </div>
      </div>
    );
  }
}

const style = {
  tabs: {
    backgroundColor: Colors.secondary,
  },
  inkBar: {
    backgroundColor: Colors.orange,
  },
};
