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
import AddManager from './AddManager';
import ChooseArea from './ChooseArea';
import Detail from './Detail';
import Paper from 'material-ui/Paper';
import React, { PureComponent as Component } from 'react';
import routesList from '../../routesList';
import SecondAppBar from '../../app/components/SecondAppBar';
import Table from '../../app/components/Table';
import translate from '../../../messages/translate';
import { areaTypes } from '../../../common/consts';
import { connect } from 'react-redux';
import { Match } from '../../../common/app/components';

@connect(state => ({
  userAreas: state.users.viewer.userHasArea,
  item: state.areas.item,
}), null)
@translate
export default class Home extends Component {
  static propTypes = {
    item: React.PropTypes.object,
    location: React.PropTypes.object,
    match: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    userAreas: React.PropTypes.array,
  };

  render() {
    const { item, userAreas, msg, match, location } = this.props;

    const hasAppBarMenuItems = item && (match.path !== location.pathname);
    const buttons = hasAppBarMenuItems && [
      { name: 'addManager', label: msg('geo.addManager'), linkTo: routesList.areaAddManager.replace(':id', item.id) },
    ];

    return (
      <div>
        <Match
          path={routesList.areaAddManager}
          component={AddManager}
        />
        <Match
          path={routesList.areaChooseArea}
          component={ChooseArea}
        />
        {hasAppBarMenuItems &&
          <SecondAppBar
            rightUpperButtons={buttons}
          />
        }
        <div className={`main-content ${!hasAppBarMenuItems && 'no-appbar'}`}>
          <h2 style={styles.header}>{msg('geo.admin.myAreas')}</h2>
          <p>{msg('geo.description.admin')}</p>
          <Paper>
            <Table
              isPagination={Boolean(false)}
              header={{
                id: { label: msg('geo.id'), sortable: false },
                type: { label: msg('geo.type'), sortable: false },
                name: { label: msg('geo.name'), sortable: false },
                addManager: {
                  label: msg('geo.selectArea.header'),
                  sortable: false,
                  type: 'link',
                  linkName: msg('geo.selectArea'),
                  template: routesList.areaChooseArea.replace(':id', '{id}'),
                },
              }}
              data={userAreas.filter(x => x.userAreaRoleId === '1').map(x => ({
                id: x.areaId,
                type: x.area.type,
                name: x.area[x.area.type],
              }))}
              isLocal
              selectable={Boolean(false)}
              showLinkButton={Boolean(false)}
              translatedFields={{
                type: areaTypes,
              }}
            />
          </Paper>
          <Match
            path={routesList.areaDetail}
            component={Detail}
          />
        </div>
      </div>
    );
  }
}

const styles = {
  header: {
    marginTop: 0,
    paddingTop: 0,
  },
};
