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
import routesList from '../../routesList';
import translate from '../../../messages/translate';
import { collectionPointSizes } from '../../../common/collectionpoints/consts';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { push } from 'react-router-redux';
import { validateCreate } from '../../../common/collectionpoints/validate';

const selector = formValueSelector('collectionPointCreate');

@translate
@connect(state => ({
  selectedSize: selector(state, 'size'),
}), { push, change })
@reduxForm({
  form: 'collectionPointCreate',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate: validateCreate,
})
export default class Form extends Component {
  static propTypes = {
    change: React.PropTypes.func,
    handleSubmit: React.PropTypes.func,
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired,
    selectedSize: React.PropTypes.string,
  };

  componentWillUpdate(nextProps) {
    const { selectedSize, change } = this.props;
    if (selectedSize !== nextProps.selectedSize) {
      change('types', {});
    }
  }

  render() {
    const { push, handleSubmit, selectedSize, msg } = this.props;
    const isScrapyard = selectedSize === 'scrapyard';

    return (
      <form
        onSubmit={handleSubmit}
        onKeyPress={(event) => event.keyCode !== 13}
      >
        <div className="row">
          <div className="col s12">
            <Field
              name="size"
              type="radioList"
              component={Input}
              label={msg('collectionPoint.size')}
              items={collectionPointSizes}
              inRow={Boolean(true)}
            />
          </div>
        </div>
        <div className="row">
          {isScrapyard &&
            <div>
              <div className="col s12 m6">
                <Field
                  name="name"
                  component={Input}
                  label={msg('collectionPoint.name')}
                  hint={msg('collectionPoint.name')}
                />
              </div>
              <div className="col s12 m6">
                <Field
                  name="url"
                  component={Input}
                  label={msg('global.url')}
                  hint={msg('global.url')}
                />
              </div>
            </div>
          }

          {isScrapyard &&
            <div>
              <div className="col s12 m6">
                <Field
                  name="email"
                  component={Input}
                  label={msg('global.email')}
                  hint={msg('global.email')}
                />
              </div>
              <div className="col s12 m6">
                <Field
                  name="phone"
                  type="phone"
                  component={Input}
                  label={msg('global.phone')}
                  hint={msg('global.phone')}
                />
              </div>
            </div>
          }
        </div>
        <div className="row">
          <div className="col s12">
            <Field
              name="location"
              type="map"
              component={Input}
              label={msg('collectionPoint.location')}
            />
          </div>
        </div>
        <div className="row">
          <div className="col s12">
            <div className="right-align">
              <RaisedButton
                type="button"
                label={msg('global.cancel')}
                style={styles.button}
                onClick={() => push(routesList.collectionPointList)}
              />
              <RaisedButton
                type="submit"
                label={msg('global.nextStep')}
                style={styles.button}
                primary={Boolean(true)}
              />
            </div>
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

