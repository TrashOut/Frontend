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
import Link from './Link';
import React from 'react';
import UiMenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import { hasAuthorization } from '../../../common/auth/helpers';

const MenuItem = ({ title, link, icon, active, userRole, viewer }) => {
  const roleId = viewer && viewer.userRoleId;

  if (!hasAuthorization(userRole, roleId)) {
    return null;
  }

  if (active) {
    return (
      <Link to={link} replace>
        <UiMenuItem className={active && 'menu-link'} primaryText={title} leftIcon={icon} />
      </Link>
    );
  }

  if (link) {
    return (
      <Link to={link}>
        <UiMenuItem className={active && 'menu-link'} primaryText={title} leftIcon={icon} />
      </Link>
    );
  }
  return (<UiMenuItem primaryText={title} leftIcon={icon} />);
};

MenuItem.propTypes = {
  title: React.PropTypes.string.isRequired,
  link: React.PropTypes.string,
  icon: React.PropTypes.any,
  active: React.PropTypes.bool,
  userRole: React.PropTypes.string,
  viewer: React.PropTypes.object,
};

export default connect(state => ({
  viewer: state.users.viewer,
}), null)(MenuItem);
