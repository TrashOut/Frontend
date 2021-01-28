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
import AddArea from './AddArea';
import ApiKey from './ApiKey';
import AppBar from 'material-ui/AppBar';
import Colors from '../../common/app/colors';
import EditArea from './EditArea';
import Email from 'material-ui/svg-icons/communication/email';
import GenerateWidget from './WidgetGenerator';
import ImagePreview from '../app/components/ImagePreview';
import LinearProgress from 'material-ui/LinearProgress';
import Loading from '../app/components/Loading';
import Paper from 'material-ui/Paper';
import Phone from 'material-ui/svg-icons/communication/phone';
import Radium from 'radium';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import SecondAppBar from '../app/components/SecondAppBar';
import Table from '../app/components/Table';
import translate from '../../messages/translate';
import moment from 'moment';
import { areaRoles, globalRoles, organizationRoles } from '../../roles';
import { autobind } from 'core-decorators';
import { Box, Social } from '../app/components';
import { connect } from 'react-redux';
import { FacebookIcon, GoogleIcon, TwitterIcon } from '../app/components/Icons';
import { fetchUser, fetchUserEvents, removeUserPhoto } from '../../common/users/actions';
import { languages, notifications } from '../../common/consts';
import { Match } from '../../common/app/components';
import { push } from 'react-router-redux';
import { removeArea } from '../../common/areas/actions';
import { setTable } from '../../common/table/actions';
import { Switch } from 'react-router-dom';

const activityEventActions = {
  create: { id: 'create', message: 'profile.myEvents.userRole.creator' },
  join: { id: 'join', message: 'profile.myEvents.userRole.joined' },
};

@translate
@Radium
@connect(state => ({
  user: state.users.viewer.toDetail(),
  isFetching: state.users.isFetching,
}), { fetchUserEvents, fetchUser, push, removeArea, removeUserPhoto, setTable })
export default class Detail extends Component {
  static propTypes = {
    cmsg: React.PropTypes.func,
    fetchUserEvents: React.PropTypes.func.isRequired,
    formatDate: React.PropTypes.func.isRequired,
    isFetching: React.PropTypes.bool,
    item: React.PropTypes.any,
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func,
    removeArea: React.PropTypes.func.isRequired,
    removeUserPhoto: React.PropTypes.func,
    setTable: React.PropTypes.func,
    user: React.PropTypes.object,
  }

  componentWillMount() {
    const { fetchUserEvents } = this.props;
    fetchUserEvents();
  }

  @autobind
  redirectToTrashes() {
    const { push, user: { id }, setTable } = this.props;
    setTable('TABLE_TYPE_TRASH', { userIds: id });
    push(routesList.userTrashList);
  }

  renderLevel() {
    const { msg, cmsg, user } = this.props;

    const computeFibonacci = (n) => {
      let i = 1;
      let j = 0;
      let t;
      for (let k = 1; k <= Math.abs(n); k += 1) {
        t = i + j;
        i = j;
        j = t;
      }
      if (n < 0 && n % 2 === 0) j = -j;
      return j;
    };

    const computeLevel = (points) => {
      let i = 1;
      let lastTreshold = 0;

      while (true) { // eslint-disable-line no-constant-condition
        const treshold = computeFibonacci(i + 1) * 10;
        if (points <= treshold && points >= lastTreshold) {
          return {
            min: lastTreshold,
            max: treshold,
            cur: points,
            level: i - 1,
          };
        }
        lastTreshold = treshold;
        i += 1;
      }
    };

    const level = computeLevel(user.points || 0);

    return (<div>
      <Box
        title={msg('user.level')}
      >
        <p>
          {cmsg('user.levelDescription', { currentPoints: <b style={style.level.points}>{level.cur}</b>, nextLevel: <b style={style.level.points}>{(level.max - level.cur) + 1}</b> })}
        </p>
        <LinearProgress
          mode="determinate"
          min={level.min}
          max={level.max}
          value={level.cur}
        />
        <span style={style.level}>
          Level {`${level.level}`}
        </span>
      </Box>
    </div>);
  }

