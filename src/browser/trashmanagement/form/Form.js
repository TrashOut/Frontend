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
import FormFirst from './FormFirst';
import FormSecond from './FormSecond';
import FormThird from './FormThird';
import Paper from 'material-ui/Paper';
import React, { PureComponent as Component } from 'react';
import SecondAppBar from '../../app/components/SecondAppBar';
import translate from '../../../messages/translate';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { createTrash } from '../../../common/trashmanagement/actions';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';

@translate
@connect(state => ({
  device: state.device.device,
}), { createTrash })
export default class Form extends Component {
  static propTypes = {
    createTrash: React.PropTypes.func,
    handleSubmit: React.PropTypes.func,
    msg: React.PropTypes.func.isRequired,
    device: React.PropTypes.string,
  };

  state = {
    page: 1,
  };

  @autobind
  nextPage() {
    this.setState({ page: this.state.page + 1 });
  }

  @autobind
  previousPage() {
    this.setState({ page: this.state.page - 1 });
  }

  render() {
    const { device, createTrash, msg } = this.props;
    const { page } = this.state;

    return (
      <div>
        <SecondAppBar
          title={msg('trash.create.title')}
        />
        <div className="main-content">
          <Stepper
            activeStep={page - 1}
            orientation={device === 'mobile' ? 'vertical' : 'horizontal'}
          >
            <Step>
              <StepLabel>{msg('trash.create.firstStep')}</StepLabel>
            </Step>
            <Step>
              <StepLabel>{msg('trash.create.secondStep')}</StepLabel>
            </Step>
            <Step>
              <StepLabel>{msg('trash.create.thirdStep')}</StepLabel>
            </Step>
          </Stepper>
          <Paper style={styles.paper}>
            {page === 1 && <FormFirst onSubmit={this.nextPage} />}
            {page === 2 && <FormSecond previousPage={this.previousPage} onSubmit={this.nextPage} />}
            {page === 3 && <FormThird previousPage={this.previousPage} onSubmit={createTrash} />}
          </Paper>
        </div>
      </div>
    );
  }
}

const styles = {
  paper: {
    padding: '3%',
  },
};
