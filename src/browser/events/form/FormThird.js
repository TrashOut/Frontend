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
import Input from '../../app/components/Input';
import RaisedButton from 'material-ui/RaisedButton';
import React, { PureComponent as Component } from 'react';
import translate from '../../../messages/translate';
import { cleanFormData, fetchForUpdate, toggleLocation } from '../../../common/events/actions';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { getRectangleDiagonal } from '../../../common/events/helper';
import { MAX_TRASH_POINTS, MAX_AREA_TRESHOLD } from '../../../common/events/consts';
import { validateCreate } from '../../../common/events/validate';

const selector = formValueSelector('eventCreate');

@translate
@reduxForm({
  form: 'eventCreate',
  validate: validateCreate,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})
@connect(state => ({
  isFetching: state.events.isFetchingFormData,
  cleaningArea: selector(state, 'cleaningArea'),
  formTrashes: selector(state, 'trashPointIds'),
  formCollectionPoints: selector(state, 'collectionPointIds'),
  trashes: state.events.formData.trashes,
  collectionPoints: state.events.formData.collectionPoints,
  toggled: state.events.dumb,
}), { cleanFormData, fetchForUpdate, toggleLocation })
export default class Form extends Component {
  static propTypes = {
    cleanFormData: React.PropTypes.func,
    cleaningArea: React.PropTypes.object,
    collectionPoints: React.PropTypes.array,
    defaultSelectAll: React.PropTypes.any,
    fetchForUpdate: React.PropTypes.func,
    formCollectionPoints: React.PropTypes.object,
    formTrashes: React.PropTypes.object,
    handleSubmit: React.PropTypes.func,
    isFetching: React.PropTypes.bool,
    msg: React.PropTypes.func.isRequired,
    nextHours: React.PropTypes.array,
    onToggleLocation: React.PropTypes.func,
    previousPage: React.PropTypes.func,
    selectedCollectionPoints: React.PropTypes.array,
    selectedTrashes: React.PropTypes.array,
    toggleLocation: React.PropTypes.func,
    trashes: React.PropTypes.array,
  };

  state = {
    largeArea: false,
  }

  componentWillMount() {
    const { cleaningArea } = this.props;
    if (cleaningArea) this.setState({ largeArea: getRectangleDiagonal(cleaningArea) > MAX_AREA_TRESHOLD });
  }

  render() {
    const {
      handleSubmit,
      msg,
      collectionPoints,
      trashes,
      isFetching,
      fetchForUpdate,
      formTrashes,
      formCollectionPoints,
      toggleLocation,
      cleanFormData,
      previousPage,
    } = this.props;

    const selectedTrashes = (trashes && formTrashes && trashes.size <= MAX_TRASH_POINTS && trashes.reduce((prev, cur) => {
      prev.push(cur.toMap(formTrashes[cur.id]));
      return prev;
    }, [])) || [];

    const selectedCollectionPoints = (collectionPoints && formCollectionPoints && collectionPoints.reduce((prev, cur) => {
      prev.push(cur.toMap(formCollectionPoints[cur.id]));
      return prev;
    }, [])) || [];

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="row col s12">
            <Field
              name="cleaningArea"
              type="crop_map"
              items={selectedTrashes}
              component={Input}
              label={msg('event.create.setLocation')}
              hint={msg('event.create.setLocationDescription')}
              onSelect={toggleLocation}
              onMapChanged={(value, distance) => {
                const largeArea = distance > MAX_AREA_TRESHOLD;
                this.setState({ largeArea });
                return (!value || largeArea)
                  ? cleanFormData()
                  : fetchForUpdate(true);
              }}
              isFetching={isFetching}
            />
          </div>
          <div className="row col s12">
            {msg(this.state.largeArea
              ? 'event.create.largeAreaDescription'
              : 'event.create.smallAreaDescription'
            )}
          </div>
          {!this.state.largeArea &&
            <div className="col s12">
              <Field
                name="collectionPointIds"
                type="checkboxList"
                items={selectedCollectionPoints}
                component={Input}
                label={msg('event.create.collectionPoints')}
              />
            </div>
          }
        </div>

        <div className="row col s12">
          <div className="right-align">
            <RaisedButton type="button" style={styles.button} label={msg('global.back')} onClick={previousPage} />
            <RaisedButton type="submit" style={styles.button} label={msg('global.save')} primary={Boolean(true)} />
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
};
