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
import _ from 'lodash';
import ImagePreview from '../app/components/ImagePreview';
import Input from '../app/components/Input';
import Loading from '../app/components/Loading';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import SecondAppBar from '../app/components/SecondAppBar';
import translate from '../../messages/translate';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { formRemoveImage } from '../../common/forms/actions';
import { getPosition } from '../../common/map/actions';
import { push } from 'react-router-redux';
import { trashSizes, trashTypes, trashAccessibility, trashStatuses, anonymous, cleanedByMe } from '../../common/trashmanagement/consts';
import { updateTrash, fetchDetail } from '../../common/trashmanagement/actions';
import { validateUpdate, asyncValidate } from '../../common/trashmanagement/validate';
import withRole from "../../common/app/withRole";
import {fetchOrganizationThinList} from "../../common/organizations/actions";

const selector = formValueSelector('trashForm');

@translate
@connect(state => ({
  files: selector(state, 'images'),
  status: selector(state, 'status'),
  initialValues: state.trashes.itemForm && state.trashes.itemForm.toJS(),
  item: state.trashes.item,
  isFetching: state.trashes.isFetching,
  apiRunningQueries: state.app.pendingCount,
  viewer: state.users.viewer,
  organizationIsFetching: state.organizations.isFetching,
  organizationThinList: state.organizations.thinList,
}), { push, formRemoveImage, getPosition, updateTrash, fetchDetail, fetchOrganizationThinList })
@reduxForm({
  form: 'trashForm',
  validate: validateUpdate,
  asyncValidate,
  asyncBlurFields: ['images'],
})
@withRole()
export default class UpdateForm extends Component {
  static propTypes = {
    fetchDetail: React.PropTypes.func,
    files: React.PropTypes.array,
    formRemoveImage: React.PropTypes.func,
    getPosition: React.PropTypes.func,
    handleSubmit: React.PropTypes.func,
    isFetching: React.PropTypes.bool,
    item: React.PropTypes.object,
    match: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func,
    submitting: React.PropTypes.bool,
    updateTrash: React.PropTypes.func,
    initialValues: React.PropTypes.object,
    apiRunningQueries: React.PropTypes.bool,
    status: React.PropTypes.string,
    viewer: React.PropTypes.object,
    roles: React.PropTypes.object,
    organizationIsFetching: React.PropTypes.bool,
    organizationThinList: React.PropTypes.object,
  };

  componentWillMount() {
    const { initialValues, fetchDetail, match, fetchOrganizationThinList, organizationThinList } = this.props;

    getPosition();
    if (!initialValues) {
      fetchDetail(match.params.id);
    }

    if (Object.keys(organizationThinList).length == 0) fetchOrganizationThinList();
  }

  render() {
    const { status, apiRunningQueries, isFetching, push, handleSubmit, submitting, files, formRemoveImage, updateTrash, item, msg, viewer, roles, organizationIsFetching, organizationThinList } = this.props;

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
      <div>
        <SecondAppBar
          title={msg('trash.edit.header')}
        />
        <div className="main-content">
          <Paper style={styles.paper}>
            {files &&
              <ImagePreview
                data={files.map((x, key) => ({
                  id: key,
                  src: x.preview,
                  ...x,
                }))}
                carousel
                showDelete
                onClick={(x) => formRemoveImage('trashForm', x)}
              />
            }

            {isFetching
              ? <Loading type="circular" />
              : <form onSubmit={handleSubmit((values) => updateTrash(values))}>
                <div className="row">
                  <div className="col s12">
                    <Field
                      name="images"
                      type="file"
                      files={files}
                      component={Input}
                      label={msg('global.images')}
                      accept="image/*"
                      multiple={Boolean(true)}
                      description={msg('global.images')}
                    />
                  </div>
                  <div className="col s12">
                    <Field
                      name="status"
                      type="radioList"
                      component={Input}
                      label={msg('global.status')}
                      items={_.filter(trashStatuses, (x) => x.id !== 'reported')}
                      inRow={Boolean(true)}
                    />
                  </div>
                  {status === trashStatuses.cleaned.id &&
                    <div className="col s12">
                      <Field
                        name="cleanedByMe"
                        type="checkboxList"
                        component={Input}
                        label={msg('trash.cleanedByMe')}
                        items={cleanedByMe}
                        inRow={Boolean(true)}
                      />
                    </div>
                  }
                  <div className="col s12">
                    <Field
                      name="types"
                      type="checkboxList"
                      component={Input}
                      label={msg('trash.trashType')}
                      items={trashTypes}
                      inRow={Boolean(true)}
                    />
                  </div>
                  <div className="col s12">
                    <Field
                      name="trashSize"
                      type="radioList"
                      component={Input}
                      label={msg('trash.trashSize')}
                      items={trashSizes}
                      inRow={Boolean(true)}
                    />
                  </div>
                  <div className="col s12">
                    <Field
                      name="note"
                      type="text"
                      component={Input}
                      label={msg('trash.note')}
                      hint={msg('trash.note')}
                      multiLine={Boolean(true)}
                    />
                  </div>
                  <div className="col s12">
                    <Field
                      name="accessibility"
                      type="checkboxList"
                      component={Input}
                      label={msg('trash.accessibility')}
                      items={trashAccessibility}
                      inRow={Boolean(true)}
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
                      disabled={submitting}
                      label={msg('global.cancel')}
                      style={styles.button}
                      onClick={() =>
                        push(routesList.trashDetail.replace(':id', item.id))
                      }
                    />
                    <RaisedButton
                      type="submit"
                      disabled={apiRunningQueries || submitting}
                      label={msg('global.update')}
                      style={styles.button}
                      primary={Boolean(true)}
                    />
                  </div>
                </div>
              </form>
            }
          </Paper>
        </div>
      </div>
    );
  }
}

const styles = {
  imagePreview: {
    width: '100%',
  },
  preview: {
    flexBasis: '25%',
    padding: '1%',
    marginRight: '2%',
  },
  previewContainer: {
    width: '100%',
    float: 'left',
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  removeButton: {
    color: 'red',
    float: 'right',
    marginBottom: '1%',
  },
  paper: {
    padding: '3%',
  },
  button: {
    marginLeft: '12px',
    fontSize: '0.8em',
  },
};

