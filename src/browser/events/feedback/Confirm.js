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
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Input from '../../app/components/Input';
import React, { PureComponent as Component } from 'react';
import routesList from '../../routesList';
import translate from '../../../messages/translate';
import { autobind } from 'core-decorators';
import { confirmJoinEvent } from '../../../common/events/actions';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { push } from 'react-router-redux';

@translate
@connect(state => {
  const viewer = state.users.viewer;
  const eventUser = _.head(state.events.item.users.filter(x => x.userId === viewer.id));
  return {
    initialValues: {
      confirm: eventUser && eventUser.confirmed,
    },
    event: state.events.item,
  };
}, { confirmJoinEvent, push })
@reduxForm({
  form: 'eventConfirm',
  validate: (value) => value.confirm || { confirm: 'event.needConfirm' },
})
export default class ConfirmEvent extends Component {
  static propTypes = {
    confirmJoinEvent: React.PropTypes.func,
    event: React.PropTypes.func,
    handleSubmit: React.PropTypes.func,
    item: React.PropTypes.object,
    items: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func,
    setRoot: React.PropTypes.func,
    submit: React.PropTypes.func,
  };

  @autobind
  onSubmit() {
    const { event, confirmJoinEvent } = this.props;
    confirmJoinEvent(event.id);
  }

  render() {
    const { event, handleSubmit, msg, push } = this.props;

    const buttons = [
      <FlatButton type="button" label={msg('global.cancel')} onClick={() => push(routesList.eventDetail.replace(':id', event.id))} />,
      <FlatButton type="submit" primary={Boolean(true)} label={msg('event.userConfirm.send')} onClick={handleSubmit(this.onSubmit)} />,
    ];

    return (
      <Dialog
        title={msg('event.userConfirm.header')}
        actions={buttons}
        open={Boolean(true)}
        autoScrollBodyContent
      >
        <form>
          <Field
            name="confirm"
            type="checkbox"
            label={msg('event.userConfirm')}
            component={Input}
          />
        </form>
      </Dialog>
    );
  }
}
