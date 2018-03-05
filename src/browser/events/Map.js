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
import { fetchEventList } from '../../common/events/actions';
import { setCenter } from '../../common/map/actions';
import { connect } from 'react-redux';
import { select, clear } from '../../common/table/actions';

@connect(state => ({
  results: state.table.map,
  tab: state.events.selectedTab,
  type: state.table.type,
  filter: state.table.filter,
}), { fetchEventList, select, setCenter, clear })
export default class Map extends Component {
  static propTypes = {
    clear: React.PropTypes.func,
    fetchEventList: React.PropTypes.func,
    filter: React.PropTypes.object,
    results: React.PropTypes.array,
    select: React.PropTypes.func,
    tab: React.PropTypes.string,
    type: React.PropTypes.string,
  };

  componentWillReceiveProps(nextProps) {
    const { fetchEventList, filter } = this.props;
    if (nextProps.filter !== filter) {
      fetchEventList();
    }
  }

  render() {
    const { fetchEventList, clear, tab, type, select } = this.props;

    if (type !== 'TABLE_TYPE_EVENT' || tab === 'table') {
      clear();
      return null;
    }

    const { results } = this.props;

    return (
      <Paper>
        <GoogleMap
          hasCenter={Boolean(false)}
          points={results}
          zoom={9}
          onMarkerToggle={(id) => select(id, true)}
          onIdle={fetchEventList}
          minZoom={9}
          useGoogleCluster
          showSearch
        />
      </Paper>
    );
  }
}

