/**
 * TRASHOUT IS an environmental project that teaches people how to recycle
 * and showcases the worst way of handling waste - illegal dumping. All you need is a smart phone.
 *
 * FOR PROGRAMMERS: There are 10 types of programmers -
 * those who are helping TrashOut and those who are not. Clean up our code,
 * so we can clean up our planet. Get in touch with us: help@trashout.ngo
 *
 * Copyright 2020 TrashOut, n.f.
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
import { assignOrganizationArea as assignArea } from '../../common/organizations/actions';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { notifications } from '../../common/consts';
import { push } from 'react-router-redux';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import { submit } from 'redux-form';
import { TrashFilter } from '../areas/form/Form';

@translate
@connect(state => ({
  items: state.areas.formOptions,
}), { assignArea, push, submit })
export default class Invite extends Component {
  static propTypes = {
    item: React.PropTypes.object,
    items: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired,
    submit: React.PropTypes.func,
    assignArea: React.PropTypes.func.isRequired,
    id: React.PropTypes.number.isRequired,
  };

  state = {
    finished: false,
    stepIndex: 0,
  };

  @autobind
  onSubmit(values) {
    const { assignArea, items, id } = this.props;

    const array = Object.keys(values);

    for (let i = array.length - 1; i >= 0; i -= 1) {
      const index = array[i];
      if (index === 'notification') { continue; } // eslint-disable-line no-continue

      if (values[index] !== 'all' && values[index] !== '') {
        const result = items.get(index).filter(x => x.label === values[index]);
        if (result.length > 0) {
          assignArea(
            id,
            result[0].pathId,
            notifications[Object.keys(notifications)[values.notification]].frequency
          );
          return;
        }
      }
    }
    return;
  }

  handleNext() {
    const { stepIndex } = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
  }

  handlePrev() {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  }

  render() {
    const { msg, push, submit } = this.props;
    const { stepIndex } = this.state;

    const buttons = [
      (stepIndex === 0) && <FlatButton type="button" label={msg('global.cancel')} onClick={() => push('./')} />,
      (stepIndex === 0) && <FlatButton type="button" label={msg('global.nextStep')} onClick={() => this.handleNext()} />,
      (stepIndex === 1) && <FlatButton type="button" label={msg('global.back')} onClick={() => this.handlePrev()} />,
      (stepIndex === 1) && <FlatButton type="submit" label={msg('global.addArea')} onClick={() => submit('filter')} />,
    ];

    return (
      <Dialog
        title={msg('global.addArea')}
        actions={buttons}
        open={Boolean(true)}
        autoScrollBodyContent
        actionsContainerStyle={{ borderTop: '0' }}
        titleStyle={{ borderBottom: '0' }}
      >
        <p>{msg('global.geo.description')}</p>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>{msg('geo.selectArea.header')}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{msg('global.geo.notificationFrequency')}</StepLabel>
          </Step>
        </Stepper>
        {(stepIndex === 0) ?
          <TrashFilter
            onSubmit={this.onSubmit}
          />
          :
          <NotificationForm
            onSubmit={this.onSubmit}
          />
        }
      </Dialog>
    );
  }
}
