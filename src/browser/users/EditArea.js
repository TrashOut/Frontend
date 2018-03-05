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
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import NotificationForm from './NotificationForm';
import React, { PureComponent as Component } from 'react';
import translate from '../../messages/translate';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { notifications } from '../../common/consts';
import { push } from 'react-router-redux';
import { submit } from 'redux-form';
import { updateUserArea } from '../../common/areas/actions';

@translate
@connect(state => ({
  areas: state.users.viewer.userHasArea,
}), { updateUserArea, push, submit })
export default class Invite extends Component {
  static propTypes = {
    areas: React.PropTypes.array,
    match: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired,
    submit: React.PropTypes.func,
    updateUserArea: React.PropTypes.func.isRequired,
  };

  @autobind
  onSubmit(values) {
    const { areas, updateUserArea, match: { params: { id } } } = this.props;

    const area = areas.filter(x => x.areaId === id)[0];
    updateUserArea(
      id,
      notifications[Object.keys(notifications)[values.notification]].frequency,
      area.userAreaRoleId
    );
  }

  render() {
    const { areas, msg, push, submit, match } = this.props;

    const id = match.params.id;
    const area = areas.filter(x => x.areaId === id);

    const buttons = [
      <FlatButton type="button" label={msg('global.cancel')} onClick={() => push('../')} />,
      <FlatButton type="submit" label={msg('user.editArea')} onClick={() => submit('filter')} />,
    ];

    return (
      <Dialog
        title={msg('user.editArea')}
        actions={buttons}
        open={Boolean(true)}
        autoScrollBodyContent
        actionsContainerStyle={{ borderTop: '0' }}
        titleStyle={{ borderBottom: '0' }}
      >
        {area &&
          <NotificationForm
            onSubmit={this.onSubmit}
            area={area[0]}
          />
        }
      </Dialog>
    );
  }
}
