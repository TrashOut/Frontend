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
import Input from '../../app/components/Input';
import RaisedButton from 'material-ui/RaisedButton';
import React, { PureComponent as Component } from 'react';
import translate from '../../../messages/translate';
import { anonymous, trashAccessibility } from '../../../common/trashmanagement/consts';
import { Field, reduxForm } from 'redux-form';
import { validateCreate } from '../../../common/trashmanagement/validate';
import {connect} from "react-redux";
import withRole from "../../../common/app/withRole";
import {fetchOrganizationThinList} from "../../../common/organizations/actions";
import Loading from "../../app/components/Loading";

const styles = {
  button: {
    marginLeft: '12px',
    fontSize: '0.8em',
  },
};

@translate
@connect(state => ({
  viewer: state.users.viewer,
  organizationIsFetching: state.organizations.isFetching,
  organizationThinList: state.organizations.thinList,
}), {
  fetchOrganizationThinList,
})
@reduxForm({
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  form: 'trashForm',
  validate: validateCreate,
})
@withRole()
export default class FormSecond extends Component {
  static propTypes = {
    handleSubmit: React.PropTypes.func,
    msg: React.PropTypes.func.isRequired,
    previousPage: React.PropTypes.func,
    viewer: React.PropTypes.object,
    roles: React.PropTypes.object,
    organizationIsFetching: React.PropTypes.bool,
    organizationThinList: React.PropTypes.object,
  };

  componentWillMount() {
    const { fetchOrganizationThinList, organizationThinList } = this.props;
    if (Object.keys(organizationThinList).length == 0) fetchOrganizationThinList();
  }

  render() {
    const { handleSubmit, previousPage, msg, viewer, roles, organizationIsFetching, organizationThinList } = this.props;

    if (organizationIsFetching) return <Loading />;

    let organizations;
    if (roles.isAuthorized('superAdmin')) {
      organizations = organizationThinList;
    } else {
      organizations = viewer.organizations
        .filter(org => org.organizationRoleId == 1)
        .reduce((obj, val) => { obj[val.id] = val.name; return obj; }, {});
    }
    organizations = Object.assign(organizations, { 0: msg('trash.anonymous') });

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col s12">
            <Field
              name="note"
              component={Input}
              type="text"
              label={msg('trash.note')}
              multiLine={Boolean(true)}
            />
          </div>
          <div className="col s12 m4">
            <Field
              name="organizationId"
              type="select"
              component={Input}
              items={organizations}
              label={msg('trash.reportAs')}
              translatedSelectPlaceholder={viewer.displayName}
            />
          </div>
        </div>
        <div className="row col s12">
          <div className="right-align">
            <RaisedButton
              type="button"
              style={styles.button}
              label={msg('global.back')}
              onClick={previousPage}
            />
            <RaisedButton
              type="submit"
              style={styles.button}
              label={msg('global.nextStep')}
              primary={Boolean(true)}
            />
          </div>
        </div>
      </form>
    );
  }
}
