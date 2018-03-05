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
import Clear from 'material-ui/svg-icons/content/clear';
import Colors from '../../../common/app/colors';
import Radium from 'radium';
import React, { PureComponent as Component } from 'react';
import translate from '../../../messages/translate';
import { closeMessage } from '../../../common/messages/actions';
import { connect } from 'react-redux';

@translate
@connect(state => ({
  messages: state.messages.list.toJS(),
}), { closeMessage })
@Radium
export default class AlertMessage extends Component {
  static propTypes = {
    closeMessage: React.PropTypes.func,
    messages: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    noContent: React.PropTypes.bool,
    signedout: React.PropTypes.bool,
  };

  render() {
    const { noContent, messages, closeMessage, msg, signedout } = this.props;

    const messagesToPage = Object.keys(messages).map((property, key) => {
      const message = messages[property];
      return (
        <div
          key={key}
          style={{
            ...style.alert,
            background: (message.type === 'success') ? Colors.primary : Colors.orange,
          }}
        >
          {msg(message.message.id)}
          <Clear style={style.alert.close} onClick={() => closeMessage(property)} />
        </div>);
    });

    return (<div>
      <div
        style={[
          (signedout && style.signedout) || style,
          noContent && style.appBarNoContent,
        ].filter(exists => exists)}
      >
        {messagesToPage}
      </div>
      <div style={{ height: `${Object.keys(messages).length * 50}px` }} />
    </div>);
  }
}

const style = {
  width: '96%',
  marginLeft: '2%',
  marginTop: '130px',
  position: 'absolute',
  zIndex: 1,
  signedout: {
    position: 'relative',
  },
  appBarNoContent: {
    marginTop: '90px',
  },
  alert: {
    color: 'white',
    padding: '10px',
    width: 'calc(100%-60px)',
    marginBottom: '5px',
    marginTop: '5px',
    borderRadius: '3px',
    boxShadow: '0px 1px 3px #AAAAAA',
    close: {
      float: 'right',
      cursor: 'pointer',
      ':hover': {
        cursor: 'pointer',
      },
    },
  },
};
