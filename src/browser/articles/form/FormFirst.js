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
import { ArticleAreaSelect } from '../../areas/form/Form';
import { Field, reduxForm } from 'redux-form';
import { validate } from '../../../common/articles/validate';
import { languages } from '../../../common/consts';

@translate
@reduxForm({
  form: 'article',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
})
export default class Form extends Component {
  static propTypes = {
    handleSubmit: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func,
  };

  render() {
    const {
      handleSubmit,
      onCancel,
      msg,
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col s12">
            <Field
              name="title"
              component={Input}
              label={msg('news.title')}
            />
          </div>
          <div className="col s12">
            <Field
              name="language"
              type="select"
              component={Input}
              items={Object.keys(languages).map(key => ({ ...languages[key], id: languages[key].globalId }))}
              label={msg('news.language')}
              selectPlaceholder={'global.select'}
            />
          </div>
          <div className="col s12">
            <ArticleAreaSelect />
          </div>
        </div>
        <div className="row col s12">
          <div className="right-align">
            <RaisedButton
              type="button"
              label={msg('global.cancel')}
              style={styles.button}
              onClick={onCancel}
            />
            <RaisedButton
              type="submit"
              label={msg('global.nextStep')}
              style={styles.button}
              primary={Boolean(true)}
            />
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

