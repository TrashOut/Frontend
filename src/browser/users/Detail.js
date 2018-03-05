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
import Email from 'material-ui/svg-icons/communication/email';
import GridOn from 'material-ui/svg-icons/image/grid-on';
import ImagePreview from '../app/components/ImagePreview';
import LinearProgress from 'material-ui/LinearProgress';
import Loading from '../app/components/Loading';
import Paper from 'material-ui/Paper';
import Radium from 'radium';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import SecondAppBar from '../app/components/SecondAppBar';
import translate from '../../messages/translate';
import { autobind } from 'core-decorators';
import { Box, Social } from '../app/components';
import { computeLevel } from '../../common/users/helpers';
import { connect } from 'react-redux';
import { FacebookIcon, GoogleIcon, TwitterIcon } from '../app/components/Icons';
import { fetchUser, fetchUserEvents, removeUserPhoto } from '../../common/users/actions';
import { globalRoles } from '../../roles';
import { languages } from '../../common/consts';
import { OrganizationsTable, AreasTable, EventsTable, ReportedDumpsTable, UpdatedDumpsTable } from './components';
import { push } from 'react-router-redux';
import { removeArea } from '../../common/areas/actions';
import { setTable } from '../../common/table/actions';
import { Tabs, Tab } from 'material-ui/Tabs';

@translate
@Radium
@connect(state => ({
  user: state.users.user.toDetail && state.users.user.toDetail(),
  isFetching: state.users.isFetching,
}), { fetchUserEvents, fetchUser, push, removeArea, removeUserPhoto, setTable })
export default class Detail extends Component {
  static propTypes = {
    cmsg: React.PropTypes.func.isRequired,
    fetchUser: React.PropTypes.func.isRequired,
    fetchUserEvents: React.PropTypes.func.isRequired,
    formatDate: React.PropTypes.func.isRequired,
    isFetching: React.PropTypes.bool,
    item: React.PropTypes.any,
    match: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired,
    removeArea: React.PropTypes.func.isRequired,
    removeUserPhoto: React.PropTypes.func,
    setTable: React.PropTypes.func.isRequired,
    user: React.PropTypes.object,
  }

  state = {
    selectedTab: 'organizations',
  };

  componentWillMount() {
    const { fetchUser, match } = this.props;
    fetchUser(match.params.id);
  }

  @autobind
  redirectToTrashes() {
    const { push, user: { id }, setTable } = this.props;
    setTable('TABLE_TYPE_TRASH', { userIds: id });
    push(routesList.userTrashList);
  }

  renderLevel() {
    const { msg, cmsg, user } = this.props;

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
            { label: msg('user.stats.userReported'), content: reported },
            { label: msg('user.stats.userUpdated'), content: updated },
            { label: msg('user.stats.userCleaned'), content: cleaned },
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
        >
          <Social
            label={msg('user.facebook')}
            link={user.facebookUrl}
            icon={<FacebookIcon color="#3b5998" viewBox="0 0 512 512" />}
          />
          <Social
            label={msg('user.twitter')}
            link={user.twitterUrl}
            icon={<TwitterIcon color="#4099FF" viewBox="0 0 512 512" />}
          />
          <Social
            label={msg('user.google')}
            link={user.googlePlusUrl}
            icon={<GoogleIcon color="#d34836" viewBox="0 0 512 512" />}
          />
          <Social
            label={user.email}
            link={user.email}
            icon={<Email />}
          />
        </Box>

        <Box
          className="col s12 m4"
          title={msg('user.created')}
          text={formatDate(user.created)}
        />

        <Box
          className="col s12 m4"
          title={msg('profile.role')}
          text={msg(globalRoles[user.userRole.id].message)}
        />


        <Box
          className="col s12 m6"
          type="checkboxes"
          title={msg('profile.preferences')}
          data={[
            { value: user.eventOrganizer, label: msg(user.eventOrganizer ? 'user.eventOrganizer.yes' : 'user.eventOrganizer.no') },
            { value: user.volunteerCleanup, label: msg(user.volunteerCleanup ? 'user.volunteerCleanup.yes' : 'user.volunteerCleanup.no') },
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

  renderTabs() {
    const { user, msg } = this.props;
    const { selectedTab } = this.state;

    return (
      <Tabs
        value={selectedTab}
        onChange={(selectedTab) => this.setState({ selectedTab })}
      >
        <Tab
          label={msg('user.detail.organizations')}
          value="organizations"
          icon={<GridOn />}
        >
          {selectedTab === 'organizations' &&
            <OrganizationsTable data={user.organizations} />
          }
        </Tab>
        <Tab
          label={msg('user.detail.areas')}
          value="areas"
          icon={<GridOn />}
        >
          {selectedTab === 'areas' &&
            <AreasTable data={user.areas} />
          }
        </Tab>
        <Tab
          label={msg('user.detail.events')}
          value="events"
          icon={<GridOn />}
        >
          {selectedTab === 'events' &&
            <EventsTable userId={user.id} />
          }
        </Tab>
        <Tab
          label={msg('user.detail.reportedDumps')}
          value="reported"
          icon={<GridOn />}
        >
          {selectedTab === 'reported' &&
            <ReportedDumpsTable userId={user.id} />
          }
        </Tab>
        <Tab
          label={msg('user.detail.updatedDumps')}
          value="updated"
          icon={<GridOn />}
        >
          {selectedTab === 'updated' &&
            <UpdatedDumpsTable userId={user.id} />
          }
        </Tab>
      </Tabs>
    );
  }

  render() {
    const { user, isFetching, removeUserPhoto } = this.props;
    if (isFetching || !user) return <Loading />;

    const profileImage = user.image && user.image.fullDownloadUrl;

    return (
      <div>
        <div>
          <SecondAppBar noContent />
          <div className="main-content">
            <AppBar
              title={user.fullName}
              style={{ background: Colors.secondary }}
              showMenuIconButton={Boolean(false)}
            />
            <Paper style={style.main}>
              <div className="row">
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
            </Paper>
            {this.renderTabs()}
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
