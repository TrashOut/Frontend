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
import { eventsUpcomingOrOld } from '../../common/events/consts';
import { Field, reduxForm, change } from 'redux-form';
import { TrashFilter as EventAreaFilter } from '../areas/form/Form';

@connect(state => ({
  showFilter: state.table.get('showFilter'),
  initialValues: state.table.filter.toJS(),
  selectedTab: state.events.selectedTab,
}), { change })
@reduxForm({
  form: 'filter',
})
@translate
@Radium
export default class Filter extends Component {
  static propTypes = {
    change: React.PropTypes.func,
    destroy: React.PropTypes.func,
    handleSubmit: React.PropTypes.any,
    msg: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func,
    selectedTab: React.PropTypes.string,
    showFilter: React.PropTypes.bool,
    submitting: React.PropTypes.bool,
  }

  @autobind
  changeTimeBoundary(v) {
    const { change } = this.props;
    const { 0: value } = v;

    const timeFrom = (value === '0') ? new Date() : null;
    const timeTo = (value === '0') ? null : new Date();

    change('startFrom', timeFrom);
    change('startTo', timeTo);
  }

  @autobind
  clearAndClose() {
    const { destroy, onSubmit } = this.props;

    destroy();
    setTimeout(() => onSubmit({}), 10);
  }

  render() {
    const {
      handleSubmit,
      submitting,
      showFilter,
      msg,
      selectedTab,
    } = this.props;

    return (
      <div style={[!showFilter && { display: 'none' }].filter(style => style)}>
        <AppBar
          showMenuIconButton={false}
          title={
            <span style={styles.header}>
              {msg('event.filter.header')}
            </span>}
          style={styles.appBar}
        />
        <Paper style={styles.wrapper} >
          <form onSubmit={handleSubmit}>
            <div className="row">

              <div className="col s12">
                <Field
                  name="show"
                  type="radioList"
                  component={Input}
                  items={eventsUpcomingOrOld}
                  label={msg('event.filter.upcomingOrOld')}
                  onChange={this.changeTimeBoundary}
                  inRow={Boolean(true)}
                />
              </div>

              <div className="col s12 m6">
                <Field
                  name="startFrom"
                  type="date"
                  component={Input}
                  value={new Date()}
                  label={msg('event.filter.startTimeFrom')}
                  hint={msg('event.filter.startTimeFrom')}
                />
              </div>
              <div className="col s12 m6">
                <Field
                  name="startTo"
                  type="date"
                  component={Input}
                  value={new Date()}
                  label={msg('event.filter.startTimeTo')}
                  hint={msg('event.filter.startTimeTo')}
                />
              </div>

              {selectedTab === 'table' &&
                <div className="col s12">
                  <EventAreaFilter />
                </div>
              }

              <div className="col s12 m6">
                <Field
                  name="eventDescription"
                  type="text"
                  component={Input}
                  label={msg('event.description')}
                  hint={msg('event.description')}
                />
              </div>
              <div className="col s12 m6">
                <Field
                  name="eventIds"
                  type="text"
                  component={Input}
                  label={msg('event.filter.ids')}
                  hint={msg('event.filter.ids')}
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
                  labelColor="white"
                  backgroundColor={Colors.primary}
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
