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
import Form from './form/Form';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import SecondAppBar from '../app/components/SecondAppBar';
import translate from '../../messages/translate';
import { connect } from 'react-redux';
import { createArticle } from '../../common/articles/actions';
import { initialize } from 'redux-form';
import { languages } from '../../common/consts';
import { push } from 'react-router-redux';

@translate
@connect(state => ({
  language: state.intl.currentLocale,
}), { initialize, push, createArticle })
export default class Create extends Component {
  static propTypes = {
    createArticle: React.PropTypes.func,
    handleSubmit: React.PropTypes.func,
    language: React.PropTypes.string,
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired,
    initialize: React.PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { initialize, language } = this.props;
    initialize('article', { language: (languages[language] || {}).globalId });
  }

  render() {
    const { push, createArticle, msg } = this.props;

    return (
      <div>
        <SecondAppBar
          title={msg('global.create')}
        />
        <div className="main-content">
          <Form
            onCancel={() => push(routesList.articleList)}
            onSubmit={createArticle}
          />
        </div>
      </div>
    );
  }
}
