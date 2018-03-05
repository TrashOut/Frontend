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
import Filter from './Filter';
import GridOn from 'material-ui/svg-icons/image/grid-on';
import List from './List';
import Map from './Map';
import NearMe from 'material-ui/svg-icons/maps/near-me';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import SecondAppBar from '../app/components/SecondAppBar';
import translate from '../../messages/translate';
import { connect } from 'react-redux';
import { setDataTab } from '../../common/events/actions';
import { Tabs, Tab } from 'material-ui/Tabs';
import { toggleFilter, setFilter, setTable } from '../../common/table/actions';

@translate
@connect(state => ({
  selectedTab: state.events.selectedTab,
  showFilter: state.table.showFilter,
}), { setDataTab, setFilter, toggleFilter, setTable })
export default class ListPage extends Component {
  static propTypes = {
    msg: React.PropTypes.func.isRequired,
    setTable: React.PropTypes.func,
    selectedTab: React.PropTypes.string,
    setDataTab: React.PropTypes.func,
    setFilter: React.PropTypes.func,
    showFilter: React.PropTypes.bool,
    toggleFilter: React.PropTypes.func,
  };
  componentWillMount() {
    const { setTable } = this.props;
    setTable('TABLE_TYPE_EVENT');
  }
  render() {
    const { selectedTab, setDataTab, setFilter, showFilter, toggleFilter, msg } = this.props;

    const buttons = [
      {
        name: 'filter',
        label: msg(showFilter ? 'global.hideFilter' : 'global.showFilter'),
        onClick: toggleFilter,
      },
      {
        name: 'add',
        label: msg('global.create'),
        linkTo: routesList.eventCreate,
      },
    ];

    return (
      <div>
        <SecondAppBar
          rightUpperButtons={buttons}
        />
        <div className="main-content">
          <Filter
            onSubmit={(values) => {
              setFilter(values);
              toggleFilter();
            }}
          />
          <Tabs
            value={selectedTab}
            onChange={setDataTab}
          >
            <Tab label={msg('global.table')} value="table" icon={<GridOn />} >
              { selectedTab !== 'map' && <List /> }
            </Tab>
            <Tab label={msg('global.map')} value="map" icon={<NearMe />} >
              { selectedTab === 'map' && <Map /> }
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}
