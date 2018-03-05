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
import _ from 'lodash';
import Input from '../../app/components/Input';
import RaisedButton from 'material-ui/RaisedButton';
import React, { PureComponent as Component } from 'react';
import translate from '../../../messages/translate';
import { connect } from 'react-redux';
import { cpCategories, cpDustbinTypes, cpScrapyardTypes, days } from '../../../common/collectionpoints/consts';
import { Field, reduxForm, formValueSelector, change, arrayRemove } from 'redux-form';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import { validateCreate } from '../../../common/collectionpoints/validate';

const selector = formValueSelector('collectionPointCreate');

@translate
@reduxForm({
  form: 'collectionPointCreate',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate: validateCreate,
})
@connect(state => ({
  nextHours: selector(state, 'nextHours'),
  selectedDays: selector(state, 'days'),
  selectedSize: selector(state, 'size'),
  selectedTypes: selector(state, 'types'),
}), { change, arrayRemove })
export default class Form extends Component {
  static propTypes = {
    arrayRemove: React.PropTypes.func,
    change: React.PropTypes.func,
    counter: React.PropTypes.number,
    createCollectionPoint: React.PropTypes.func,
    getPosition: React.PropTypes.func,
    handleSubmit: React.PropTypes.func,
    hours: React.PropTypes.array,
    msg: React.PropTypes.func.isRequired,
    nextHours: React.PropTypes.array,
    previousPage: React.PropTypes.func,
    pristine: React.PropTypes.bool,
    selectedDays: React.PropTypes.array,
    selectedSize: React.PropTypes.string,
    selectedTypes: React.PropTypes.object,
    submitting: React.PropTypes.bool,
  };
  static contextTypes = {
    router: React.PropTypes.object,
  };

  state = {
    counter: 0,
    counterdel: 0,
    hours: [],
  }

  componentWillMount() {
    const { hours } = this.props;
    this.setState({ counter: 0, hours: hours || [] });
  }

