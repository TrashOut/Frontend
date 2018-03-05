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
import routesList from '../routesList';
import Table from '../app/components/Table';
import translate from '../../messages/translate';
import { collectionPointSizes } from '../../common/collectionpoints/consts';
import { connect } from 'react-redux';
import { fetchCollectionPointList } from '../../common/collectionpoints/actions';

@translate
@connect(state => ({
  filter: state.table.filter,
  data: state.table.map,
}), { fetchCollectionPointList })
export default class List extends Component {
  static propTypes = {
    data: React.PropTypes.object,
    fetchCollectionPointList: React.PropTypes.func,
    filter: React.PropTypes.any,
    msg: React.PropTypes.func.isRequired,
    style: React.PropTypes.any,
  };

  componentWillMount() {
    const { fetchCollectionPointList } = this.props;
    fetchCollectionPointList();
  }

  componentWillReceiveProps(nextProps) {
    const { fetchCollectionPointList, filter } = this.props;
    if (nextProps.filter !== filter) {
      fetchCollectionPointList();
    }
  }

  render() {
    const { style, msg, data } = this.props;

    return (
      <Paper style={style}>
        <Table
          header={{
            name: {
              label: msg('collectionPoint.name'),
              sortable: false,
              type: 'calculated',
              calculatedValue: collectionPoint => collectionPoint.collectionPointSize === 'dustbin'
                ? msg('collectionPoint.size.recyclingBin')
                : collectionPoint.name,
            },
            collectionPointSize: {
              label: msg('collectionPoint.size'),
              sortable: true,
            },
            area: {
              label: msg('collectionPoint.location'),
              type: 'area',
              areaDescription: '{locality}, {country}',
            },
            id: {
              label: msg('collectionPoint.id'),
              sortable: true,
            },
          }}
          data={data}
          showLinkButton={Boolean(true)}
          urlTemplate={routesList.collectionPointDetail.replace(':id', '{id}')}
          translatedFields={{
            collectionPointSize: collectionPointSizes,
          }}
        />
      </Paper>
    );
  }
}
