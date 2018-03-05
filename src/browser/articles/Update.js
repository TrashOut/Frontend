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
import { initialize } from 'redux-form';
import { push } from 'react-router-redux';
import { updateArticle, fetchArticle } from '../../common/articles/actions';

@translate
@connect(state => ({
  isFetching: state.articles.isFetching,
  item: state.articles.item,
}), { push, updateArticle, fetchArticle, initialize })
export default class Update extends Component {
  static propTypes = {
    fetchArticle: React.PropTypes.func,
    handleSubmit: React.PropTypes.func,
    initialize: React.PropTypes.func,
    isFetching: React.PropTypes.bool,
    item: React.PropTypes.object,
    match: React.PropTypes.object,
    msg: React.PropTypes.func,
    push: React.PropTypes.func.isRequired,
    updateArticle: React.PropTypes.func,
  };

  componentWillMount() {
    const { fetchArticle, match } = this.props;
    fetchArticle(match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    const { initialize, isFetching } = this.props;
    if (isFetching && !nextProps.isFetching) {
      initialize('article', nextProps.item.toForm());
    }
  }

  renderContent(isFetching) {
    const { push, updateArticle, match: { params: { id } } } = this.props;
    if (isFetching) return null;

    return (<Form
      onCancel={() => push(routesList.articleDetail.replace(':id', id))}
      onSubmit={updateArticle}
    />);
  }

  render() {
    const { item, isFetching, msg } = this.props;

    return (
      <div>
        <SecondAppBar
          title={msg('global.edit')}
        />
        <div className="main-content">
          {this.renderContent(isFetching || !item)}
        </div>
      </div>
    );
  }
}