  renderInfoBox() {
    const { formatDate, user, msg } = this.props;
    const { cleaned, reported, updated } = user.stats;

    return (
      <div>
        <Box
          className="col s12"
          title={msg('profile.statistics.title')}
          type="statistics"
          data={[
            { label: msg('profile.youReported'), content: reported },
            { label: msg('profile.youUpdated'), content: updated },
            { label: msg('profile.youCleaned'), content: cleaned },
          ]}
          onClick={this.redirectToTrashes}
        />
        {user.info &&
          <Box
            title={msg('user.aboutMe')}
            showIf={user.info}
            className="col s12"
          >
            <p>{user.info}</p>
          </Box>
        }
        <Box
          title={msg('user.contacts')}
          className="col s12"
          showIfEmpty={Boolean(false)}
        >
          {user.facebookUrl &&
            <Social
              label={msg('user.facebook')}
              link={user.facebookUrl}
              icon={<FacebookIcon color="#3b5998" viewBox="0 0 512 512" />}
            />
          }
          {user.twitterUrl &&
            <Social
              label={msg('user.twitter')}
              link={user.twitterUrl}
              icon={<TwitterIcon color="#4099FF" viewBox="0 0 512 512" />}
            />
          }
          {user.googlePlusUrl &&
            <Social
              label={msg('user.google')}
              link={user.googlePlusUrl}
              icon={<GoogleIcon color="#d34836" viewBox="0 0 512 512" />}
            />
          }
          <Social
            label={user.email}
            link={user.email}
            icon={<Email />}
          />
          {user.phoneNumber &&
            <Social
              label={user.phoneNumber}
              link={`tel:${user.phoneNumber}`}
              icon={<Phone />}
            />
          }
        </Box>

        <Box
          className="col s12 m4"
          title={msg('user.created')}
          text={formatDate(user.created)}
          showIfEmpty={Boolean(false)}
        />

        {user.birthday &&
          <Box
            className="col s12 m4"
            title={msg('user.birthday')}
            type="date"
            text={user.birthdate}
          />
        }

        <Box
          className="col s12 m4"
          title={msg('profile.role')}
          text={msg(globalRoles[user.userRole.id].message)}
          showIfEmpty={Boolean(false)}
        />

        <Box
          className="col s12 m6"
          type="checkboxes"
          title={msg('profile.preferences')}
          data={[
            { value: user.eventOrganizer, label: msg(user.eventOrganizer ? 'user.eventOrganizer.yes' : 'user.eventOrganizer.no') },
            { value: user.volunteerCleanup, label: msg(user.volunteerCleanup ? 'user.volunteerCleanup.yes' : 'user.volunteerCleanup.no') },
            { value: user.trashActivityEmailNotification, label: msg(user.trashActivityEmailNotification ? 'user.trashActivityEmailNotification.yes' : 'user.trashActivityEmailNotification.no') },
          ]}
        />

        {user.language &&
          <Box
            className="col s12 m6"
            title={msg('user.language')}
            text={msg(languages[user.language].message)}
          />
        }

      </div>
    );
  }

