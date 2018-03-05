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
import RaisedButton from 'material-ui/RaisedButton';
import React, { PureComponent as Component } from 'react';
import translate from '../../messages/translate';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { UserAreaFilter } from '../areas/form/Form';
import { autobind } from 'core-decorators';

export const reviewed = [
  { id: 'true', message: 'global.reviewed.true' },
  { id: 'false', message: 'global.reviewed.false' },
];

@translate
@connect(
  state => ({
    showFilter: state.table.get('showFilter'),
  }), null
)
@reduxForm({
  form: 'filter',
})
export default class Filter extends Component {
  static propTypes = {
    changeFieldValue: React.PropTypes.func,
    destroy: React.PropTypes.func,
    handleSubmit: React.PropTypes.any,
    msg: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func,
    reset: React.PropTypes.func,
    showFilter: React.PropTypes.bool,
    submitting: React.PropTypes.bool,
  }

  @autobind
  clearAndClose() {
    const { destroy, onSubmit } = this.props;

    destroy();
    setTimeout(() => onSubmit({}), 10);
  }

  render() {
    const { msg, handleSubmit, submitting, showFilter } = this.props;
    if (!showFilter) return null;

    return (
      <div>
        <AppBar
          showMenuIconButton={false}
          title={<span style={styles.header}>
            {msg('user.filter.header')}
          </span>}
          style={styles.appBar}
        />
        <Paper style={styles.wrapper} >
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col s12 m6">
                <Field
                  name="userIds"
                  type="text"
                  component={Input}
                  label={msg('user.filter.userIds')}
                  hint={msg('user.filter.userIds')}
                />
                <Field
                  name="minPoints"
                  type="number"
                  component={Input}
                  label={msg('user.filter.minPoints')}
                  hint={msg('user.filter.minPoints')}
                />
                <Field
                  name="maxPoints"
                  type="number"
                  component={Input}
                  label={msg('user.filter.maxPoints')}
                  hint={msg('user.filter.maxPoints')}
                />
              </div>

              <div className="col s12 m6">
                <Field
                  name="emails"
                  type="text"
                  component={Input}
                  label={msg('user.filter.emails')}
                  hint={msg('user.filter.emails')}
                />
                <Field
                  name="organizationIds"
                  type="text"
                  component={Input}
                  label={msg('user.filter.organizationIds')}
                  hint={msg('user.filter.organizationIds')}
                />
                <Field
                  name="reviewed"
                  type="select"
                  component={Input}
                  items={reviewed}
                  label={msg('global.reviewed')}
                  selectPlaceholder="global.select"
                />
              </div>

              <div className="col s12">
                <UserAreaFilter />
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
