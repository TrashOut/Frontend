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
import Desktop from 'material-ui/svg-icons/hardware/desktop-windows';
import Email from 'material-ui/svg-icons/communication/email';
import ImagePreview from '../app/components/ImagePreview';
import Invite from './Invite';
import Managers from './Managers';
import Paper from 'material-ui/Paper';
import Phone from 'material-ui/svg-icons/hardware/phone-iphone';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import Table from '../app/components/Table';
import translate from '../../messages/translate';
import withRole from '../../common/app/withRole';
import { addConfirm } from '../../common/confirms/actions';
import { autobind } from 'core-decorators';
import { Confirm, Loading, SecondAppBar, Social, Box, Link } from '../app/components';
import { connect } from 'react-redux';
import { FacebookIcon, TwitterIcon, GoogleIcon } from '../app/components/Icons';
import { fetchOrganizationUsers, fetchOrganization, removeOrganization, joinOrganization, leaveOrganization, updateOrganization, removeOrganizationArea as removeArea } from '../../common/organizations/actions';
import { Match } from '../../common/app/components';
import { organizationRoles } from '../../roles';
import { setTable } from '../../common/table/actions';
import { Switch } from 'react-router-dom';
import AddArea from "./AddArea";
import { notifications } from '../../common/consts';

@withRole(state => ({
  isFetching: state.organizations.isFetching,
  organization: state.organizations.item.toJS(),
}))
@translate
@connect(state => ({
  item: state.organizations.item,
  isFetching: state.organizations.isFetching,
  user: state.users.viewer,
  users: {
    isFetching: state.table.isFetching,
    items: state.table.map,
  },
  filter: state.table.filter,
}), {
  addConfirm,
  joinOrganization,
  leaveOrganization,
  fetchOrganization,
  removeOrganization,
  fetchOrganizationUsers,
  updateOrganization,
  setTable,
  removeArea,
})
export default class Detail extends Component {
  static propTypes = {
    addConfirm: React.PropTypes.func.isRequired,
    fetchEvent: React.PropTypes.func,
    fetchOrganization: React.PropTypes.func.isRequired,
    fetchOrganizationUsers: React.PropTypes.func.isRequired,
    filter: React.PropTypes.object,
    formatDate: React.PropTypes.func.isRequired,
    isFetching: React.PropTypes.bool,
    item: React.PropTypes.any,
    joinOrganization: React.PropTypes.func,
    leaveOrganization: React.PropTypes.func,
    match: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    params: React.PropTypes.object,
    removeOrganization: React.PropTypes.func,
    roles: React.PropTypes.object,
    setTable: React.PropTypes.func.isRequired,
    updateOrganization: React.PropTypes.func,
    user: React.PropTypes.object,
    users: React.PropTypes.object,
    statistics: React.PropTypes.object,
    organization: React.PropTypes.object,
    removeArea: React.PropTypes.func.isRequired,
  };

  state = {
    isManager: false,
    isUser: false,
  };

