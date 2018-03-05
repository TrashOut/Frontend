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
import './style.css';
import _ from 'lodash';
import AppBar from 'material-ui/AppBar';
import Colors from '../../common/app/colors';
import Input from '../app/components/Input';
import Paper from 'material-ui/Paper';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import React, { PureComponent as Component } from 'react';
import translate from '../../messages/translate';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { TrashFilter } from '../areas/form/Form';
import { updateNeeded, trashSizes, trashTypes, trashStatuses, spams, unreviewed, trashAccessibility } from '../../common/trashmanagement/consts';
import { validateFilter as validate } from '../../common/trashmanagement/validate';

@connect(state => ({
  initialValues: state.table.filter.toJS(),
  showFilter: state.table.showFilter,
  selectedTab: state.trashes.selectedTab,
}), null)
@reduxForm({
  form: 'filter',
  validate,
})
@translate
@Radium
export default class Filter extends Component {
  static propTypes = {
    destroy: React.PropTypes.func,
    handleSubmit: React.PropTypes.any,
    msg: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func,
    selectedTab: React.PropTypes.string,
    showFilter: React.PropTypes.bool,
    submit: React.PropTypes.func,
    submitting: React.PropTypes.bool,
  }

  @autobind
  clearAndClose() {
    const { destroy, onSubmit } = this.props;

    destroy();
    setTimeout(() => onSubmit({}), 10);
  }

  render() {
    const { selectedTab, handleSubmit, submitting, showFilter, msg } = this.props;
    return (
      <div style={[!showFilter && { display: 'none' }].filter(style => style)}>
        <AppBar
          showMenuIconButton={false}
          title={<span style={styles.header}>
            {msg('trash.filter.header')}
          </span>}
        />
        <Paper style={styles.wrapper} >
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col s12 m4 l4">
                <Field
                  name="updateNeeded"
                  type="select"
                  component={Input}
                  items={updateNeeded}
                  label={msg('trash.updateNeeded')}
                  selectPlaceholder="global.select"
                />
                <Field
                  name="trashStatus"
                  type="checkboxList"
                  component={Input}
                  label={msg('trash.status')}
                  items={_.filter(trashStatuses, (x) => x.id !== 'reported')}
                  inRow={false}
                />
                <Field
                  name="trashAccessibility"
                  type="checkboxList"
                  component={Input}
                  label={msg('trash.accessibility')}
                  items={trashAccessibility}
                  inRow={Boolean(false)}
                />
              </div>
              <div className="col s12 m8 l8">
                <div className="dates-container">
                  <Field
                    name="timeBoundaryFrom"
                    type="date"
                    component={Input}
                    value={new Date()}
                    label={msg('trash.filter.anyActivityDateFrom')}
                    hint={msg('trash.filter.anyActivityDateFrom')}
                  />
                  <Field
                    name="timeBoundaryTo"
                    type="date"
                    component={Input}
                    value={new Date()}
                    label={msg('trash.filter.anyActivityDateTo')}
                    hint={msg('trash.filter.anyActivityDateTo')}
                  />
                </div>
                <Field
                  name="trashSize"
                  type="checkboxList"
                  component={Input}
                  label={msg('trash.trashSize')}
                  items={trashSizes}
                  inRow={Boolean(true)}
                />
                <Field
                  name="trashType"
                  type="checkboxList"
                  component={Input}
                  label={msg('trash.trashType')}
                  items={trashTypes}
                  inRow={Boolean(true)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col s12">
                {selectedTab === 'table' && <TrashFilter description={msg('trash.filter.area.hint')} />}
              </div>
            </div>
            <div className="row">
              <div className="col s12 m4">
                <Field
                  name="userIds"
                  type="text"
                  component={Input}
                  label={msg('trash.filter.userIds')}
                  hint={msg('trash.filter.userIds')}
                />
              </div>
              <div className="col s12 m4">
                <Field
                  name="trashNote"
                  type="text"
                  component={Input}
                  label={msg('trash.note')}
                  hint={msg('trash.note')}
                />
              </div>
              <div className="col s12 m4">
                <Field
                  name="trashIds"
                  type="text"
                  component={Input}
                  label={msg('trash.filter.ids')}
                  hint={msg('trash.filter.ids')}
                />
              </div>
            </div>
            <div className="row">
              <div className="col s6">
                <Field
                  name="spam"
                  type="select"
                  component={Input}
                  items={spams}
                  label={msg('global.markedAsSpam')}
                  selectPlaceholder="global.select"
                />
              </div>
              <div className="col s6">
                <Field
                  name="unreviewed"
                  type="select"
                  component={Input}
                  items={unreviewed}
                  label={msg('global.reviewed')}
                  selectPlaceholder="global.select"
                />
              </div>
            </div>
            <div className="row">
              <div className="right-align">
                <RaisedButton
                  type="button"
                  disabled={submitting}
                  onClick={this.clearAndClose}
                  label={msg('global.cancelFilter')}
                  style={styles.button}
                />
                <RaisedButton
                  type="submit"
                  disabled={submitting}
                  label={msg('global.submitFilter')}
                  style={styles.button}
                  primary={Boolean(true)}
                />
              </div>
            </div>
          </form>
        </Paper>
      </div>
    );
  }
}

const styles = {
  wrapper: {
    marginBottom: '20px',
    padding: '3%',
    zIndex: '0',
    display: 'block',
  },
  button: {
    marginLeft: '12px',
  },
  header: {
    fontSize: '0.8em',
    fontWeight: '200',
  },
  appBar: {
    backgroundColor: Colors.secondary,
  },
};
