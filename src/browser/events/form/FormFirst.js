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
import { childFriendly } from '../../../common/events/consts';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { validateCreate } from '../../../common/events/validate';
import { push } from 'react-router-redux';

@translate
@reduxForm({
  form: 'eventCreate',
  validate: validateCreate,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})
@connect(null, { push })
export default class Form extends Component {
  static propTypes = {
    handleSubmit: React.PropTypes.func,
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func,
    submitting: React.PropTypes.bool,
  };

  render() {
    const {
      handleSubmit,
      msg,
      push,
      submitting,
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <h3>{msg('event.about')}</h3>
          <div className="col s12">
            <Field
              name="name"
              component={Input}
              label={msg('event.name')}
              hint={msg('event.name')}
            />
          </div>
          <div className="col s12 m3">
            <Field
              name="start[date]"
              type="date"
              component={Input}
              label={msg('event.startDate')}
              hint={msg('event.startDate')}
              minDate={new Date()}
            />
          </div>
          <div className="col s12 m3">
            <Field
              name="start[time]"
              type="time"
              component={Input}
              label={msg('event.startTime')}
              hint={msg('event.startTime')}
            />
          </div>
          <div className="col s12 m3">
            <Field
              name="end[date]"
              type="date"
              component={Input}
              label={msg('event.endDate')}
              hint={msg('event.endDate')}
              minDate={new Date()}
            />
          </div>
          <div className="col s12 m3">
            <Field
              name="end[time]"
              type="time"
              component={Input}
              label={msg('event.endTime')}
              hint={msg('event.endTime')}
            />
          </div>
        </div>
        <div className="row">
          <h3>{msg('event.edit.otherInformation')}</h3>
          <div className="col s12 m4">
            <Field
              name="have"
              component={Input}
              label={msg('event.whatWeHave')}
              hint={msg('event.whatWeHave.hint')}
            />
          </div>
          <div className="col s12 m4">
            <Field
              name="bring"
              component={Input}
              label={msg('event.whatBring')}
              hint={msg('event.wahtBring.hint')}
            />
          </div>
          <div className="col s12 m4">
            <Field
              name="childFriendly"
              type="select"
              component={Input}
              label={msg('event.childFriendly')}
              hint={msg('event.childFriendly')}
              items={childFriendly}
              selectPlaceholder="global.select"
            />
          </div>
          <div className="col s12">
            <Field
              name="description"
              component={Input}
              label={msg('global.note')}
              hint={msg('global.note')}
              multiLine={Boolean(true)}
              rows={2}
            />
          </div>
        </div>
        <div className="row">
          <h3>{msg('event.detail.organizer')}</h3>
          <div className="row">
            <div className="col s12 m6">
              <Field
                name="contact[name]"
                component={Input}
                label={msg('event.detail.organizer.name')}
                hint={msg('event.detail.organizer.name')}
              />
            </div>
            <div className="col s12 m6">
              <Field
                name="contact[occupation]"
                component={Input}
                label={msg('event.detail.organizer.function')}
                hint={msg('event.detail.organizer.function')}
              />
            </div>
          </div>
          <div className="row">
            <div className="col s12 m6">
              <Field
                name="contact[email]"
                component={Input}
                label={msg('global.email')}
                hint={msg('global.email')}
              />
            </div>
            <div className="col s12 m6">
              <Field
                name="contact[phone]"
                component={Input}
                type="phone"
                label={msg('global.phone')}
                hint={msg('global.phone')}
              />
            </div>
          </div>
        </div>

        <div className="row col s12">
          <div className="right-align">
            <RaisedButton
              type="button"
              disabled={submitting}
              label={msg('global.cancel')}
              style={styles.button}
              onClick={() => push(routesList.eventList)}
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
};
