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
import CopyToClipboard from 'react-copy-to-clipboard';
import Input from '../../app/components/Input';
import RaisedButton from 'material-ui/RaisedButton';
import React, { PureComponent as Component } from 'react';
import translate from '../../../messages/translate';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { widgetTypes } from './FirstForm';

const selector = formValueSelector('widget');

@translate
@reduxForm({
  form: 'widget',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})
@connect(state => ({
  widgetType: selector(state, 'type'),
  width: selector(state, 'width'),
  height: selector(state, 'height'),
  language: selector(state, 'language'),
  id: selector(state, 'id'),
  hashParams: {
    'filter-last': selector(state, 'filterLast'),
    'filter-status[]': selector(state, 'filterStatus'),
    'filter-size[]': selector(state, 'filterSize'),
    'filter-type[]': selector(state, 'filterType'),
    'filter-accessibility[]': selector(state, 'filterAccessibility'),
  },
  hashWithoutKey: selector(state, 'map') ? [
    ...state.map.center,
    state.map.zoom,
    'false',
  ] : [],
  apiKey: state.users.apiKey.toJS(),
}), null)
export default class FirstForm extends Component {

  static propTypes = {
    id: React.PropTypes.string,
    apiKey: React.PropTypes.object,
    language: React.PropTypes.string,
    hashParams: React.PropTypes.object,
    hashWithoutKey: React.PropTypes.array,
    width: React.PropTypes.string,
    height: React.PropTypes.string,
    widgetType: React.PropTypes.string,
    msg: React.PropTypes.func.isRequired,
  }

  getQueries() {
    const { id, apiKey, language } = this.props;
    const params = {
      id,
      key: apiKey.apiKey,
      language,
    };
    const queries = Object.keys(params).map(x => params[x] && `${x}=${params[x]}`).filter(x => x);
    if (queries.length === 0) return '';
    return `?${queries.join('&')}`;
  }

  getHashes() {
    const { hashParams, hashWithoutKey } = this.props;

    const returnHashValue = (param) => {
      const value = hashParams[param];
      if (!value) return [null];
      if (typeof value === 'string') return [`${param}=${value}`];
      return Object.keys(value).map(x => value[x] && `${param}=${x}`).filter(x => x);
    };

    const hashesWithoutKeysFiltered = hashWithoutKey.filter(x => x);
    const hashes = Object.keys(hashParams).reduce((prev, cur) => [...prev, ...returnHashValue(cur)], []).filter(x => x);

    if (hashes.length === 0 && hashesWithoutKeysFiltered.length === 0) return '';
    return `#${hashesWithoutKeysFiltered.join(';')};${hashes.join('&')}`;
  }

  getStyle() {
    const { width, height } = this.props;
    const params = {
      width,
      height,
    };
    const styles = Object.keys(params).map(x => params[x] && `${x}:${params[x].replace(' ', '')}`).filter(x => x);
    if (styles.length === 0) return '';
    return `style="${styles.join(';')}"`;
  }

  generateValue() {
    const { widgetType } = this.props;
    const baseUrl = `https://widgets.trashout.ngo${(widgetTypes[widgetType] || {}).url}`;
    const fullUrl = `${baseUrl}${this.getQueries()}${encodeURI(this.getHashes())}`;
    return `<iframe src="${fullUrl}" ${this.getStyle()} />`;
  }

  render() {
    const { msg } = this.props;
    const value = this.generateValue();
    return (
      <div>
        <p>{msg('user.widget.codeDescription')}</p>
        <Field
          type="disabled"
          component={Input}
          defaultValue={value}
          multiLine
        />
        <CopyToClipboard text={value}>
          <RaisedButton
            label={msg('user.widget.copy')}
            style={{ width: '100%' }}
          />
        </CopyToClipboard>
      </div>
    );
  }
}
