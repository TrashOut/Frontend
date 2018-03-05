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
import FormFourth from './FormFourth';
import FormSecond from './FormSecond';
import FormThird from './FormThird';
import Paper from 'material-ui/Paper';
import React, { PureComponent as Component } from 'react';
import translate from '../../../messages/translate';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { initialize } from 'redux-form';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';

@connect(null, { initialize })
@translate
export default class Form extends Component {
  static propTypes = {
    data: React.PropTypes.object,
    handleSubmit: React.PropTypes.func,
    initialize: React.PropTypes.func,
    msg: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
  };

  state = {
    page: 1,
  };

  componentWillMount() {
    const { data, initialize } = this.props;
    initialize('organization', data || {});
  }

  @autobind
  nextPage() {
    this.setState({ page: this.state.page + 1 });
  }

  @autobind
  previousPage() {
    this.setState({ page: this.state.page - 1 });
  }

  render() {
    const { onSubmit, onCancel, msg } = this.props;
    const { page } = this.state;

    return (
      <div>
        <Stepper activeStep={page - 1}>
          <Step>
            <StepLabel>{msg('organization.create.firstStep')}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{msg('organization.create.secondStep')}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{msg('organization.create.thirdStep')}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{msg('organization.create.fourthStep')}</StepLabel>
          </Step>
        </Stepper>
        <Paper style={styles.paper}>
          {page === 1 && <FormFirst onSubmit={this.nextPage} onCancel={onCancel} />}
          {page === 2 && <FormSecond previousPage={this.previousPage} onSubmit={this.nextPage} />}
          {page === 3 && <FormThird previousPage={this.previousPage} onSubmit={this.nextPage} />}
          {page === 4 && <FormFourth previousPage={this.previousPage} onSubmit={onSubmit} />}
        </Paper>
      </div>
    );
  }
}

const styles = {
  paper: {
    padding: '3%',
  },
};
