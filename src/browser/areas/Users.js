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
import Confirm from '../app/components/Confirm';
import Paper from 'material-ui/Paper';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import Table from '../app/components/Table';
import translate from '../../messages/translate';
import { addConfirm } from '../../common/confirms/actions';
import { addManager, assignManagers } from '../../common/areas/actions';
import { areaTypes } from '../../common/consts';
import { connect } from 'react-redux';
import { fetchAreaUsers } from '../../common/users/actions';

@translate
@connect(state => ({
  isAreaFetching: state.areas.isAreaFetching,
  item: state.areas.item,
  users: state.users.areaUsers,
}), { addConfirm, addManager, assignManagers, fetchAreaUsers })
export default class Users extends Component {
  static propTypes = {
    addConfirm: React.PropTypes.func,
    addManager: React.PropTypes.func,
    assignManagers: React.PropTypes.func.isRequired,
    fetchArea: React.PropTypes.func,
    fetchAreaUsers: React.PropTypes.func,
    isAreaFetching: React.PropTypes.bool,
    item: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    params: React.PropTypes.func.object,
    type: React.PropTypes.string,
    users: React.PropTypes.any,
  };
  static contextTypes = {
    router: React.PropTypes.object,
  }

  getRole() {
    const { type } = this.props;
    switch (type) {
      case 'admin':
        return 1;
      case 'manager':
        return 2;
      default:
        return 3;
    }
  }

  render() {
    const { addConfirm, type, fetchAreaUsers, assignManagers, users, msg, item } = this.props;
    const id = item.id;

    const removeAdmin = (this.getRole() === 1) ? {
      removeAdmin: {
        label: msg('geo.removeAdmin'),
        sortable: false,
        type: 'button',
        onClick: (values) =>
          addConfirm(`remove-${type}`, {
            onSubmit: () => assignManagers([values.id], [values.id], values.typeValueId, '3', 0, async () => await fetchAreaUsers(id, 1), 'remove'),
          }),
        linkName: msg('global.remove'),
      },
    } : {};

    const usersArea = (users && users.get(id) && users.get(id).get(this.getRole())) || [];

    return (
      <div>
        <Paper>
          <Confirm
            cancelLabel={msg('global.cancel')}
            submitLabel={msg('global.confirm')}
            title={msg('global.confirmation.header')}
          />
          <Table
            isPagination={Boolean(false)}
            header={{
              userId: {
                label: msg('user.id'),
              },
              firstName: { label: msg('user.firstName'), sortable: false },
              lastName: { label: msg('user.lastName'), sortable: false },
              type: { label: msg('geo.type'), sortable: false },
              typeValue: { label: msg('geo.name'), sortable: false },
              detail: {
                label: msg('global.showDetail'),
                sortable: false,
                type: 'link',
                linkName: msg('global.detail'),
                template: routesList.userDetail.replace(':id', '{id}'),
              },
              ...removeAdmin,
            }}
            data={usersArea.map(x => ({
              ...x.area,
              ...x,
            }))}
            showLinkButton={Boolean(false)}
            isLocal
            selectable={Boolean(false)}
            translatedFields={{
              type: areaTypes,
            }}
          />
        </Paper>
      </div>
    );
  }
}
