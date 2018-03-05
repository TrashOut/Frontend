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
import confirmMessages from '../../../common/app/confirmMessages';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import React, { PureComponent as Component } from 'react';
import translate from '../../../messages/translate';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { hideConfirm } from '../../../common/confirms/actions';

@translate
@connect(state => ({
  callbacks: state.confirms.data,
  opened: state.confirms.opened,
  current: state.confirms.current,
}), { hideConfirm })
export default class Confirm extends Component {
  static propTypes = {
    callbacks: React.PropTypes.object,
    cancelLabel: React.PropTypes.string,
    hideConfirm: React.PropTypes.func,
    msg: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
    open: React.PropTypes.bool,
    opened: React.PropTypes.number,
    submitLabel: React.PropTypes.string,
    title: React.PropTypes.string,
    type: React.PropTypes.string,
    current: React.PropTypes.string,
  };

  @autobind
  onCancel() {
    const { current, hideConfirm } = this.props;
    hideConfirm(current);
  }

  @autobind
  onSubmit() {
    const { current, callbacks, hideConfirm, onSubmit } = this.props;
    const fn = callbacks.get(current).onSubmit;
    hideConfirm(current);
    if (fn) fn();
    if (onSubmit) onSubmit();
  }

  render() {
    const { current, opened, title, msg, cancelLabel, submitLabel } = this.props;
    if (opened === 0 && !current) return null;

    const message = confirmMessages[current] && confirmMessages[current].message;
    const actions = [
      <RaisedButton
        label={cancelLabel || msg('global.cancel')}
        onTouchTap={this.onCancel}
        style={style.button}
      />,
      <RaisedButton
        keyboardFocused={Boolean(true)}
        label={submitLabel || msg('global.confirm')}
        onTouchTap={this.onSubmit}
        primary={Boolean(true)}
        style={style.button}
      />,
    ];

    return (
      <div>
        <Dialog
          actions={actions}
          modal={false}
          onRequestClose={this.onCancel}
          open
          title={title || msg('global.confirm')}
          autoScrollBodyContent
          actionsContainerStyle={{ borderTop: '0' }}
          titleStyle={{ borderBottom: '0' }}
        >
          {msg(message || 'global.confirm')}
        </Dialog>
      </div>
    );
  }
}


const style = {
  button: {
    marginLeft: '12px',
  },
};
