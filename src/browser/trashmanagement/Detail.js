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
import IconPreview from '../app/components/IconPreview';
import ImagePreview from '../app/components/ImagePreview';
import Loading from '../app/components/Loading';
import Paper from 'material-ui/Paper';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import SecondAppBar from '../app/components/SecondAppBar';
import Table from '../app/components/Table';
import translate from '../../messages/translate';
import withRole from '../../common/app/withRole';
import { addConfirm } from '../../common/confirms/actions';
import { Box } from '../app/components';
import { connect } from 'react-redux';
import { prepareEventFromTrashes } from '../../common/events/actions';
import { push } from 'react-router-redux';
import ReactMarkdown from 'react-markdown';
import { removeImage, removeActivity, removeComment, markAsSpam, fetchDetail, removeTrash } from '../../common/trashmanagement/actions';
import { trashTypes, trashSizes, trashAccessibility, trashStatuses } from '../../common/trashmanagement/consts';

const statusStyle = {
  'trash.status.cleaned': { image: '/img/icons/trash_cleaned.png', style: { background: Colors.secondary, color: 'white' } },
  'trash.status.stillHere': { image: '/img/icons/trash_updated.png', style: { background: Colors.orange, color: 'white' } },
  'trash.status.less': { image: '/img/icons/trash_updated.png', style: { background: Colors.orange, color: 'white' } },
  'trash.status.more': { image: '/img/icons/trash_updated.png', style: { background: Colors.orange, color: 'white' } },
  'trash.updated': { image: '/img/icons/trash_updated.png', style: { background: Colors.orange, color: 'white' } },
  'profile.reported': { image: '/img/icons/trash_reported.png', style: { background: Colors.red, color: 'white' } },
  fetching: { image: '/img/icons/trash_updated.png', style: { background: Colors.lightGray, color: 'black' } },
};

