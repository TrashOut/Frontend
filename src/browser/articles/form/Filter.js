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
import { ArticleFilter } from '../../areas/form/Form';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { languages } from '../../../common/consts';

@translate
@connect(state => ({
  initialValues: state.table.filter.toJS(),
}), null)
@reduxForm({
  form: 'article',
})
export default class Form extends Component {
  static propTypes = {
    destroy: React.PropTypes.func,
    handleSubmit: React.PropTypes.func,
    msg: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func,
    style: React.PropTypes.object,
    submitting: React.PropTypes.bool,
  };

  @autobind
  clearAndClose() {
    const { destroy, onSubmit } = this.props;

    destroy();
    setTimeout(() => onSubmit({}), 10);
  }

  render() {
    const { handleSubmit, msg, onSubmit, style, submitting } = this.props;
    return (
      <div style={style}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col s12 m6">
              <Field
                name="language"
                type="select"
                items={Object.keys(languages).reduce((acc, cur) => {
                  const { globalId, ...language } = languages[cur];
                  return {
                    ...acc,
                    [globalId]: { ...language, id: globalId },
                  };
                }, {})}
                component={Input}
                label={msg('news.language')}
                selectPlaceholder="global.select"
              />
            </div>
            <div className="col s12 m6">
              <Field
                name="searchKeyWord"
                type="text"
                component={Input}
                label={msg('news.filter.keyword')}
              />
            </div>
            <div className="col s12">
              <ArticleFilter />
            </div>
          </div>
          <div className="row">
            <div className="right-align">
              <RaisedButton
                type="button"
                disabled={submitting}
                onClick={this.clearAndClose}
                label={msg('global.cancelFilter')}
                style={defaultStyle.button}
              />
              <RaisedButton
                type="submit"
                disabled={submitting}
                label={msg('global.submitFilter')}
                style={defaultStyle.button}
                primary={Boolean(true)}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const defaultStyle = {
  button: {
    marginLeft: '12px',
  },
};
