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
import { animateScroll } from 'react-scroll';
import { autobind } from 'core-decorators';
import { cleanFormData } from '../../../common/events/actions';
import { connect } from 'react-redux';
import { initialize } from 'redux-form';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';

@translate
@connect(null, { cleanFormData, initialize })
export default class Form extends Component {
  static propTypes = {
    cleanFormData: React.PropTypes.func,
    data: React.PropTypes.array,
    defaultSelectAll: React.PropTypes.bool,
    initialize: React.PropTypes.func,
    label: React.PropTypes.string,
    msg: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func,
    onToggleLocation: React.PropTypes.func,
  };

  state = {
    page: 1,
  }

  componentWillMount() {
    const { data, initialize } = this.props;

    initialize('eventCreate', data || {});
  }

  componentWillUnmount() {
    const { cleanFormData } = this.props;

    cleanFormData();
  }

  @autobind
  nextPage() {
    this.setState({ page: this.state.page + 1 });
    animateScroll.scrollToTop();
  }

  @autobind
  previousPage() {
    this.setState({ page: this.state.page - 1 });
    animateScroll.scrollToTop();
  }

  render() {
    const { onToggleLocation, defaultSelectAll, onSubmit, label, msg } = this.props;
    const { page } = this.state;

    return (
      <div>
        <SecondAppBar
          title={label}
        />
        <div className="main-content">
          <Stepper activeStep={page - 1}>
            <Step>
              <StepLabel>{msg('event.create.firstStep')}</StepLabel>
            </Step>
            <Step>
              <StepLabel>{msg('event.create.thirdStep')}</StepLabel>
            </Step>
            <Step>
              <StepLabel>{msg('event.create.secondStep')}</StepLabel>
            </Step>
          </Stepper>
          <Paper style={styles.paper}>
            {page === 1 &&
              <FormFirst
                onSubmit={this.nextPage}
              />
            }
            {page === 2 &&
              <FormSecond
                previousPage={this.previousPage}
                onSubmit={this.nextPage}
              />
            }
            {page === 3 &&
              <FormThird
                previousPage={this.previousPage}
                onSubmit={onSubmit}
                defaultSelectAll={defaultSelectAll}
                onToggleLocation={onToggleLocation}
              />
            }
          </Paper>
        </div>
      </div>
    );
  }
}

const styles = {
  button: {
    marginLeft: '12px',
  },
  paper: {
    padding: '3%',
  },
};
