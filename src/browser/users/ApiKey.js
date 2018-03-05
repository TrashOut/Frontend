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
import CircularProgress from 'material-ui/CircularProgress';
import CopyToClipboard from 'react-copy-to-clipboard';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import TextField from 'material-ui/TextField';
import translate from '../../messages/translate';
import { connect } from 'react-redux';
import { generateApiKey, fetchApiKey } from '../../common/users/actions';
import { push } from 'react-router-redux';
import { submit } from 'redux-form';

@translate
@connect(state => ({
  apiKey: state.users.apiKey.toJS(),
}), { fetchApiKey, generateApiKey, push, submit })
export default class ApiKey extends Component {
  static propTypes = {
    apiKey: React.PropTypes.object,
    generateApiKey: React.PropTypes.func,
    item: React.PropTypes.object,
    items: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired,
    submit: React.PropTypes.func,
    fetchApiKey: React.PropTypes.func,
    redirectToWidget: React.PropTypes.bool,
  };

  componentWillMount() {
    this.props.fetchApiKey();
  }

  onClick(regenerate) {
    const { generateApiKey } = this.props;
    generateApiKey(regenerate);
  }

  renderBody() {
    const { msg, apiKey } = this.props;

    return (
      <div>
        <p>{msg('user.apiKey.description')}</p>
        {apiKey.apiKey ?
          <div style={{ width: '100%' }}>
            <TextField
              disabled={Boolean(true)}
              defaultValue={apiKey.apiKey}
              floatingLabelText={msg('user.apiKey.yourKey')}
              style={{ width: '50%' }}
            />
            <CopyToClipboard text={apiKey.apiKey}>
              <RaisedButton
                label={msg('user.apiKey.copy')}
                style={styles.copyButton}
              />
            </CopyToClipboard>
            <RaisedButton
              fullWidth={Boolean(true)}
              label={msg('user.apiKey.regenerate')}
              onClick={() => this.onClick(true)}
              style={styles.regenerateButton}
            />
          </div>
        :
          <RaisedButton
            fullWidth={Boolean(true)}
            label={msg('user.apiKey.generate')}
            onClick={() => this.onClick(false)}
          />
        }
      </div>
    );
  }

  render() {
    const { msg, push, apiKey, redirectToWidget } = this.props;

    const buttons = [
      redirectToWidget
        ? <FlatButton type="button" label={msg('global.continue')} onClick={() => push(routesList.generateWidget)} />
        : <FlatButton type="button" label={msg('global.close')} onClick={() => push('../')} />,
    ];

    return (
      <Dialog
        title={msg('user.generateApiKey')}
        actions={buttons}
        open
        actionsContainerStyle={{ borderTop: '0' }}
        titleStyle={{ borderBottom: '0' }}
      >
        {apiKey.isFetching
          ?
            <CircularProgress
              size={80}
              thickness={5}
              styles={styles.loader}
            />
          : this.renderBody()
        }
      </Dialog>
    );
  }
}

const styles = {
  loader: {
    width: '100%',
    textAlign: 'center',
    margin: '20px',
  },
  copyButton: {
    width: '48%',
    marginLeft: '2%',
  },
  regenerateButton: {
    marginTop: '25px',
  },
};
