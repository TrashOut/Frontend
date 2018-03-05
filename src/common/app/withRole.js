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
import { connect } from 'react-redux';
import { fetchUser } from '../users/actions';
import {
  hasAreaAuthorization,
  hasAuthorization,
  hasEventAuthorization,
  hasOrganizationAuthorization,
  hasArticleAuthorization,
} from '../auth/helpers';
import { push } from 'react-router-redux';

const withRole = (getItems = () => ({}), checkAccess) => (WrappedComponent: Function) => {
  class WithRoleProvider extends React.Component {
    static propTypes = {
      area: React.PropTypes.object,
      event: React.PropTypes.object,
      isFetching: React.PropTypes.bool,
      organization: React.PropTypes.object,
      push: React.PropTypes.func.isRequired,
      reviewed: React.PropTypes.object,
      spam: React.PropTypes.array,
      trash: React.PropTypes.object,
      viewer: React.PropTypes.object,
      article: React.PropTypes.object,
    };

    componentWillReceiveProps(nextProps) {
      if (nextProps.isFetching) return;
      const { push } = this.props;
      switch (checkAccess) {
        case 'event': {
          if (!this.isAuthorizedWithEvent(nextProps)) push('/unauthorized');
        }
      }
    }

    getUserRole() {
      const { viewer } = this.props;
      return viewer.userRoleId;
    }

    getEventRole() {
      const { event, viewer } = this.props;
      if (hasEventAuthorization(viewer, event)) return 'MANAGER';
      if (event.users.filter(x => x.userId === viewer.id).length > 0) return 'JOINED';
      return null;
    }

    getOrganizationRole() {
      const { organization, viewer } = this.props;
      if (hasOrganizationAuthorization(viewer, organization, 'manager')) return 'MANAGER';
      if (hasOrganizationAuthorization(viewer, organization, 'member')) return 'MEMBER';
      return null;
    }

    isAuthorized(roleId, exactRole = false) {
      const { viewer } = this.props;
      return hasAuthorization(roleId, viewer.userRoleId, exactRole);
    }

    isSpam() {
      const { spam } = this.props;
      return spam.length > 0;
    }

    isReviewed() {
      const { reviewed } = this.props;
      return reviewed;
    }

    isAuthorizedWithArea(roleId, exactRole = false) {
      if (this.isAuthorized('superAdmin')) return true;
      const { area, viewer } = this.props;
      return hasAreaAuthorization(viewer.userHasArea, area, roleId, exactRole);
    }

    isAuthorizedWithOrganization(roleId) {
      const { organization, viewer } = this.props;
      return hasOrganizationAuthorization(viewer, organization, roleId);
    }

    isAuthorizedWithEvent(nextProps) {
      const { event, viewer } = nextProps || this.props;
      return this.isAuthorized('admin') || this.isAuthorized('superAdmin') || hasEventAuthorization(viewer, event);
    }

    isAuthorizedWithArticle() {
      if (this.isAuthorized('admin')) return true;
      const { article, viewer } = this.props;
      return hasArticleAuthorization(viewer, article);
    }

    render() {
      const { isFetching, ...props } = this.props;
      props.roles = {
        getUserRole: () => !isFetching && this.getUserRole(),
        isSpam: () => !isFetching && this.isSpam(),
        isReviewed: () => !isFetching && this.isReviewed(),
        isAuthorized: (...props) => !isFetching && this.isAuthorized(props),
        isAuthorizedWithArea: (...props) => !isFetching && this.isAuthorizedWithArea(props),
        isAuthorizedWithEvent: () => !isFetching && this.isAuthorizedWithEvent(),
        getEventRole: () => !isFetching && this.getEventRole(),
        isAuthorizedWithOrganization: (roleId) => !isFetching && this.isAuthorizedWithOrganization(roleId),
        getOrganizationRole: () => !isFetching && this.getOrganizationRole(),
        getArticleRole: () => !isFetching && this.getArticleRole(),
        isAuthorizedWithArticle: () => !isFetching && this.isAuthorizedWithArticle(),
      };
      return (
        <WrappedComponent {...props} />
      );
    }

  }

  WithRoleProvider = connect(state => ({
    ...getItems(state),
    viewer: state.users.viewer,
  }), { fetchUser, push })(WithRoleProvider);
  return WithRoleProvider;
};


export default withRole;
