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
import { connect } from 'react-redux';
import { fetchOrganizationList } from '../../../common/organizations/actions';
import { Field, reduxForm } from 'redux-form';
import { setTable } from '../../../common/table/actions';
import { OrganizationAreaFilter } from '../../areas/form/Form';
import { validateCreate } from '../../../common/organizations/validate';

@translate
@connect(state => ({
  data: state.table.map,
  isFetching: state.table.isFetching,
}), {
  fetchOrganizationList,
  setTable,
})
@reduxForm({
  form: 'organization',
  validate: validateCreate,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})
export default class Form extends Component {
  static propTypes = {
    change: React.PropTypes.func,
    data: React.PropTypes.object,
    email: React.PropTypes.string,
    fetchOrganizationList: React.PropTypes.func,
    files: React.PropTypes.array,
    handleSubmit: React.PropTypes.func,
    isFetching: React.PropTypes.bool,
    managers: React.PropTypes.array,
    msg: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
    previousPage: React.PropTypes.func,
    setTable: React.PropTypes.func,
    usersFetching: React.PropTypes.bool,
  };

  componentDidMount() {
    const { fetchOrganizationList, setTable } = this.props;
    setTable('TABLE_TYPE_ORGANIZATION');
    fetchOrganizationList('all');
  }

  render() {
    const {
      handleSubmit,
      msg,
      data,
      isFetching,
      previousPage,
    } = this.props;

    if (isFetching || !data) return null;
    const organizations = data.toArray().map(x => ({ id: `${x.id}`, label: x.name }));

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col s12">
            <Field
              name="parentId"
              type="select"
              items={organizations}
              selectPlaceholder="global.select"
              label={msg('organization.parent')}
              component={Input}
            />
          </div>
          <div className="col s12">
            <OrganizationAreaFilter />
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

const styles = {
  button: {
    marginLeft: '12px',
  },
  preview: {
    flexBasis: '25%',
    padding: '1%',
    marginRight: '2%',
    wrapper: {
      width: '100%',
      float: 'left',
      position: 'relative',
      display: 'flex',
      justifyContent: 'flex-start',
    },
    image: {
      width: '100%',
    },
    remove: {
      color: 'red',
      float: 'right',
      marginBottom: '1%',
    },
  },
};

