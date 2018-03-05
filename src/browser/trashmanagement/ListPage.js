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
import { setDataTab, markMultipleSpams } from '../../common/trashmanagement/actions';
import { Match } from '../../common/app/components';
import { Switch } from 'react-router-dom';
import { Tabs, Tab } from 'material-ui/Tabs';
import { toggleFilter, setFilter, setTable } from '../../common/table/actions';
import { push } from 'react-router-redux';

@translate
@connect(state => ({
  data: state.table.map,
  selectedTab: state.trashes.selectedTab,
  showFilter: state.table.showFilter,
}), { push, setDataTab, setFilter, toggleFilter, setTable, markMultipleSpams })
export default class ListPage extends Component {
  static propTypes = {
    data: React.PropTypes.any,
    location: React.PropTypes.object,
    markMultipleSpams: React.PropTypes.func,
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func,
    selectedTab: React.PropTypes.string,
    setDataTab: React.PropTypes.func,
    setFilter: React.PropTypes.func,
    setTable: React.PropTypes.func,
    showFilter: React.PropTypes.bool,
    toggleFilter: React.PropTypes.func,
  };

  componentWillMount() {
    const { setTable } = this.props;
    setTable('TABLE_TYPE_TRASH');
  }

  render() {
    const { push, location: { pathname }, markMultipleSpams, data, msg, selectedTab, setDataTab, setFilter, showFilter, toggleFilter } = this.props;
    const selectedItems = data.filter(x => x.selected);

    const buttons = [
      {
        name: 'filter',
        label: msg(showFilter ? 'global.hideFilter' : 'global.showFilter'),
        onClick: toggleFilter,
      },
      {
        name: 'add',
        label: msg('trash.create.title'),
        linkTo: routesList.trashCreate,
      },
    ];

    if (selectedTab !== 'map') {
      buttons.push({
        name: 'export',
        userRole: 'manager',
        label: msg('global.export'),
        linkTo: routesList.trashExport,
      });
    }

    if (selectedItems.size > 0) {
      buttons.push({
        name: 'markAsSpam',
        label: msg('global.reportSpam'),
        onClick: () => markMultipleSpams(selectedItems),
      });
    }

    return (
      <div>
        <SecondAppBar
          rightUpperButtons={buttons}
        />
        <div className="main-content">
          <Switch>
            <Match
              userRole="manager"
              exactly
              path={routesList.trashExport}
              component={Export}
            />
          </Switch>
          <Filter
            onSubmit={(values) => {
              setFilter(values);
              toggleFilter();
            }}
          />
          <Tabs
            value={selectedTab}
            onChange={(tab) => {
              push(tab === 'table' ? routesList.trashList : routesList.trashMap);
            }}
          >
            <Tab label={msg('global.table')} value="table" icon={<GridOn />} />
            <Tab label={msg('global.map')} value="map" icon={<NearMe />} />
          </Tabs>
          <Switch>
            <Match
              path={routesList.trashList}
              exactly
              render={() => { setDataTab('table'); return <List pathname={pathname} />; }}
            />
            <Match
              path={routesList.trashMap}
              exactly
              render={() => { setDataTab('map'); return <Map />; }}
            />
          </Switch>
        </div>
      </div>
    );
  }
}
