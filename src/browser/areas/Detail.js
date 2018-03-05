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
import AddAdmin from './AddAdmin';
import AddAlias from './AddAlias';
import Aliases from './Aliases';
import Loading from '../app/components/Loading';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import translate from '../../messages/translate';
import Users from './Users';
import { connect } from 'react-redux';
import { fetchArea, setDataTab } from '../../common/areas/actions';
import { fetchAreaUsers } from '../../common/users/actions';
import { Match } from '../../common/app/components';
import { Switch } from 'react-router-dom';
import { Tabs, Tab } from 'material-ui/Tabs';

@translate
@connect(state => ({
  isAreaFetching: state.areas.isAreaFetching,
  item: state.areas.item,
  aliases: state.areas.item && state.areas.item.aliases,
  selectedTab: state.areas.selectedTab || 'alias',
}), { fetchArea, fetchAreaUsers, setDataTab })
export default class Detail extends Component {
  static propTypes = {
    fetchArea: React.PropTypes.func,
    fetchAreaUsers: React.PropTypes.func,
    isAreaFetching: React.PropTypes.bool,
    item: React.PropTypes.object,
    match: React.PropTypes.func.object,
    msg: React.PropTypes.func.isRequired,
    selectedTab: React.PropTypes.string,
    setDataTab: React.PropTypes.func,
  };
  static contextTypes = {
    router: React.PropTypes.object,
  }

  componentWillMount() {
    const { match: { params: { id } } } = this.props;
    this.fetchData(parseInt(id, 10));
  }

  componentWillReceiveProps(nextProps) {
    const { match: { params: { id } } } = this.props;
    const { match: { params: { id: nextId } } } = nextProps;

    if (id !== nextId) this.fetchData(parseInt(nextId, 10));
  }

  fetchData(id) {
    const { fetchArea, fetchAreaUsers } = this.props;

    fetchArea(id);
    fetchAreaUsers(id, 1);
    fetchAreaUsers(id, 2);
    fetchAreaUsers(id, 3);
  }

  render() {
    const { msg, isAreaFetching, selectedTab, item, setDataTab } = this.props;
    if (!item || isAreaFetching) return <Loading />;

    return (
      <div>
        <h2>{item.name}</h2>
        <Switch>
          <Match
            path={routesList.areaAddAdmin}
            render={() =>
              <AddAdmin
                title={msg('geo.addAdmin')}
                button={msg('global.selectUser')}
                label={msg('global.findUser')}
              />
            }
          />
          <Match
            path={routesList.areaAddAlias}
            component={AddAlias}
          />
        </Switch>
        <Tabs
          value={selectedTab}
          onChange={setDataTab}
        >
          <Tab label={msg('geo.aliases')} value="alias">
            { selectedTab === 'alias' && <Aliases /> }
          </Tab>
          <Tab label={msg('geo.admins')} value="admins">
            { selectedTab === 'admins' && <Users type="admin" /> }
          </Tab>
          <Tab label={msg('geo.managers')} value="managers">
            { selectedTab === 'managers' && <Users type="manager" /> }
          </Tab>
          <Tab label={msg('geo.users')} value="users">
            { selectedTab === 'users' && <Users /> }
          </Tab>
        </Tabs>
      </div>
    );
  }
}
