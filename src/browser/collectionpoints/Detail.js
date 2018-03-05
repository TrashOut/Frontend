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
import _ from 'lodash';
import AppBar from 'material-ui/AppBar';
import CallIcon from 'material-ui/svg-icons/communication/call';
import Colors from '../../common/app/colors';
import Confirm from '../app/components/Confirm';
import EmailIcon from 'material-ui/svg-icons/communication/email';
import ImagePreview from '../app/components/ImagePreview';
import LinkIcon from 'material-ui/svg-icons/content/link';
import Loading from '../app/components/Loading';
import Paper from 'material-ui/Paper';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import SecondAppBar from '../app/components/SecondAppBar';
import translate from '../../messages/translate';
import withRole from '../../common/app/withRole';
import { addConfirm } from '../../common/confirms/actions';
import { Box, Social } from '../app/components';
import { connect } from 'react-redux';
import { cpCategories, cpScrapyardTypes } from '../../common/collectionpoints/consts';
import { removeImage, markAsSpam, fetchDetail, removeCollectionPoint } from '../../common/collectionpoints/actions';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';

const timeToFormat = (time) => `${time.substring(0, 2)}:${time.substring(2, 4)}`;

const OpeningHours = translate(({ data, msg }) => {
  const count = data.reduce((prev, cur) => (cur[Object.keys(cur)[0]].length > prev) ? cur[Object.keys(cur)[0]].length : prev, 0);
  const result = data.map((x) => {
    const day = Object.keys(x)[0];
    const res = x[day].map((x) => <TableRowColumn>{`${timeToFormat(x.Start.toString())} - ${timeToFormat(x.Finish.toString())}`}</TableRowColumn>);
    for (let i = 0; i < count - res.length; i += 1) {
      res.push(<TableRowColumn />);
    }
    return <TableRow><TableRowColumn>{msg(`global.days.${day}`)}</TableRowColumn>{res}</TableRow>;
  });

  return (<Table selectable={Boolean(false)}>
    <TableBody displayRowCheckbox={Boolean(false)} className="opening-hours">
      {result}
    </TableBody>
  </Table>);
});

@withRole((state) => ({
  area: state.collectionPoints.item.gps.area,
  spam: state.collectionPoints.item.spam,
  isFetching: state.collectionPoints.isFetching,
}))
@connect(state => ({
  item: state.collectionPoints.item.toJS(),
  isFetching: state.collectionPoints.isFetching,
}), { addConfirm, removeImage, markAsSpam, fetchDetail, removeCollectionPoint })
@translate
export default class Detail extends Component {
  static propTypes = {
    addConfirm: React.PropTypes.func,
    fetchDetail: React.PropTypes.func,
    isFetching: React.PropTypes.bool,
    item: React.PropTypes.any,
    markAsSpam: React.PropTypes.func,
    removeImage: React.PropTypes.func,
    removeCollectionPoint: React.PropTypes.func,
    match: React.PropTypes.object,
    roles: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
  };

  state = {
    enableReload: true,
    confirm: {
      activityId: null,
      imageId: null,
      open: false,
      type: 'image',
    },
  };

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

  renderMainInfo() {
    const { item, msg } = this.props;
    return (
      <div>
        <div className="col s12 m6">
          <Box
            title={msg('collectionPoint.size')}
            text={item.collectionPointSize && item.collectionPointSize === 'scrapyard'
              ? msg('collectionPoint.size.recyclingCenter')
              : msg('collectionPoint.size.recyclingBin')
            }
          />
          {item.collectionPointSize === 'scrapyard' &&
            <Box
              title={msg('collectionPoint.contact.header')}
              showIfEmpty={Boolean(false)}
            >
              <Social
                label={item.phone}
                link={`tel:${item.phone}`}
                icon={<CallIcon />}
                fullWidth
              />
              <Social
                label={item.url}
                link={item.url}
                icon={<LinkIcon />}
                fullWidth
              />
              <Social
                label={item.email}
                link={item.email}
                icon={<EmailIcon />}
                fullWidth
              />
            </Box>
          }
        </div>
        <div className="col s12 m6">
          <Box
            title={msg('collectionPoint.allowedTypes')}
            showIfEmpty={Boolean(false)}
          >
            {item.types &&
              Object.keys(_.pickBy(cpCategories, (value) => value.types)).map(cur => {
                const category = cpCategories[cur];
                const types = category.types
                  .filter(x => item.types.indexOf(x) >= 0)
                  .map(x => msg(cpScrapyardTypes[x].message))
                  .join(', ');
                if (!types) return null;
                return (<div className="col s12" style={{ padding: '0' }}>
                  <h4 style={{ padding: '0', margin: '0', marginBottom: '2px' }}>{msg(category.message)}</h4>
                  {types}
                </div>);
              })
            }
          </Box>
        </div>
      </div>);
  }

