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
import Confirm from '../../app/components/Confirm';
import React, { PureComponent as Component } from 'react';
import routesList from '../../routesList';
import Table from '../../app/components/Table';
import translate from '../../../messages/translate';
import { addConfirm } from '../../../common/confirms/actions';
import { areaTypes } from '../../../common/consts';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { fetchArea, setDataTab, assignManagers } from '../../../common/areas/actions';
import { fetchAreaUsers } from '../../../common/users/actions';
import { push } from 'react-router-redux';
import { Tabs, Tab } from 'material-ui/Tabs';

@translate
@connect(state => ({
  isFetching: state.users.isFetching || state.areas.isFetching,
  item: state.areas.item,
  areaUsers: state.users.areaUsers,
  selectedTab: state.areas.selectedTab || 'managers',
}), { addConfirm, assignManagers, fetchAreaUsers, fetchArea, setDataTab, push })
export default class Detail extends Component {
  static propTypes = {
    addConfirm: React.PropTypes.func,
    areaUsers: React.PropTypes.object,
    assignManagers: React.PropTypes.func.isRequired,
    fetchArea: React.PropTypes.func,
    fetchAreaUsers: React.PropTypes.func,
    isAreaFetching: React.PropTypes.bool,
    isFetching: React.PropTypes.bool,
    item: React.PropTypes.object,
    match: React.PropTypes.func.object,
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired,
    selectedTab: React.PropTypes.string,
    setDataTab: React.PropTypes.func,
  };

  componentWillMount() {
    this.fetchAreas();
  }

  onRemoveManager(values) {
    const { assignManagers } = this.props;
    return assignManagers([values.userId], [values.userId], values.typeValueId, 3, 0, async () => await this.fetchAreas(), 'remove');
  }

  async fetchAreas() {
    const { fetchArea, fetchAreaUsers, match: { params: { id } } } = this.props;

    await fetchArea(id);
    await fetchAreaUsers(id, 2);
    await fetchAreaUsers(id, 3);
  }

  @autobind
  renderTable(roleId) {
    const { addConfirm, isFetching, areaUsers, msg, match: { params: { id } } } = this.props;

    if (isFetching) return null;

    const managerRemove = roleId === 2
      ? {
        remove: {
          label: msg('geo.removeManager'),
          sortable: false,
          type: 'button',
          linkName: msg('global.remove'),
          onClick: (values) => addConfirm('remove-manager', {
            onSubmit: () => this.onRemoveManager(values),
          }),
        } }
      : {};

    return (<Table
      isPagination={Boolean(false)}
      header={{
        userId: {
          label: msg('user.id'),
        },
        firstName: { label: msg('user.firstName'), sortable: false },
        lastName: { label: msg('user.lastName'), sortable: false },
        email: { label: msg('global.email'), sortable: false },
        type: { label: msg('geo.type'), sortable: false },
        typeValue: { label: msg('geo.name'), sortable: false },
        detail: {
          label: msg('global.detail'),
          sortable: false,
          type: 'link',
          linkName: msg('global.detail'),
          template: routesList.userDetail.replace(':id', '{id}'),
        },
        ...managerRemove,
      }}
      data={(areaUsers && areaUsers.getIn([id, roleId])) || []}
      showLinkButton={Boolean(false)}
      isLocal
      selectable={Boolean(false)}
      translatedFields={{
        type: areaTypes,
      }}
    />);
  }

  render() {
    const { item, setDataTab, selectedTab, msg } = this.props;

    return (
      <div>
        <h2>{item.name}</h2>
        <Confirm
          cancelLabel={msg('global.cancel')}
          submitLabel={msg('global.confirm')}
          title={msg('global.confirmation.header')}
        />
        <Tabs
          value={selectedTab}
          onChange={setDataTab}
        >
          <Tab label={msg('geo.managers')} value="managers">
            {this.renderTable(2)}
          </Tab>
          <Tab label={msg('geo.users')} value="users">
            {this.renderTable(3)}
          </Tab>
        </Tabs>
      </div>
    );
  }
}
