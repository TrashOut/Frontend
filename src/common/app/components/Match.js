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
import { addBreadcrumbs } from '../../breadcrumbs/actions';
import { connect } from 'react-redux';
import { hasAuthorization } from '../../auth/helpers';
import { push } from 'react-router-redux';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';

const Match = ({
  component: Component,
  render,
  viewer,
  breadcrumb,
  addBreadcrumbs,
  userRole,
  push,
  redirect = true,
  exactRole = false,
  path,
  customProps,
  onBeforeRender,
  isUnauthorized,
  ...props
}) => {
  const replacePath = (to) => {
    if (redirect) push(to);
    return null;
  };

  const roleId = viewer && viewer.userRoleId;

  if (breadcrumb && props) {
    addBreadcrumbs(path, breadcrumb);
  }

  if (isUnauthorized || !hasAuthorization(userRole, roleId, exactRole)) {
    return replacePath('/unauthorized');
  }

  return (<Route
    path={path}
    {...props}
    render={renderProps => {
      if (onBeforeRender) onBeforeRender();
      return render
        ? render(renderProps)
        : <Component {...customProps} {...renderProps} />;
    }}
  />);
};

Match.propTypes = {
  addBreadcrumbs: React.PropTypes.func,
  breadcrumb: React.PropTypes.string,
  component: React.PropTypes.func,
  customProps: React.PropTypes.object,
  exactRole: React.PropTypes.bool,
  isUnauthorized: React.PropTypes.bool,
  onBeforeRender: React.PropTypes.func,
  path: React.PropTypes.string,
  push: React.PropTypes.func,
  redirect: React.PropTypes.bool,
  render: React.PropTypes.func,
  userRole: React.PropTypes.string,
  viewer: React.PropTypes.object,
};

export default withRouter(connect(state => ({
  viewer: state.users.viewer,
}), { addBreadcrumbs, push })(Match));
