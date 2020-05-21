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
import Form from './form/FormComment';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import SecondAppBar from '../app/components/SecondAppBar';
import translate from '../../messages/translate';
import { connect } from 'react-redux';
import { createComment } from '../../common/trashmanagement/actions';
import { push } from 'react-router-redux';
import { initialize } from 'redux-form';
import Paper from "material-ui/Paper";

@translate
@connect(null, { initialize, push, createComment })
export default class Create extends Component {
  static propTypes = {
    createComment: React.PropTypes.func,
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired,
    match: React.PropTypes.func.object,
    initialize: React.PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { initialize } = this.props;
    initialize('commentForm', {}); // clear form data
  }

  render() {
    const { push, createComment, msg, match } = this.props;

    const onSubmit = (values) => {
      createComment(match.params.id, values);
      push(routesList.trashDetail.replace(':id', match.params.id))
    }

    return (
      <div>
        <SecondAppBar
          title={msg('global.create')}
        />
        <div className="main-content">
          <Paper style={{ padding: '2vw' }}>
            <Form
              onCancel={() => push(routesList.trashDetail.replace(':id', match.params.id))}
              onSubmit={onSubmit}
            />
          </Paper>
        </div>
      </div>
    );
  }
}
