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
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import TextField from 'material-ui/TextField';
import translate from '../../messages/translate';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { fetchApiKey } from '../../common/users/actions';
import { FirstForm, SecondForm, ThirdForm } from './widget';
import { push } from 'react-router-redux';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import { reset, submit } from 'redux-form';

@translate
@connect(state => ({
  apiKey: state.users.apiKey.toJS(),
}), { fetchApiKey, push, submit, reset })
export default class WidgetGenerator extends Component {
  static propTypes = {
    apiKey: React.PropTypes.object,
    fetchApiKey: React.PropTypes.func,
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired,
    reset: React.PropTypes.func,
    submit: React.PropTypes.func,
  };

  state = {
    page: 1,
  };

  componentWillMount() {
    this.props.fetchApiKey();
  }

  resetForm() {
    const { reset } = this.props;
    reset('widget');
  }

  @autobind
  nextPage() {
    this.setState({ page: this.state.page + 1 });
  }

  @autobind
  previousPage() {
    this.setState({ page: this.state.page - 1 });
  }

  renderApiKey() {
    const { apiKey, msg, push } = this.props;
    const { page } = this.state;

    if (page > 1) return null;

    if (!apiKey.apiKey) {
      return (<div>
        <p>
          {msg('user.apiKey.notFound')}
        </p>
        <RaisedButton
          type="button"
          label={msg('user.apiKey.generate')}
          onClick={() => push(routesList.generateApiKeyForWidget)}
          fullWidth
          primary
        />
      </div>);
    }
    return (
      <div>
        <p>{msg('user.apiKey')}</p>
        <TextField
          disabled
          defaultValue={apiKey.apiKey}
          floatingLabelText={msg('user.apiKey.yourKey')}
          fullWidth
        />
      </div>
    );
  }

  renderBody() {
    const { msg, push } = this.props;
    const { page } = this.state;

    return (
      <div>
        <Stepper activeStep={page - 1}>
          <Step>
            <StepLabel>{msg('user.widget.firstStep')}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{msg('user.widget.secondStep')}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{msg('user.widget.thirdStep')}</StepLabel>
          </Step>
        </Stepper>
        <div>
          {this.renderApiKey()}
          {page === 1 && <FirstForm onSubmit={this.nextPage} />}
          {page === 2 && <SecondForm onSubmit={this.nextPage} />}
          {page === 3 && <ThirdForm onSubmit={() => { this.resetForm(); push('../'); }} />}
        </div>
      </div>
    );
  }

  render() {
    const { apiKey, msg, push, submit } = this.props;
    const { page } = this.state;

    const buttons = [
      (page === 1) && <FlatButton type="button" label={msg('global.cancel')} onClick={() => push('../')} />,
      (page === 1) && <FlatButton type="button" disabled={Boolean(!apiKey.apiKey)} label={msg('global.nextStep')} onClick={() => submit('widget')} />,

      (page === 2) && <FlatButton type="button" label={msg('global.back')} onClick={() => { this.resetForm(); this.previousPage(); }} />,
      (page === 2) && <FlatButton type="button" label={msg('global.nextStep')} onClick={() => submit('widget')} />,

      (page === 3) && <FlatButton type="button" label={msg('global.back')} onClick={this.previousPage} />,
      (page === 3) && <FlatButton type="button" label={msg('global.close')} onClick={() => submit('widget')} />,
    ];

    return (
      <Dialog
        title={msg('user.generateWidget')}
        actions={buttons}
        contentStyle={{
          width: '80%',
          maxWidth: 'none',
        }}
        open
        autoScrollBodyContent
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
};

