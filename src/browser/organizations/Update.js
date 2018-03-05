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
import Form from './form/Form';
import Loading from '../app/components/Loading';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import SecondAppBar from '../app/components/SecondAppBar';
import translate from '../../messages/translate';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { updateOrganization, fetchOrganization } from '../../common/organizations/actions';

@translate
@connect(state => ({
  isFetching: state.organizations.isFetching,
  item: state.organizations.item,
}), { push, updateOrganization, fetchOrganization })
export default class Update extends Component {
  static propTypes = {
    fetchOrganization: React.PropTypes.func,
    handleSubmit: React.PropTypes.func,
    isFetching: React.PropTypes.bool,
    item: React.PropTypes.object,
    match: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    params: React.PropTypes.object,
    push: React.PropTypes.func,
    updateOrganization: React.PropTypes.func,
  };

  componentWillMount() {
    const { fetchOrganization, match: { params: { id } } } = this.props;
    fetchOrganization(id);
  }

  render() {
    const { push, updateOrganization, item, isFetching, msg, match: { params: { id } } } = this.props;

    return (
      <div>
        <SecondAppBar
          title={msg('global.edit')}
        />
        <div className="main-content">
          {isFetching
            ? <Loading type="circular" />
            : <Form
              onCancel={() => push(routesList.organizationsDetail.replace(':id', id))}
              onSubmit={(values) => updateOrganization(values)}
              data={item.toForm()}
            />
          }
        </div>
      </div>
    );
  }
}
