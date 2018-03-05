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
import AddManagerForm from './form/AddManagerForm';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import React, { PureComponent as Component } from 'react';
import translate from '../../messages/translate';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { joinOrganization } from '../../common/organizations/actions';
import { push } from 'react-router-redux';
import { submit } from 'redux-form';

@translate
@connect(state => ({
  item: state.organizations.item,
}), { push, joinOrganization, submit })
export default class Managers extends Component {
  static propTypes = {
    item: React.PropTypes.object,
    joinOrganization: React.PropTypes.func.isRequired,
    msg: React.PropTypes.func.isRequired,
    params: React.PropTypes.object,
    push: React.PropTypes.func.isRequired,
    submit: React.PropTypes.func.isRequired,
  };

  @autobind
  onSubmit(values) {
    const { item, joinOrganization } = this.props;
    const managers = Object.keys(values.managers || {});
    joinOrganization(item.id, managers);
  }

  render() {
    const { push, msg, submit } = this.props;

    const buttons = [
      <FlatButton type="button" label={msg('global.cancel')} onClick={() => push('../')} />,
      <FlatButton type="submit" label={msg('organization.addManager')} onClick={() => submit('organizationManagers')} />,
    ];

    return (
      <Dialog
        title={msg('organization.addManager')}
        actions={buttons}
        open={Boolean(true)}
        onRequestClose={this.handleClose}
        autoScrollBodyContent
        actionsContainerStyle={{ borderTop: '0' }}
        titleStyle={{ borderBottom: '0' }}
      >
        <AddManagerForm
          onSubmit={this.onSubmit}
        />
      </Dialog>
    );
  }
}
