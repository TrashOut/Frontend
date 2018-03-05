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
import Export from './Export';
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
import { Match } from '../../common/app/components';
import { push } from 'react-router-redux';
import { setDataTab } from '../../common/collectionpoints/actions';
import { Switch } from 'react-router-dom';
import { Tabs, Tab } from 'material-ui/Tabs';
import { toggleFilter, setFilter, setTable } from '../../common/table/actions';

@translate
@connect(state => ({
  data: state.trashes.map,
  selectedTab: state.collectionPoints.selectedTab,
  showFilter: state.table.showFilter,
}), { push, setDataTab, setFilter, toggleFilter, setTable })
export default class ListPage extends Component {
  static propTypes = {
    data: React.PropTypes.any,
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired,
    selectedTab: React.PropTypes.string,
    setDataTab: React.PropTypes.func,
    setFilter: React.PropTypes.func,
    setTable: React.PropTypes.func,
    showFilter: React.PropTypes.bool,
    toggleFilter: React.PropTypes.func,
  };
  componentWillMount() {
    const { setTable } = this.props;
    setTable('TABLE_TYPE_COLLECTION_POINT');
  }

  render() {
    const { push, msg, selectedTab, setDataTab, setFilter, showFilter, toggleFilter } = this.props;

    const buttons = [
      {
        name: 'filter',
        label: msg(showFilter ? 'global.hideFilter' : 'global.showFilter'),
        onClick: toggleFilter,
      },
      {
        name: 'add',
        label: msg('global.create'),
        linkTo: routesList.collectionPointCreate,
      },
      {
        name: 'export',
        userRole: 'manager',
        label: msg('global.export'),
        linkTo: routesList.collectionPointExport,
      },
    ];

    return (
      <div>
        <Switch>
          <Match
            userRole="manager"
            exactly
            path={routesList.collectionPointExport}
            component={Export}
          />
        </Switch>
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
            onChange={(tab) => push(tab === 'table'
              ? routesList.collectionPointList
              : routesList.collectionPointMap)
            }
          >
            <Tab label={msg('global.table')} value="table" icon={<GridOn />} />
            <Tab label={msg('global.map')} value="map" icon={<NearMe />} />
          </Tabs>
          <Switch>
            <Match
              path={routesList.collectionPointList}
              render={() => { setDataTab('table'); return <List />; }}
            />
            <Match
              path={routesList.collectionPointMap}
              render={() => { setDataTab('map'); return <Map />; }}
            />
          </Switch>
        </div>
      </div>
    );
  }
}