  render() {
    const {
      arrayRemove,
      previousPage,
      handleSubmit,
      submitting,
      nextHours,
      selectedSize,
      msg,
      change,
      selectedTypes,
    } = this.props;
    let { selectedDays } = this.props;
    const isScrapyard = selectedSize === 'scrapyard';

    selectedDays =
      selectedDays &&
      Object.keys(selectedDays).reduce((prev, cur) =>
        (selectedDays[cur]) ? prev.concat(cur) : prev,
        []
      );

    const offeredDays =
      ((Array.isArray(selectedDays) &&
        Object.keys(days).reduce((prev, cur) =>
        (selectedDays.indexOf(days[cur].id) === -1) ? prev : prev.concat(days[cur]),
        [])
      ) || days);

    const openingDays = Object.keys(days).slice(0, 7).reduce((prev, cur) => ({ ...prev, [cur]: days[cur] }), {});

    const hours = this.state.hours.map(x =>
      <TableRow key={x.key}>
        <TableRowColumn>
          <Field
            name={`nextHours[${x.key}].day`}
            type="select"
            component={Input}
            label={msg('global.day')}
            items={offeredDays}
          />
        </TableRowColumn>
        <TableRowColumn>
          <Field
            name={`nextHours[${x.key}][0]['from']`}
            type="time"
            component={Input}
            value={new Date()}
            label={msg('collectionPoint.create.everyDayFromAm')}
            hint={msg('collectionPoint.create.everyDayFromAm')}
          />
        </TableRowColumn>
        <TableRowColumn>
          <Field
            name={`nextHours[${x.key}][0]['to']`}
            type="time"
            component={Input}
            value={new Date()}
            label={msg('collectionPoint.create.everyDayToAm')}
            hint={msg('collectionPoint.create.everyDayToAm')}
          />
        </TableRowColumn>
        <TableRowColumn>
          <Field
            name={`nextHours[${x.key}][1]['from']`}
            type="time"
            component={Input}
            value={new Date()}
            label={msg('collectionPoint.create.everyDayFromPm')}
            hint={msg('collectionPoint.create.everyDayFromPm')}
          />
        </TableRowColumn>
        <TableRowColumn>
          <Field
            name={`nextHours[${x.key}][1]['to']`}
            type="time"
            component={Input}
            value={new Date()}
            label={msg('collectionPoint.create.everyDayToPm')}
            hint={msg('collectionPoint.create.everyDayToPm')}
          />
        </TableRowColumn>
        <TableRowColumn>
          <RaisedButton
            type="button"
            disabled={submitting}
            label={msg('global.remove')}
            style={styles.button}
            onClick={() => {
              if (nextHours) arrayRemove('collectionPointCreate', 'nextHours', x.key);
              this.state.hours.pop();
              this.setState({ counterdel: this.state.counterdel + 1 });
            }}
          />
        </TableRowColumn>
      </TableRow>);

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          {selectedSize &&
            <div>
              <div className="col s12">
                <Field
                  name="categories"
                  type="checkboxList"
                  component={Input}
                  label={msg('collectionPoint.category')}
                  items={_.pickBy(cpCategories, (value) => value.selectable)}
                  onValueChange={(value) => {
                    const category = cpCategories[value.id];
                    const types = category.selectAll ? [] : category.types;
                    const result = types.reduce((prev, cur) => {
                      prev[cur] = value.checked;
                      return prev;
                    }, {});
                    const newTypes = { ...selectedTypes, ...result };
                    newTypes[category.id] = value.checked;
                    change('collectionPointCreate', 'types', newTypes);
                  }}
                  inRow
                />
              </div>
              <div className="col s12">
                <Field
                  name="types"
                  type="checkboxList"
                  component={Input}
                  label={msg('collectionPoint.type')}
                  categories={_.pickBy(cpCategories, (value) => value.types)}
                  items={isScrapyard ? cpScrapyardTypes : cpDustbinTypes}
                  inRow
                />
              </div>
            </div>
          }
          {isScrapyard &&
            <div>
              <div className="col s12">
                <Field name="days" type="checkboxList" component={Input} label={msg('collectionPoint.openDays')} items={openingDays} inRow={Boolean(true)} />
              </div>
              <div className="col s12">
                <Table selectable={Boolean(false)}>
                  <TableBody displayRowCheckbox={Boolean(false)}>
                    <TableRow>
                      <TableRowColumn colSpan="2">{msg('collectionPoint.openingHours')}</TableRowColumn>
                      <TableRowColumn><Field name="timeFrom[0]" type="time" component={Input} value={new Date()} label={msg('collectionPoint.create.everyDayFromAm')} hint={msg('collectionPoint.create.everyDayFromAm')} /></TableRowColumn>
                      <TableRowColumn><Field name="timeTo[0]" type="time" component={Input} value={new Date()} label={msg('collectionPoint.create.everyDayToAm')} hint={msg('collectionPoint.create.everyDayToAm')} /></TableRowColumn>
                      <TableRowColumn><Field name="timeFrom[1]" type="time" component={Input} value={new Date()} label={msg('collectionPoint.create.everyDayFromPm')} hint={msg('collectionPoint.create.everyDayFromPm')} /></TableRowColumn>
                      <TableRowColumn><Field name="timeTo[1]" type="time" component={Input} value={new Date()} label={msg('collectionPoint.create.everyDayToPm')} hint={msg('collectionPoint.create.everyDayToPm')} /></TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn colSpan="6">
                        <RaisedButton
                          type="button"
                          disabled={submitting}
                          label={msg('collectionPoint.create.openDaysAddException')}
                          fullWidth={Boolean(true)}
                          style={styles.button}
                          onClick={() => {
                            this.state.hours.push({ key: this.state.counter });
                            this.setState({ counter: this.state.counter + 1 });
                          }}
                        />
                      </TableRowColumn>
                    </TableRow>
                    {hours}
                  </TableBody>
                </Table>
              </div>
            </div>
          }
          <div className="col s12">
            <Field name="note" type="text" component={Input} label={msg('global.note')} multiLine={Boolean(true)} />
          </div>
        </div>
        <div className="row col s12">
          <div className="right-align">
            <RaisedButton type="button" disabled={submitting} label={msg('global.back')} style={styles.button} onClick={previousPage} />
            <RaisedButton type="submit" disabled={submitting} label={msg('global.nextStep')} style={styles.button} primary={Boolean(true)} />
          </div>
        </div>
      </form>
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