  componentWillMount() {
    const { fetchOrganization, match, setTable } = this.props;
    setTable('TABLE_TYPE_USER');
    fetchOrganization(match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    const { fetchOrganizationUsers, filter, match } = this.props;
    if (nextProps.filter !== filter) {
      fetchOrganizationUsers(match.params.id, nextProps.filter.toJS());
    }
  }

  @autobind
  removeUser(user) {
    const { addConfirm, item, leaveOrganization } = this.props;
    return addConfirm('organization.leave', { onSubmit: () => leaveOrganization(item.id, user.id) });
  }

  @autobind
  redirectToTrashes() {
    const { push, setTable, match } = this.props;
    setTable('TABLE_TYPE_TRASH', { organizationId: match.params.id });
    push(routesList.userTrashList);
  }

  renderInfoBox(canManage) {
    const { addConfirm, updateOrganization, formatDate, item, msg, organization } = this.props;
    const { cleaned, reported, updated } = organization.statistics;
    return (
      <div className="row">
        <div className="col s12 m5">
          <ImagePreview
            data={[{
              title: msg('global.currentImage'),
              src: (item.image && item.image.fullDownloadUrl) || '/img/organization/noOrganization.png',
              id: '1',
              isMain: true,
            }]}
            cols={2}
            padding={1}
            showDelete={canManage && Boolean(item.image && item.image.fullDownloadUrl)}
            hasMain
            onClick={() => addConfirm('delete-image', { onSubmit: () => updateOrganization(item.toJS(), true) })}
          />
        </div>
        <div className="col s12 m7">
          <Box
            className="col s12"
            title={msg('organization.statistics.title')}
            type="statisticsOrganization"
            data={[
              { label: msg('organization.dumpsReported'), content: reported, image: 'reported' },
              { label: msg('organization.dumpsUpdated'), content: updated, image: 'updated' },
              { label: msg('organization.dumpsCleaned'), content: cleaned, image: 'cleaned' },
            ]}
            onClick={this.redirectToTrashes}
          />
          <Box
            title={msg('organization.description')}
            class="col s12"
          >
            {item.description}
          </Box>
          <Box
            title={msg('organization.contacts')}
            className="col s12"
          >
            <div className="col m6 s12">
              <Social
                label={item.contactUrl}
                link={item.contactUrl}
                icon={<Desktop />}
                fullWidth
              />
              <Social
                label={item.contactEmail}
                link={item.contactEmaill}
                icon={<Email />}
                fullWidth
              />
              <Social
                label={item.contactPhone}
                link={`tel:${item.contactPhone}`}
                icon={<Phone />}
              />
            </div>
            <div className="col m6 s12">
              <Social
                label={msg('user.facebook')}
                link={item.contactFacebook}
                icon={<FacebookIcon color="#3b5998" viewBox="0 0 512 512" />}
                fullWidth
              />
              <Social
                label={msg('user.twitter')}
                link={item.contactTwitter}
                icon={<TwitterIcon color="#4099FF" viewBox="0 0 512 512" />}
                fullWidth
              />
              <Social
                label={msg('user.google')}
                link={item.contactGooglePlus}
                icon={<GoogleIcon color="#d34836" viewBox="0 0 512 512" />}
                fullWidth
              />
            </div>
          </Box>
          {item.parent &&
            <Box
              className="col s12 m6"
              title={msg('organization.parent')}
            >
              <Link
                to={routesList.organizationsDetail.replace(':id', item.parent.id)}
              >
                {item.parent.name}
              </Link>
            </Box>
          }
          {item.area &&
            <Box
              className="col s12 m6"
              title={msg('organization.location')}
              type="location"
              showAddress={Boolean(true)}
              showGPS={Boolean(false)}
              item={item.area}
            />
          }
          <Box
            className="col s12 m6"
            title={msg('organization.created')}
          >
            {formatDate(item.created)}
          </Box>
          <Box
            className="col s12 m6"
            title={msg('organization.usersCount')}
            text={item.usersCount}
          />
        </div>
      </div>
    );
  }

  renderOrganizationHasArea() {
    const { msg, organization, roles, removeArea } = this.props;
    const { organizationHasArea } = organization;

    const canManage = roles.isAuthorized('superAdmin') || roles.isAuthorizedWithOrganization('manager');

    if (!organizationHasArea || organizationHasArea.length === 0) return null;

    return (
      <div className="row">
        <h2>{msg('organization.notifications')}</h2>
        <p>{msg('organization.notifications.description')}</p>
        <Table
          isPagination={Boolean(false)}
          header={{
            specName: {
              label: msg('geo.name'),
              sortable: false,
            },
            type: {
              label: msg('geo.type'),
              sortable: false,
            },
            notificationFrequency: {
              label: msg('global.geo.notificationFrequency'),
              sortable: false,
            },
            delete: {
              label: msg('global.remove'),
              sortable: false,
              type: 'buttonLink',
              linkName: msg('global.remove'),
              onClick: (values) => removeArea(organization.id, values.id),
              hide: !canManage,
            },
            edit: {
              label: msg('global.edit'),
              sortable: false,
              type: 'link',
              linkName: msg('global.edit'),
              template: routesList.organizationsEditArea.replace(':organizationId', organization.id).replace(':id', '{id}'),
              hide: !canManage,
            },
          }}
          data={organizationHasArea.map(({ area, notificationFrequency }) => ({
            ...area,
            specName: area[area.type],
            notificationFrequency,
          }))}
          translatedFields={{
            notificationFrequency: notifications,
          }}
          showLinkButton={Boolean(false)}
          isLocal={Boolean(true)}
          selectable={Boolean(false)}
          hasPrimaryColor={Boolean(true)}
        />
      </div>
    );
  }

  renderAdminContent() {
    const { msg, users } = this.props;
    if (users.isFetching) return null;

    return (
      <div className="row">
        <h2>{msg('organization.members')}</h2>
        <Table
          isPagination={Boolean(true)}
          header={{
            firstName: {
              label: msg('user.firstName'),
              sortable: false,
            },
            lastName: {
              label: msg('user.lastName'),
              sortable: false,
            },
            email: {
              label: msg('global.email'),
              sortable: false,
            },
            organizationRoleId: {
              label: msg('profile.role'),
              sortable: false,
            },
            unjoin: {
              label: msg('organization.removeUser'),
              sortable: false,
              type: 'button',
              onClick: this.removeUser,
              linkName: msg('organization.removeUser'),
            },
          }}
          data={users.items}
          showLinkButton={Boolean(false)}
          selectable={Boolean(false)}
          hasPrimaryColor={Boolean(true)}
          translatedFields={{
            organizationRoleId: organizationRoles,
          }}
        />
      </div>
    );
  }

  render() {
    const { addConfirm, msg, item, isFetching, removeOrganization, joinOrganization, leaveOrganization, roles, match } = this.props;

    const canManage = roles.isAuthorized('superAdmin') || roles.isAuthorizedWithOrganization('manager');
    const role = roles.getOrganizationRole();

    const buttons = [];

    if (canManage) {
      buttons.push({ name: 'addArea', label: msg('global.addArea'), linkTo: routesList.organizationsAddArea.replace(':id', item.id) });
      buttons.push({ name: 'edit', label: msg('organization.edit'), linkTo: routesList.organizationsUpdate.replace(':id', item.id) });
      buttons.push({ name: 'delete', label: msg('global.remove'), onClick: () => addConfirm('organization.delete', { onSubmit: () => removeOrganization(item.id) }) });
      buttons.push({ name: 'managers', label: msg('organization.addManager'), linkTo: routesList.organizationsManagers.replace(':id', item.id) });
    }

    if (!role) {
      buttons.push({ name: 'join', label: msg('organization.join'), onClick: () => addConfirm('organization.join', { onSubmit: () => joinOrganization(item.id) }) });
    }

    if (!canManage && role) {
      buttons.push({ name: 'leave', label: msg('organization.leave'), onClick: () => addConfirm('organization.leave', { onSubmit: () => leaveOrganization(item.id) }) });
    }

    if (roles.isAuthorizedWithOrganization('member', false)) {
      buttons.push({ name: 'invitations', label: msg('organization.sendInvitations'), linkTo: routesList.organizationsInvitations.replace(':id', item.id) });
    }

    return (
      <div>
        <div>
          <SecondAppBar
            title={msg('organization.detail.header')}
            rightUpperButtons={buttons}
          />

          <Switch>
            <Match
              path={routesList.organizationsAddArea}
              component={AddArea}
              customProps={{ id: match.params.id }}
            />
            <Match
              path={routesList.organizationsInvitations}
              component={Invite}
            />
            <Match
              path={routesList.organizationsManagers}
              component={Managers}
              isUnauthorized={!canManage}
            />
          </Switch>

          <div className="main-content">
            <AppBar
              title={item.name}
              style={{ background: Colors.secondary }}
              showMenuIconButton={Boolean(false)}
            />

            <Confirm
              cancelLabel={msg('global.cancel')}
              submitLabel={msg('global.confirm')}
              title={msg('global.confirmation.header')}
            />

            <Paper style={style.main}>
              {isFetching
                ? <Loading type="circular" />
                : this.renderInfoBox(canManage)
              }
            </Paper>
            {this.renderOrganizationHasArea()}
            {canManage && this.renderAdminContent()}
          </div>
        </div>
      </div>
    );
  }
}

const style = {
  main: {
    padding: '2%',
    gridList: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
  },
  topIndentation: {
    marginTop: '2%',
  },
  history: {
    padding: '1%',
    float: 'left',
    width: '100%',
    marginBottom: '2%',
    record: {
      header: {
        width: '100%',
        float: 'left',
        left: {
          float: 'left',
          padding: '0',
          margin: '0',
        },
        right: {
          float: 'right',
        },
      },
      content: {
        width: '100%',
        gridList: {
          display: 'flex',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          width: '100%',
        },
      },
    },
  },
};