  renderUserAreas() {
    const { msg, user, removeArea } = this.props;
    const { userHasArea } = user;

    if (!userHasArea || userHasArea.length === 0) return null;

    return (
      <div className="row">
        <h2>{msg('profile.myAreas')}</h2>
        <p>{msg('profile.myAreas.description')}</p>
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
            userAreaRoleId: {
              label: msg('profile.role'),
              sortable: false,
            },
            delete: {
              label: msg('global.remove'),
              sortable: false,
              type: 'buttonLink',
              linkName: msg('global.remove'),
              onClick: (values) => removeArea(values.id),
            },
            edit: {
              label: msg('global.edit'),
              sortable: false,
              type: 'link',
              linkName: msg('global.edit'),
              template: routesList.userEditArea.replace(':id', '{id}'),
            },
          }}
          data={userHasArea.map(({ area, notificationFrequency, userAreaRoleId }) => ({
            ...area,
            specName: area[area.type],
            notificationFrequency,
            userAreaRoleId,
          }))}
          translatedFields={{
            userAreaRoleId: areaRoles,
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

  renderUserOrganizations() {
    const { user, msg } = this.props;
    if (!user.organizations || user.organizations.length === 0) return null;

    return (
      <div className="row">
        <h2>{msg('profile.myOrganizations')}</h2>
        <p>{msg('profile.myOrganizations.description')}</p>
        <Table
          isPagination={Boolean(false)}
          header={{
            name: {
              label: msg('organizations.name'),
              sortable: false,
              type: 'link',
              template: routesList.organizationsDetail.replace(':id', '{id}'),
            },
            description: {
              label: msg('organization.description'),
              sortable: false,
            },
            organizationRoleId: {
              label: msg('user.roles.organization'),
              sortable: false,
              type: 'calculated',
              calculatedValue: (x) => x.organizationRoleId || 2,
            },
          }}
          data={user.organizations}
          showLinkButton={Boolean(false)}
          isLocal={Boolean(true)}
          selectable={Boolean(false)}
          hasPrimaryColor={Boolean(true)}
          translatedFields={{
            organizationRoleId: organizationRoles,
          }}
        />
      </div>
    );
  }

  renderMyEvents() {
    const { user, msg } = this.props;
    if (!user.events || user.events.length === 0) return null;

    return (
      <div className="row">
        <h2>{msg('profile.myEvents')}</h2>
        <p>{msg('profile.myEvents.description')}</p>
        <Table
          isPagination={Boolean(false)}
          header={{
            name: {
              label: msg('event.name'),
              sortable: false,
              type: 'link',
              template: routesList.eventDetail.replace(':id', '{id}'),
            },
            start: {
              label: msg('event.start'),
              sortable: false,
              type: 'date',
            },
            action: {
              label: msg('profile.myEvents.userRole'),
              sortable: false,
            },
            timeDecisions: {
              label: msg('profile.myEvents.timeDecision'),
              sortable: false,
              type: 'calculated',
              calculatedValue: (x) => new Date() < new Date(x.start)
                ? msg('profile.myEvents.timeDecision.past')
                : (new Date() < moment(x.start).add(x.duration, 'minutes').toDate()
                    ? msg('profile.myEvents.timeDecision.ongoing')
                    : msg('profile.myEvents.timeDecision.future')),
            },
          }}
          data={user.events}
          showLinkButton={Boolean(false)}
          isLocal={Boolean(true)}
          selectable={Boolean(false)}
          hasPrimaryColor={Boolean(true)}
          translatedFields={{
            action: activityEventActions,
          }}
        />
      </div>
    );
  }

  render() {
    const { user, isFetching, msg, removeUserPhoto } = this.props;

    const profileImage = (user.image || {}).fullDownloadUrl;

    const menuButtons = [
      { name: 'addArea', label: msg('global.addArea'), linkTo: routesList.userAddArea },
      { name: 'edit', label: msg('global.edit'), linkTo: routesList.editProfile },
      { name: 'apiKey', label: msg('user.generateApiKey'), linkTo: routesList.generateApiKey },
      { name: 'widget', label: msg('user.generateWidget'), linkTo: routesList.generateWidget },
    ];
    if (!user.isSocialLogin) menuButtons.push({ name: 'change-password', label: msg('profile.changePassword'), linkTo: routesList.changePassword });

    return (
      <div>
        <div>
          <Switch>
            <Match
              path={routesList.userAddArea}
              component={AddArea}
            />
            <Match
              path={routesList.userEditArea}
              component={EditArea}
            />
            <Match
              path={routesList.generateApiKey}
              component={ApiKey}
            />
            <Match
              path={routesList.generateApiKeyForWidget}
              component={ApiKey}
              customProps={{
                redirectToWidget: true,
              }}
            />
            <Match
              path={routesList.generateWidget}
              component={GenerateWidget}
            />
          </Switch>
          <SecondAppBar
            rightUpperButtons={menuButtons}
          />
          <div className="main-content">
            <AppBar
              title={user.fullName}
              style={{ background: Colors.secondary }}
              showMenuIconButton={Boolean(false)}
            />
            <Paper style={style.main}>
              {isFetching
                ? <Loading type="circular" />
                : <div className="row">
                  <div className="col s12 m4">
                    <ImagePreview
                      data={[{
                        title: user.fullName,
                        src: profileImage || '/img/users/noAvatar.jpg',
                        id: '1',
                      }]}
                      cols={1}
                      rows={1}
                      padding={1}
                      showDelete={!!profileImage}
                      onClick={() => removeUserPhoto(user)}
                    />
                    {this.renderLevel()}
                  </div>
                  <div className="col s12 m8">
                    {this.renderInfoBox()}
                  </div>
                </div>
              }
            </Paper>
            {this.renderUserAreas()}
            {this.renderUserOrganizations()}
            {this.renderMyEvents()}
          </div>
        </div>
      </div>
    );
  }
}

const style = {
  chip: {
    wrapper: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: 4,
  },
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
      padding: '1%',
      header: {
        width: '100%',
        float: 'left',
        text: {
          marginLeft: '1%',
        },
        image: {
          width: '10%',
        },
      },
      content: {
        width: '100%',
        gridList: {
          display: 'flex',
          flexWrap: 'nowrap',
          overflowX: 'auto',
        },
      },
    },
  },
  avatar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    text: {
      fontSize: '0.7em',
      marginTop: '4px',
    },
  },
  level: {
    width: 'calc(100% - 24px)',
    textAlign: 'center',
    padding: '5px 12px',
    marginTop: '10px',
    float: 'left',
    background: Colors.lightGray,
    points: {
      color: Colors.primary,
      fontSize: '18px',
    },
  },
};
