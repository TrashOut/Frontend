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
import GridOn from 'material-ui/svg-icons/image/grid-on';
import ImagePreview from '../app/components/ImagePreview';
import Loading from '../app/components/Loading';
import Match from '../../common/app/components/Match';
import moment from 'moment';
import Paper from 'material-ui/Paper';
import Radium from 'radium';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import SecondAppBar from '../app/components/SecondAppBar';
import translate from '../../messages/translate';
import withRole from '../../common/app/withRole';
import { addConfirm } from '../../common/confirms/actions';
import { Box } from '../app/components';
import { CollectionPointTable, DumpsTable, JoinedUsersTable, ReportsTable, SmallTable } from './components';
import { Confirm as ConfirmEvent, Feedback } from './feedback';
import { connect } from 'react-redux';
import { fetchEvent, removeEvent, removeEventUser, joinEvent } from '../../common/events/actions';
import { FormattedDate, FormattedTime } from 'react-intl';
import { MAX_AREA_TRESHOLD } from '../../common/events/consts';
import { Tabs, Tab } from 'material-ui/Tabs';

@withRole(state => ({
  event: state.events.item,
  isFetching: state.events.isFetching,
}))
@connect(state => ({
  isFetching: state.events.isFetching,
  item: state.events.item.toJS(),
  user: state.users.viewer,
}), { addConfirm, joinEvent, removeEventUser, fetchEvent, removeEvent })
@translate
@Radium
export default class Detail extends Component {
  static propTypes = {
    addConfirm: React.PropTypes.func.isRequired,
    fetchEvent: React.PropTypes.func,
    isFetching: React.PropTypes.bool,
    item: React.PropTypes.any,
    joinEvent: React.PropTypes.func,
    markAsSpam: React.PropTypes.func,
    match: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    removeEvent: React.PropTypes.func,
    removeEventUser: React.PropTypes.func,
    roles: React.PropTypes.object,
    user: React.PropTypes.object,
  };

  state = {
    selectedTab: 'trashPoints',
  };

  componentWillMount() {
    const { fetchEvent, match } = this.props;
    fetchEvent(match.params.id);
  }

  renderInfo() {
    const { item, msg } = this.props;

    const endTime = moment(item.start.date).add(item.duration, 'm');
    const timeZoneOffset = `UTC ${moment().utcOffset(item.startWithTimeZone).format('Z')}`;
    const whenTable = {
      rowHeader: [
        msg('event.detail.start'),
        msg('event.detail.end'),
      ],
      columnHeader: [
        msg('event.detail.date'),
        msg('event.detail.time'),
        msg('event.detail.timeZone'),
      ],
      data: [
        [<FormattedDate value={item.start.date} />, <FormattedDate value={endTime} />],
        [<FormattedTime value={item.start.date} />, <FormattedTime value={endTime} />],
        [timeZoneOffset, timeZoneOffset],
      ],
    };

    return (
      <div>
        <Box
          title={msg('event.detail.when')}
          className="col m12"
          headerStyle={style.boxHeader}
        >
          <SmallTable {...whenTable} />
        </Box>
        <Box
          title={msg('event.detail.attendeesCount')}
          text={item.users.length}
          className="col m6"
          headerStyle={style.boxHeader}
          showIfEmpty={Boolean(false)}
        />
        <Box
          title={msg('event.detail.dumpsCount')}
          text={item.trashPoints.length}
          className="col m6"
          headerStyle={style.boxHeader}
          showIfEmpty={Boolean(false)}
        />
        <Box
          title={msg('event.whatWeHave')}
          text={item.have}
          className="col m12"
          headerStyle={style.boxHeader}
          showIfEmpty={Boolean(false)}
        />
        <Box
          title={msg('event.whatBring')}
          text={item.bring}
          className="col m12"
          headerStyle={style.boxHeader}
          showIfEmpty={Boolean(false)}
        />
        <Box
          title={msg('event.description')}
          text={item.description}
          className="col m12"
          headerStyle={style.boxHeader}
          showIfEmpty={Boolean(false)}
        />
        <Box
          title={msg('event.childFriendly')}
          text={msg(item.childFriendly ? 'global.yes' : 'global.no')}
          className="col m12"
          headerStyle={style.boxHeader}
        />
      </div>
    );
  }

  renderMap() {
    const { item, msg } = this.props;

    const organizerTable = {
      columnHeader: [
        msg('event.detail.organizer.name'),
        msg('event.detail.organizer.function'),
        msg('global.phone'),
        msg('global.email'),
      ],
      data: [
        [item.contact.name],
        [item.contact.occupation],
        [item.contact.phone],
        [item.contact.email],
      ],
    };

    const meetingPointTable = {
      columnHeader: [
        msg('event.meetingAddress'),
        msg('geo.country'),
        msg('global.gps'),
      ],
      data: [
        [item.googleAddress.address || item.gps.area.name],
        [item.gps.area.country],
        [<Box
          type="location"
          item={item.gps}
          showGPS
          titleStyle={{ marginTop: 0 }}
          headerStyle={style.boxHeader}
        />],
      ],
    };

    return (
      <div>
        <Box
          title={msg('event.detail.organizer')}
          className="col s12"
          headerStyle={style.boxHeader}
        >
          <SmallTable {...organizerTable} />
        </Box>
        <Box
          title={msg('event.meetingPoint')}
          className="col s12"
          headerStyle={style.boxHeader}
        >
          <SmallTable {...meetingPointTable} />
        </Box>
        <Box
          title={msg('event.detail.map')}
          className="col s12"
          type="location"
          item={{
            ...item,
            trashPoints: item
              .trashPoints
              .map(x => x.toMap(true, false))
              .map(x => ({ ...x, link: routesList.trashDetail.replace(':id', x.id) }))
              .concat({ lat: item.gps.lat, lng: item.gps.long, useDefaultIcon: true, name: msg('event.meetingPoint'), isText: true }),
          }}
          showRectangle
          zoom={15}
          headerStyle={style.boxHeader}
        />
      </div>
    );
  }

