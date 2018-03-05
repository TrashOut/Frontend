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
import Input from '../app/components/Input';
import React, { PureComponent as Component } from 'react';
import translate from '../../messages/translate';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';
import { push } from 'react-router-redux';
import { sendInvitations } from '../../common/organizations/actions';
import { validateInvitation } from '../../common/organizations/validate';

@translate
@connect(null, { change, push, sendInvitations })
@reduxForm({
  form: 'invitation',
  validate: validateInvitation,
})
export default class Invite extends Component {
  static propTypes = {
    change: React.PropTypes.func,
    handleSubmit: React.PropTypes.function,
    match: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    params: React.PropTypes.object,
    push: React.PropTypes.func.isRequired,
    sendInvitations: React.PropTypes.func,
  };

  @autobind
  send(values) {
    const { sendInvitations, match } = this.props;
    sendInvitations(match.params.id, values.text.replace(/[ \t]/g, '').replace(/[\n]/g, ',').split(','));
  }


  render() {
    const { change, push, msg, handleSubmit } = this.props;

    const buttons = [
      <FlatButton type="button" label={msg('global.cancel')} onClick={() => push('../')} />,
      <FlatButton type="submit" label={msg('organization.sendInvitations')} onClick={handleSubmit(this.send)} />,
    ];

    return (
      <Dialog
        title={msg('organization.sendInvitations')}
        actions={buttons}
        open
        onRequestClose={this.handleClose}
        actionsContainerStyle={{ borderTop: '0' }}
        titleStyle={{ borderBottom: '0' }}
        autoScrollBodyContent
      >
        <form onSubmit={handleSubmit(this.send)}>
          <p>{msg('organization.invitation.description')}</p>
          <Field
            accept="*/*,"
            afterSelectAccept={['text/csv', 'application/vnd.ms-excel', 'text/plain']}
            component={Input}
            label={msg('organization.invitation.selectFile')}
            multiple={Boolean(false)}
            name="file"
            type="file"
            description={msg('organization.invitation.selectFile')}
            onChange={(x) => x[0] && readFile(x[0], (list) => change('text', list.join('\n')))}
            style={{ height: '50px' }}
          />

          <div style={styles.or}>{msg('global.or')}</div>

          <Field
            type="text"
            component={Input}
            name="text"
            label={msg('organization.invitation.writeEmails')}
            hint={msg('organization.invitation.writeEmails.placeholder')}
            multiLine
          />


        </form>
      </Dialog>
    );
  }
}

const readFile = (file, onLoad) => {
  const reader = new FileReader();
  reader.onload = () => {
    const result = reader.result.split('\n').reduce((prev, cur) => {
      if (cur === '') return prev;
      prev.push(cur);
      return prev;
    }, []);
    onLoad(result);
  };
  reader.readAsText(file, 'utf-8');
};

const styles = {
  or: {
    width: '100%',
    textAlign: 'center',
    marginTop: '15px',
    marginBottom: '15px',
    float: 'left',
  },
};
