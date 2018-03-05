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
import Export from './Export';
import Filter from './Filter';
import Paper from 'material-ui/Paper';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import SecondAppBar from '../app/components/SecondAppBar';
import Table from '../app/components/Table';
import translate from '../../messages/translate';
import withRole from '../../common/app/withRole';
import { connect } from 'react-redux';
import { fetchUsers } from '../../common/users/actions';
import { globalRoles } from '../../roles';
import { Match } from '../../common/app/components';
import { setTable, setFilter, toggleFilter } from '../../common/table/actions';
import { Switch } from 'react-router-dom';

@translate
@connect(state => ({
  filter: state.table.filter,
  data: state.table.map,
  showFilter: state.table.showFilter,
}), { fetchUsers, toggleFilter, setTable, setFilter })
@withRole()
export default class List extends Component {
  static propTypes = {
    data: React.PropTypes.array,
    fetchUsers: React.PropTypes.func,
    filter: React.PropTypes.any,
    msg: React.PropTypes.func.isRequired,
    setFilter: React.PropTypes.func,
    setTable: React.PropTypes.func,
    showFilter: React.PropTypes.func,
    toggleFilter: React.PropTypes.bool,
    roles: React.PropTypes.object,
  };

  componentWillMount() {
    const { fetchUsers, setTable } = this.props;
    setTable('TABLE_TYPE_USER');
    fetchUsers();
  }

  componentWillReceiveProps(nextProps) {
    const { fetchUsers, filter } = this.props;
    if (nextProps.filter !== filter) {
      fetchUsers();
    }
  }

  render() {
    const { roles, showFilter, setFilter, toggleFilter, data, msg } = this.props;
    return (
      <div>
        <SecondAppBar
          rightUpperButtons={[
            {
              name: 'filter',
              label: msg(showFilter ? 'global.hideFilter' : 'global.showFilter'),
              onClick: toggleFilter,
            },
            {
              name: 'export',
              label: msg('global.export'),
              userRole: 'superAdmin',
              linkTo: routesList.userExport,
            },
          ]}
        />
        <div className="main-content">
          <Switch>
            <Match
              userRole="superAdmin"
              exactly
              path={routesList.userExport}
              component={Export}
            />
          </Switch>
          <Filter onSubmit={(values) => { setFilter(values); toggleFilter(); }} />
          <Paper style={style}>
            <Table
              header={{
                firstName: { label: msg('user.firstName'), sortable: true },
                lastName: { label: msg('user.lastName'), sortable: true },
                userRoleId: { label: msg('profile.role'), sortable: false },
                email: { label: msg('global.email'), sortable: true, hide: !roles.isAuthorized('superAdmin') },
                points: { label: msg('user.points'), sortable: false },
              }}
              data={data}
              showLinkButton={Boolean(true)}
              urlTemplate={routesList.userDetail.replace(':id', '{id}')}
              hasPrimaryColor
              translatedFields={{
                userRoleId: globalRoles,
              }}
            />
          </Paper>
        </div>
      </div>
    );
  }
}

const style = {
  tableFooter: {
    width: '96%',
    marginLeft: '2%',
    marginRight: '2%',
    marginTop: '10px',
    paddingBottom: '20px',
  },
};