  renderPhotos() {
    const { msg } = this.props;
    const { item: { images } } = this.props;
    if (!images || images.length === 0) return null;

    return (
      <Paper style={style.photos}>
        <div className="row">
          <div className="col s12">
            <h4>{msg('event.detail.images')}</h4>
          </div>
          <div className="col s12">
            <ImagePreview
              data={images.map(x => ({ src: x.fullDownloadUrl, id: x.id, label: msg('feedback.image') }))}
              cols={4}
              rows={1}
              padding={1}
              carousel
            />
          </div>
        </div>
      </Paper>
    );
  }

  renderTabs() {
    const { item, msg } = this.props;
    const { selectedTab } = this.state;

    const ended = ((item || {}).end || {}).date ? new Date(item.end.date) <= new Date() : false;

    return (
      <Tabs
        value={selectedTab}
        onChange={(selectedTab) => this.setState({ selectedTab })}
        style={style.tabs}
      >
        <Tab
          label={msg('event.detail.dumpsToBeCleaned')}
          value="trashPoints"
          icon={<GridOn />}
        >
          {selectedTab === 'trashPoints' &&
            <DumpsTable
              data={item.trashPoints}
              shouldFetch={item.distance > MAX_AREA_TRESHOLD}
            />
          }
        </Tab>
        <Tab
          label={msg('event.detail.collectionPoints')}
          value="collectionPoints"
          icon={<GridOn />}
        >
          {selectedTab === 'collectionPoints' &&
            <CollectionPointTable
              data={item.collectionPoints}
              shouldFetch={item.distance > MAX_AREA_TRESHOLD}
            />
          }
        </Tab>
        <Tab
          label={msg('event.detail.joinedUsers')}
          value="joinedUsers"
          icon={<GridOn />}
        >
          {selectedTab === 'joinedUsers' &&
            <JoinedUsersTable
              data={item.users.map(x => ({ confirmed: x.confirmed, ...x.user }))}
            />
          }
        </Tab>
        {ended &&
          <Tab
            label={msg('event.detail.reports')}
            value="reports"
            icon={<GridOn />}
          >
            {selectedTab === 'reports' &&
              <ReportsTable
                data={item.users.filter(x => x.feedbackGuessGuestCount && x.feedbackGuessTrashCount)}
              />
            }
          </Tab>
        }
      </Tabs>
    );
  }

  render() {
    const { addConfirm, joinEvent, removeEventUser, removeEvent, item, isFetching, msg, roles } = this.props;
    const ended = ((item || {}).end || {}).date ? new Date(item.end.date) <= new Date() : false;
    const isAdmin = roles.isAuthorizedWithEvent();

    const buttons = isFetching ? [] : [
      isAdmin && { name: 'refresh', label: msg('global.edit'), linkTo: routesList.eventUpdate.replace(':id', item.id) },
      isAdmin && { name: 'delete', label: msg('global.remove'), onClick: () => addConfirm('event.delete', { onSubmit: () => removeEvent(item.id) }) },
      !ended && !roles.getEventRole() && { name: 'join', label: msg('event.join'), onClick: () => addConfirm('event.join', { onSubmit: () => joinEvent(item.id) }) },
      !ended && roles.getEventRole() === 'JOINED' && { name: 'leave', label: msg('event.leave'), onClick: () => addConfirm('event.unjoin', { onSubmit: () => removeEventUser(item.id) }) },
      ended && roles.getEventRole() === 'JOINED' && { name: 'addFeedback', label: msg('event.feedback.addFeedback'), linkTo: routesList.eventFeedback.replace(':id', item.id) },
    ];

    return (
      <div>
        <Match
          path={routesList.eventConfirm}
          component={ConfirmEvent}
        />
        <Match
          path={routesList.eventFeedback}
          component={Feedback}
        />
        <div>
          <SecondAppBar
            title={msg('event.detail.header')}
            rightUpperButtons={buttons}
          />
          <div className="main-content">
            <AppBar
              title={item.name || ''}
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
                :
                <div className="row">
                  <div className="col s12 m6">
                    {this.renderInfo()}
                  </div>
                  <div className="col s12 m6">
                    {this.renderMap()}
                  </div>
                </div>
              }
            </Paper>
            {this.renderPhotos()}
            {this.renderTabs()}
          </div>
        </div>
      </div>
    );
  }
}

const style = {
  boxHeader: {
    color: Colors.primary,
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
  table: {
    fontSize: '14px',
  },
  tabs: {
    marginTop: '20px',
  },
  photos: {
    marginTop: '20px',
    padding: '0 2%',
    paddingBottom: '1%',
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
