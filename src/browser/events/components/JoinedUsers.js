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
import withRole from '../../../common/app/withRole';

@translate
@withRole()
export default class JoinedUsersTable extends Component {
  static propTypes = {
    data: React.PropTypes.array,
    msg: React.PropTypes.func.isRequired,
    setTable: React.PropTypes.func.isRequired,
    roles: React.PropTypes.object,
  };

  render() {
    const { data, msg, roles } = this.props;

    return (
      <Paper>
        <Table
          header={{
            name: {
              label: msg('user.name'),
              sortable: false,
              type: roles.isAuthorized('admin') ? 'link' : null,
              linkName: '{firstName} {lastName}',
              template: routesList.userDetail.replace(':id', '{id}'),
            },
            confirmed: {
              label: msg('user.confirmed'),
              sortable: false,
              type: 'calculated',
              calculatedValue: x => x.confirmed
                ? msg('user.confirmed.true')
                : msg('user.confirmed.false'),
            },
          }}
          data={data}
          isLocal
          showLinkButton={Boolean(false)}
          isPagination={Boolean(false)}
          selectable={Boolean(false)}
        />
      </Paper>
    );
  }
}

