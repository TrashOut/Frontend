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
import Form from '../form/AddManagerForm';
import React, { PureComponent as Component } from 'react';
import translate from '../../../messages/translate';
import { assignManagers, fetchArea } from '../../../common/areas/actions';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { fetchAreaUsers } from '../../../common/users/actions';
import { push } from 'react-router-redux';
import { submit } from 'redux-form';

@translate
@connect(state => ({
  item: state.areas.item,
}), { fetchArea, fetchAreaUsers, push, submit, assignManagers })
export default class AddManager extends Component {
  static propTypes = {
    assignManagers: React.PropTypes.func,
    item: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    submit: React.PropTypes.func,
    fetchAreaUsers: React.PropTypes.func,
    fetchArea: React.PropTypes.func,
    match: React.PropTypes.object,
    push: React.PropTypes.func,
  };

  @autobind
  onSubmit(values) {
    const { fetchAreaUsers, fetchArea, assignManagers, item, match: { params: { id } } } = this.props;
    if (values.managers) {
      const userIds = item.users.map(x => `${x.id}`);
      assignManagers(Object.keys(values.managers), userIds, id, '2', '0', async () => {
        await fetchArea(id);
        await fetchAreaUsers(id, 2);
        await fetchAreaUsers(id, 3);
      }, 'add');
    }
  }

  render() {
    const { push, msg, submit } = this.props;

    const buttons = [
      <FlatButton type="button" label={msg('global.cancel')} onClick={() => push('../')} />,
      <FlatButton type="button" label={msg('geo.addManager')} onClick={() => submit('areaAddManager')} />,
    ];

    return (
      <Dialog
        title={msg('geo.addManager')}
        actions={buttons}
        open
        autoScrollBodyContent
        actionsContainerStyle={styles.dialog.actionContainer}
        titleStyle={styles.dialog.title}
      >
        <Form onSubmit={this.onSubmit} />
      </Dialog>
    );
  }
}

const styles = {
  dialog: {
    actionContainer: {
      borderTop: '0',
    },
    title: {
      borderBottom: '0',
    },
  },
};
