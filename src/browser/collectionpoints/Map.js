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
import GoogleMap from '../app/components/GoogleMap';
import Paper from 'material-ui/Paper';
import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import { fetchCollectionPointList } from '../../common/collectionpoints/actions';
import { select } from '../../common/table/actions';
import { setCenter } from '../../common/map/actions';

@connect(state => ({
  filter: state.table.filter,
  isFetching: state.table.isFetching || state.trashes.isFetching,
  map: state.map.map,
  results: state.table.map,
  zoom: state.map.zoom,
}), { fetchCollectionPointList, select, setCenter })
export default class Map extends Component {
  static propTypes = {
    fetchCollectionPointList: React.PropTypes.func,
    filter: React.PropTypes.object,
    results: React.PropTypes.array,
    select: React.PropTypes.func,
  }

  componentWillReceiveProps(nextProps) {
    const { fetchCollectionPointList, filter } = this.props;
    if (nextProps.filter !== filter) {
      fetchCollectionPointList();
    }
  }

  render() {
    const { fetchCollectionPointList, select } = this.props;

    const { results } = this.props;
    return (
      <Paper>
        <GoogleMap
          hasCenter={Boolean(false)}
          points={results}
          onMarkerToggle={(id) => select(id, true)}
          onIdle={fetchCollectionPointList}
          showSearch
          useGoogleCluster
          minZoom={9}
        />
      </Paper>
    );
  }
}

