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
import routesList from '../../routesList';
import translate from '../../../messages/translate';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import { validateCreate } from '../../../common/organizations/validate';
import {getLanguagesGlobal} from "../../../common/helpers";

const languagesGlobal = getLanguagesGlobal();

@translate
@connect(state => ({
  data: state.table.map,
  isFetching: state.table.isFetching,
}), { push })
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
    push: React.PropTypes.func,
    setTable: React.PropTypes.func,
    usersFetching: React.PropTypes.bool,
  };

  render() {
    const {
      handleSubmit,
      msg,
      push,
      onCancel,
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col s12">
            <Field
              name="name"
              component={Input}
              label={msg('organizations.name')}
              hint={msg('organizations.name')}
            />
          </div>
          <div className="col s12">
            <Field
              name="description"
              type="text"
              component={Input}
              label={msg('global.note')}
              hint={msg('global.note')}
              multiLine={Boolean(true)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col s12 m6">
            <Field
              name="contactUrl"
              component={Input}
              label={msg('global.url')}
              hint={msg('global.url')}
            />
          </div>
          <div className="col s12 m6">
            <Field
              name="contactTwitter"
              component={Input}
              label={msg('user.twitter')}
              hint={msg('user.twitter')}
            />
          </div>
        </div>
        <div className="row">
          <div className="col s12 m6">
            <Field
              name="contactFacebook"
              component={Input}
              label={msg('user.facebook')}
              hint={msg('user.facebook')}
            />
          </div>
          <div className="col s12 m6">
            <Field
              name="contactGooglePlus"
              component={Input}
              label={msg('user.google')}
              hint={msg('user.google')}
            />
          </div>
        </div>
        <div className="row">
          <div className="col s12 m6">
            <Field
              name="contactPhone"
              type="phone"
              component={Input}
              label={msg('global.phone')}
              hint={msg('global.phone')}
            />
          </div>
          <div className="col s12 m6">
            <Field
              name="contactEmail"
              component={Input}
              label={msg('global.email')}
              hint={msg('global.email')}
            />
          </div>
        </div>
        <div className="row">
          <div className="col s12 m6">
            <Field
              name="language"
              type="select"
              items={languagesGlobal}
              component={Input}
              label={msg('organization.language')}
              hint={msg('organization.language')}
              selectPlaceholder="global.select"
            />
          </div>
        </div>
        <div className="row col s12">
          <div className="right-align">
            <RaisedButton
              type="button"
              style={styles.button}
              label={msg('global.cancel')}
              onClick={() => onCancel ? onCancel() : push(routesList.organizationsList)}
            />
            <RaisedButton
              type="submit"
              label={msg('global.nextStep')}
              style={styles.button}
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
