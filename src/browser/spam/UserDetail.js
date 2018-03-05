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
import AppBar from 'material-ui/AppBar';
import Colors from '../../common/app/colors';
import Confirm from '../app/components/Confirm';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import SecondAppBar from '../app/components/SecondAppBar';
import Table from '../app/components/Table';
import translate from '../../messages/translate';
import { addConfirm } from '../../common/confirms/actions';
import { approveUser, removeUserActivities } from '../../common/spam/actions';
import { connect } from 'react-redux';
import { fetchUser } from '../../common/users/actions';

@translate
@connect(state => ({
  user: state.users.user,
  isFetching: state.users.isFetching,
}), { addConfirm, approveUser, fetchUser, removeUserActivities })
export default class Detail extends Component {
  static propTypes = {
    addConfirm: React.PropTypes.func,
    approveUser: React.PropTypes.func,
    fetchUser: React.PropTypes.func,
    isFetching: React.PropTypes.bool,
    match: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    removeUserActivities: React.PropTypes.func,
    user: React.PropTypes.any,
  };

  componentWillMount() {
    const { fetchUser, match } = this.props;
    fetchUser(match.params.id, true);
  }

  setConfirm(type) {
    switch (type) {
      case 'remove':
        this.setState({ confirm: { open: true, type: 'remove' } });
        break;
      case 'resolve':
        this.setState({ confirm: { open: true, type: 'resolve' } });
        break;
      case 'close':
        this.setState({ confirm: { open: false } });
        break;
    }
  }

  handleSubmit() {
    const { type } = this.state.confirm;
    const { approveUser, user, match, removeUserActivities } = this.props;

    switch (type) {
      case 'resolve':
        approveUser(match.params.id, user.uid);
        break;
      case 'remove':
        removeUserActivities(match.params.id);
        return;
    }
    this.setConfirm('close');
  }

  render() {
    const { addConfirm, approveUser, user, isFetching, msg, match } = this.props;
    if (isFetching) return null;

    return (
      <div>
        <div>
          <SecondAppBar
            rightUpperButtons={[
              {
                name: 'resolve',
                label: msg('notifications.users.approve'),
                onClick: () => addConfirm('resolve-user', { onSubmit: () => approveUser(match.params.id, user.uid) }),
              },
            ]}
          />
          <div className="main-content">
            <AppBar
              title={`${msg('notifications.reviewedUser.detail')} - ${user.id}`}
              style={{ background: Colors.secondary }}
              showMenuIconButton={Boolean(false)}
            />
            <Confirm
              title={msg('notifications.user.approve.header')}
              cancelLabel={msg('global.cancel')}
              submitLabel={msg('global.confirm')}
            />
            <Table
              isPagination={Boolean(false)}
              header={{
                image: {
                  label: msg('notifications.reviewedUser.trash.image'),
                  sortable: false,
                  type: 'image',
                },
                id: {
                  label: msg('notifications.reviewedUser.trash.id'),
                  sortable: false,
                },
                action: {
                  label: msg('notifications.reviewedUser.trash.action'),
                  sortable: false,
                },
                created: {
                  label: msg('notifications.reviewedUser.trash.created'),
                  sortable: false,
                  type: 'date',
                },
                detail: {
                  label: msg('global.showDetail'),
                  sortable: false,
                  type: 'link',
                  linkName: msg('global.showDetail'),
                  template: routesList.trashDetail.replace(':id', '{id}'),
                },
              }}
              data={((user || {}).activity || []).map(x => ({
                id: x.id,
                activityId: x.activity.id,
                image: (((x.activity || {}).images || [])[0] || {}).fullDownloadUrl,
                created: x.created,
                action: x.action,
              }))}
              showLinkButton={Boolean(false)}
              isLocal={Boolean(true)}
              selectable={Boolean(false)}
            />

          </div>
        </div>
      </div>
    );
  }
}