let History = ({
  canBeDeleted,
  formatDate,
  images,
  msg,
  note,
  onImageRemove,
  onRemove,
  status,
  time,
  user,
  anonymous,
}) => (
  <Paper style={{ marginTop: '20px', marginBottom: '20px' }}>
    <h3 style={{ minHeight: '24px', padding: '12px', margin: 0, fontSize: '16px', fontWeight: 'normal', ...statusStyle[status].style }}>
      <div style={{ float: 'left', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <img src={statusStyle[status].image} alt={status} style={{ marginLeft: '10px', height: '24px' }} />
        <span style={{ marginLeft: '15px' }}>{formatDate(time)}</span>
      </div>
      <div style={{ float: 'right', marginRight: '10px' }}>{msg(status)}</div>
    </h3>
    <div style={style.activity}>
      <div style={style.activity.avatar}>
        <IconPreview
          selected={['1']}
          options={[
            {
              id: '1',
              img: (!anonymous && (user.image || {}).fullDownloadUrl) || '/img/users/noAvatar.jpg',
              translatedMessage: (!anonymous && (user.firstName || user.lastName))
                ? `${user.firstName || ''} ${user.lastName || ''}`
                : msg('trash.anonymous'),
            },
          ]}
          size={100}
          stretch={Boolean(true)}
          showText={Boolean(true)}
          wrapperStyle={{ display: 'flex', justifyContent: 'center' }}
        />
      </div>
      <div style={style.activity.content}>
        <p style={{ marginTop: '0', paddingTop: '0' }}>{note}</p>
        {images &&
          <div>
            <ImagePreview
              data={
                images.map(image => ({ src: image, id: image.id }))
              }
              showDelete={canBeDeleted && images.length > 1}
              hasMain={Boolean(false)}
              onClick={(imageId) => onImageRemove(imageId)}
              carousel
            />
          </div>
        }
        {canBeDeleted &&
          <div style={style.deleteButton}>
            <RaisedButton
              label={msg('trash.removeActivity')}
              onClick={onRemove}
              labelStyle={{
                fontSize: '12px',
                fontWeight: 'normal',
              }}
              style={{
                marginLeft: 'auto',
              }}
            />
          </div>
        }
      </div>
    </div>
  </Paper>
);

History.propTypes = {
  anonymous: React.PropTypes.bool,
  canBeDeleted: React.PropTypes.bool,
  formatDate: React.PropTypes.func,
  images: React.PropTypes.array,
  msg: React.PropTypes.func,
  note: React.PropTypes.string,
  onImageRemove: React.PropTypes.func,
  onRemove: React.PropTypes.func,
  status: React.PropTypes.string,
  time: React.PropTypes.string,
  user: React.PropTypes.object,
};

History = translate(Radium(History));

let Comment = ({
  canBeDeleted,
  formatDate,
  msg,
  body,
  onRemove,
  time,
  user,
  userImage,
  organization,
  organizationImage,
}) => (
  <Paper style={{ marginTop: '20px', marginBottom: '20px' }}>
    <h3 style={{ minHeight: '24px', padding: '12px', margin: 0, fontSize: '16px', fontWeight: 'normal', background: Colors.darkGray, color: 'white' }}>
      <div style={{ float: 'left', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <span style={{ marginLeft: '15px' }}>{formatDate(time)}</span>
      </div>
    </h3>
    <div style={style.activity}>
      <div style={style.activity.avatar}>
        <IconPreview
          selected={['1']}
          options={[
            {
              id: '1',
              img: user
                ? ((userImage || {}).fullDownloadUrl) || '/img/users/noAvatar.jpg'
                : ((organizationImage || {}).fullDownloadUrl) || '/img/organization/noOrganization.png',
              translatedMessage: user
                ? `${user.firstName || ''} ${user.lastName || ''}`
                : organization.name,
            },
          ]}
          size={100}
          stretch={Boolean(true)}
          showText={Boolean(true)}
          wrapperStyle={{ display: 'flex', justifyContent: 'center' }}
        />
      </div>
      <div style={style.activity.content}>
        <ReactMarkdown
          source={body}
          softBreak="br"
          allowedTypes={[
            'Text',
            'Paragraph',
            'Softbreak',
            'Link',
            'Strong',
            'Emph'
          ]}
          unwrapDisallowed
        />
        {canBeDeleted &&
          <div style={style.deleteButton}>
            <RaisedButton
              label={msg('trash.removeActivity')}
              onClick={onRemove}
              labelStyle={{
                fontSize: '12px',
                fontWeight: 'normal',
              }}
              style={{
                marginLeft: 'auto',
              }}
            />
          </div>
        }
      </div>
    </div>
  </Paper>
);

Comment.propTypes = {
  canBeDeleted: React.PropTypes.bool,
  formatDate: React.PropTypes.func,
  msg: React.PropTypes.func,
  body: React.PropTypes.string,
  onRemove: React.PropTypes.func,
  time: React.PropTypes.string,
  user: React.PropTypes.object,
  userImage: React.PropTypes.object,
  organization: React.PropTypes.object,
  organizationImage: React.PropTypes.object,
};

Comment = translate(Radium(Comment));

@translate
@withRole((state) => {
  const { spam, userDetail: { reviewed }, gps: { area } } = state.trashes.item;
  return {
    area,
    isFetching: state.trashes.isFetching,
    reviewed,
    spam,
  };
})
@connect(state => ({
  item: state.trashes.item.toJS(),
  isFetching: state.trashes.isFetching,
}), {
  addConfirm,
  fetchDetail,
  markAsSpam,
  prepareEventFromTrashes,
  push,
  removeActivity,
  removeComment,
  removeImage,
  removeTrash,
})
@Radium
export default class Detail extends Component {
  static propTypes = {
    addConfirm: React.PropTypes.func.isRequired,
    fetchDetail: React.PropTypes.func,
    formatDate: React.PropTypes.func.isRequired,
    isFetching: React.PropTypes.bool,
    item: React.PropTypes.any,
    markAsSpam: React.PropTypes.func,
    match: React.PropTypes.object,
    msg: React.PropTypes.func,
    prepareEventFromTrashes: React.PropTypes.func,
    push: React.PropTypes.func,
    removeActivity: React.PropTypes.func,
    removeComment: React.PropTypes.func,
    removeImage: React.PropTypes.func,
    removeTrash: React.PropTypes.func,
    roles: React.PropTypes.object,
  }

  state = {
    enableReload: true,
  }

  componentWillMount() {
    this.fetchDetail();
  }

  componentWillReceiveProps(nextProps) {
    const { item, isFetching } = nextProps;
    if (!item.area && !isFetching && this.state.enableReload) {
      setTimeout(() => this.fetchDetail(true), 1000);
      this.setState({ enableReload: false });
    }
  }

  fetchDetail(clearLastItem) {
    const { fetchDetail, match } = this.props;
    fetchDetail(match.params.id, clearLastItem);
  }

  createEventFromTrashes(ids) {
    const { push, prepareEventFromTrashes } = this.props;
    prepareEventFromTrashes(ids);
    push({ pathname: routesList.eventCreate });
  }

  renderActivities() {
    const { addConfirm, msg, item, removeActivity, removeImage, roles } = this.props;
    if (item.updateHistory.length === 0) return null;

    const canBeDeleted = roles.isAuthorized('superAdmin') || roles.isAuthorizedWithArea('admin');

    const history = item.updateHistory.map((val, key) =>
      <History
        key={key}
        user={val.userInfo}
        time={val.updateTime}
        note={val.changed.note}
        anonymous={val.anonymous}
        status={(key === item.updateHistory.length - 1)
          ? 'profile.reported'
          : ((val.changed.status === undefined)
            ? 'trash.updated'
            : ((val.changed.status === 'stillHere')
                ? 'trash.updated'
                : `trash.status.${val.changed.status}`
            )
          )
        }
        images={val.changed.images}
        onImageRemove={(imageId) => addConfirm('image', { onSubmit: () => removeImage(item.id, val.activityId, imageId) })}
        onRemove={() => addConfirm('activity', { onSubmit: () => removeActivity(item.id, val.activityId) })}
        canBeDeleted={canBeDeleted}
      />
    );
    return (
      <div>
        <h2>{msg('trash.history')}</h2>
        <div style={style.topIndentation}>
          {history}
        </div>
      </div>
    );
  }

  renderComments() {
    const { addConfirm, msg, item, removeComment } = this.props;
    if (item.comments.length === 0) return null;

    const comments = item.comments.map((val, key) =>
      <Comment
        key={key}
        user={val.user}
        userImage={val.user_image}
        organization={val.organization}
        organizationImage={val.organization_image}
        time={val.created}
        body={val.body}
        onRemove={() => addConfirm('activity', { onSubmit: () => removeComment(item.id, val.id) })}
        canBeDeleted={val.canIDelete}
      />
    );
    return (
      <div>
        <h2>{msg('trash.comments')}</h2>
        <div style={style.topIndentation}>
          {comments}
        </div>
      </div>
    );
  }

  renderEvents() {
    const { item, msg } = this.props;
    if (!item.events || item.events.length === 0) return null;

    return (
      <div>
        <h2>{msg('event.header')}</h2>
        <div style={style.topIndentation}>
          <Paper>
            <Table
              isPagination={Boolean(false)}
              header={{
                name: {
                  label: msg('event.name'),
                  sortable: false,
                },
                description: {
                  label: msg('event.description'),
                  sortable: false,
                },
                start: {
                  label: msg('event.start'),
                  sortable: false,
                  type: 'date',
                },
                detail: {
                  label: msg('global.showDetail'),
                  sortable: false,
                  type: 'link',
                  linkName: msg('global.detail'),
                  template: routesList.eventDetail.replace(':id', '{id}'),
                },
              }}
              hasPrimaryColor={Boolean(true)}
              data={item.events}
              isLocal={Boolean(true)}
              selectable={Boolean(false)}
            />
          </Paper>
        </div>
      </div>
    );
  }

  renderDetails() {
    const { formatDate, msg, item } = this.props;
    const { firstName, lastName, image } = item.userInfo;

    const accessibility =
      Object.keys(item.accessibility).reduce((last, cur) => {
        if (item.accessibility[cur] === true) {
          return [last, <li>{msg(trashAccessibility[cur].message)}</li>];
        }
        return last;
      }, '');

    return (
      <div className="row">
        <Box
          className="col s12 m4"
          title={msg('trash.updated')}
        >
          <IconPreview
            selected={['1']}
            options={[
              {
                id: '1',
                img: (!item.anonymous && (image || {}).fullDownloadUrl) || '/img/users/noAvatar.jpg',
                translatedMessage: <span>
                  {item.anonymous
                    ? msg('trash.anonymous')
                    : `${firstName || ''} ${lastName || ''}`
                  }
                  <br />
                  {formatDate(item.updateTime)}
                </span>,
              },
            ]}
            size={80}
            stretch={Boolean(true)}
            showText={Boolean(true)}
          />
        </Box>

        <Box
          className="col s12 m4"
          title={msg('trash.trashSize')}
        >
          <IconPreview
            options={trashSizes}
            selected={[item.trashSize]}
            showText
            upperText
            size={80}
          />
        </Box>

        <Box
          className="col s12 m4"
          title={msg('trash.accessibility')}
          text={accessibility}
          showIfEmpty={Boolean(false)}
        />

        <Box
          className="col s12"
          title={msg('trash.trashType')}
        >
          <IconPreview
            options={trashTypes}
            selected={item.types}
            showText
            upperText
            size={80}
          />
        </Box>

        <Box
          title={msg('trash.note')}
          text={item.note}
          showIfEmpty={Boolean(false)}
        />

        <Box
          className="col s12"
          title={msg('trash.gpsLocation')}
          type="location"
          showGPS
          showMap
          item={item}
          zoom={16}
        />
      </div>
    );
  }

  render() {
    const { addConfirm, markAsSpam, removeTrash, item, isFetching, msg, roles, removeImage } = this.props;

    const canBeDeleted =
      roles.isAuthorized('superAdmin') ||
      (roles.isAuthorizedWithArea('admin') && (roles.isSpam() || !roles.isReviewed()));

    const buttons = [
      {
        name: 'refresh',
        label: msg('global.update'),
        linkTo: routesList.trashUpdate.replace(':id', item.id),
      },
      {
        name: 'comment',
        label: msg('global.createComment'),
        linkTo: routesList.commentCreate.replace(':id', item.id),
      },
      canBeDeleted && {
        name: 'delete',
        label: msg('global.remove'),
        onClick: () => addConfirm('trash', { onSubmit: () => removeTrash(item.id) }),
      },
      {
        name: 'spam',
        label: msg('global.reportSpam'),
        onClick: () => addConfirm('spam', { onSubmit: () => markAsSpam(item.id, item.activityId) }),
      },
      {
        name: 'event',
        label: msg('event.create.header'),
        onClick: () => addConfirm('event.fromTrash', { onSubmit: () => this.createEventFromTrashes([item.id]) }),
      },
    ];

    const itemStatus = (item.status === 'stillHere' && item.updateHistory.length === 0) ? 'reported' : item.status;
    const statusName = (isFetching && !item.status) ? 'fetching' : trashStatuses[itemStatus].message;
    const trashName = item.area || [item.gps.lat, item.gps.long].join(', ');

    return (
      <div>
        <div>
          <SecondAppBar
            title={msg('trash.detail.header')}
            rightUpperButtons={buttons}
          />
          <div className="main-content">
            <AppBar
              title={trashName}
              titleStyle={{ ...statusStyle[statusName].style, fontSize: '20px' }}
              style={statusStyle[statusName].style}
              iconStyleRight={{ marginTop: 'auto', marginBottom: 'auto', color: 'white' }}
              iconStyleLeft={{ marginTop: 'auto', marginBottom: 'auto', color: 'white' }}
              iconElementLeft={<img src={statusStyle[statusName].image} alt={status} style={{ height: '24px', marginTop: '2px', marginLeft: '15px', marginRight: '15px' }} />}
              iconElementRight={!isFetching && <span style={style.status}>{msg(statusName)}</span>}
            />

            <Confirm
              cancelLabel={msg('global.cancel')}
              submitLabel={msg('global.confirm')}
              title={msg('global.confirmation.header')}
            />

            <Paper style={style.main}>
              {isFetching
                ? <Loading type="circular" />
                : <div className="row">
                  <div className="col s12 m5">
                    <ImagePreview
                      data={item.images.map((image, key) => ({ src: image, id: image.id, isMain: key === 0 }))}
                      showDelete={(roles.isAuthorized('superAdmin') || roles.isAuthorizedWithArea('admin')) && (item.images || []).length > 1}
                      cols={2}
                      padding={1}
                      hasMain
                      onClick={(imageId) => addConfirm('image', { onSubmit: () => removeImage(item.id, item.activityId, imageId) })}
                    />
                  </div>
                  <div className="col s12 m7">
                    {this.renderDetails()}
                  </div>
                </div>
              }
            </Paper>
            {this.renderActivities()}
            {this.renderComments()}
            {this.renderEvents()}
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
  status: {
    marginTop: '8px',
    marginRight: '10px',
    fontSize: '20px',
  },
  activity: {
    display: 'flex',
    flexWrap: 'wrap',
    '@media (max-width: 724px)': {
      flexDirection: 'column',
    },
    avatar: {
      justifyContent: 'center',
      flexDirection: 'column',
      borderRight: '1px solid rgb(110, 110, 110)',
      background: 'rgb(250, 250, 250)',
      paddingTop: '10px',
      paddingBottom: '10px',
      width: 'calc(20% - 2px)',
      display: 'flex',
      '@media (max-width: 724px)': {
        width: '100%',
        borderRight: 'none',
        borderBottom: '1px solid rgb(110, 110, 110)',
        paddingBottom: 0,
      },
    },
    content: {
      width: '76%',
      display: 'flex',
      flexDirection: 'column',
      padding: '2%',
      '@media (max-width: 724px)': {
        width: '100%',
      },
    },
  },
  deleteButton: {
    display: 'flex',
    '@media (max-width: 724px)': {
      width: '95%',
    },
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
