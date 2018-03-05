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
import React from 'react';
import UiAppBar from 'material-ui/AppBar';
import Breadcrumbs from './Breadcrumbs';
import FlatButton from 'material-ui/FlatButton';
import Colors from '../../../common/app/colors';
import AddLocation from 'material-ui/svg-icons/maps/add-location';
import translate from '../../../messages/translate';
import Link from './Link';
import routesList from '../../routesList';

const style = {
  backgroundColor: Colors.primary,
};
const innerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};
const rightSide = {
  width: 'auto',
  margin: '0',
};
const leftSide = {
  width: 'auto',
  margin: '0',
};
const containerStyle = {
  position: 'fixed',
  zIndex: '100',
  color: Colors.darkFont,
};
const signoutStyle = {
  color: 'white',
};

@translate
export default class AppBar extends React.Component {
  static propTypes = {
    showMenuIconButton: React.PropTypes.bool,
    breadcrumbs: React.PropTypes.object,
    onMenuClick: React.PropTypes.func,
    msg: React.PropTypes.func.isRequired,
  };

  render() {
    const { showMenuIconButton, breadcrumbs, onMenuClick, msg } = this.props;
    return (
      <div style={containerStyle} className="main-appbar-container">
        <UiAppBar showMenuIconButton={showMenuIconButton} style={style} className="AppBar" onLeftIconButtonTouchTap={onMenuClick}>
          <div style={innerStyle}>
            <div style={leftSide}>
              {(!showMenuIconButton) ?
                <Breadcrumbs links={breadcrumbs.toArray()} />
                : ''
              }
            </div>
            <div style={rightSide}>
              <Link
                to={routesList.trashCreate}
              >
                <FlatButton
                  label={msg('trash.create.title')}
                  backgroundColor={Colors.secondary}
                  hoverColor={Colors.white}
                  className="signOut"
                  style={signoutStyle}
                  icon={<AddLocation className="signOutIcon" />}
                />
              </Link>
            </div>
          </div>
        </UiAppBar>
      </div>
    );
  }
}