  renderDescription() {
    const { item, msg } = this.props;

    return (
      <div className="col s12">
        <Box
          title={msg('collectionPoint.note')}
          showIfEmpty={Boolean(false)}
          text={item.note}
        />
      </div>
    );
  }

  renderOpeningHours() {
    const { item, msg } = this.props;
    if (item.collectionPointSize !== 'scrapyard' || !item.openingHours) return null;

    return (
      <div className="col s12">
        <Box
          title={msg('collectionPoint.openingHours')}
        >
          <OpeningHours data={item.openingHours} />
        </Box>
      </div>
    );
  }

  renderLocation() {
    const { item, msg } = this.props;

    return (
      <div>
        <Box
          title={msg('collectionPoint.location')}
          type="location"
          showAddress
          item={item}
        />
        <Box
          title={msg('collectionPoint.gpsLocation')}
          type="location"
          showGPS
          item={item}
        />
        <Box
          title={msg('collectionPoint.gpsMap')}
          type="location"
          showMap
          item={item}
          zoom={16}
        />
      </div>
    );
  }

  render() {
    const { addConfirm, fetchDetail, item, isFetching, markAsSpam, removeImage, removeCollectionPoint, roles, msg } = this.props;
    // if (isFetching || !item) return <Loading />;

    const canBeDeleted =
      roles.isAuthorized('superAdmin') ||
      (roles.isAuthorizedWithArea('admin') && roles.isSpam());

    const canBePhotoDeleted = roles.isAuthorized('superAdmin') || roles.isAuthorizedWithArea('admin');

    const buttons = [
      { name: 'refresh', label: msg('global.edit'), linkTo: routesList.collectionPointUpdate.replace(':id', item.id) },
      canBeDeleted && { name: 'delete', label: msg('global.remove'), onClick: () => addConfirm('collectionPoint.delete', { onSubmit: () => removeCollectionPoint(item.id) }) },
      { name: 'spam', label: msg('global.reportSpam'), onClick: () => addConfirm('spam', { onSubmit: () => markAsSpam(item.activityId) }) },
    ];

    return (
      <div>
        <div>
          <SecondAppBar
            title={msg('collectionPoint.detail.header')}
            rightUpperButtons={buttons}
          />
          <div className="main-content">
            <AppBar
              title={[item.name, item.area].filter(isValid => isValid).join(', ')}
              style={{ background: Colors.secondary }}
              showMenuIconButton={Boolean(false)}
            />
            <Confirm
              cancelLabel={msg('global.cancel')}
              submitLabel={msg('global.confirm')}
              title={msg('global.confirmation.header')}
              onSubmit={() => fetchDetail(item.id)}
            />
            <Paper style={style.main}>
              {isFetching
                ? <Loading type="circular" />
                :
                <div className="row">
                  <div className="col s12 m5">
                    <div className="col s12">
                      <ImagePreview
                        data={item.images.reduce((pre, cur) => pre.concat({ id: cur.id, src: cur.fullDownloadUrl }), [])}
                        showDelete={canBePhotoDeleted}
                        cols={2}
                        padding={1}
                        hasMain={Boolean(true)}
                        onClick={(imageId) => addConfirm('delete-image', { onSubmit: () => removeImage(item.id, item.activityId, imageId) })}
                      />
                    </div>
                    <div className="col s12">
                      {this.renderLocation()}
                    </div>
                  </div>
                  <div className="col s12 m7">
                    {this.renderMainInfo()}
                    {this.renderOpeningHours()}
                    {this.renderDescription()}
                  </div>
                </div>
              }
            </Paper>
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
