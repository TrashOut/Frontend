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
import Detail from './Detail';
import { RootFilter } from './form/Form';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import SecondAppBar from '../app/components/SecondAppBar';
import translate from '../../messages/translate';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { fetchAreaFromForm, clearAreaItem } from '../../common/areas/actions';
import { push } from 'react-router-redux';
import { Route } from 'react-router-dom';
import { submit } from 'redux-form';

@translate
@connect(state => ({
  item: state.areas.item,
}), { fetchAreaFromForm, push, submit, clearAreaItem })
export default class Home extends Component {
  static propTypes = {
    fetchAreaFromForm: React.PropTypes.func,
    msg: React.PropTypes.func.isRequired,
    item: React.PropTypes.object,
    submit: React.PropTypes.func,
    clearAreaItem: React.PropTypes.func,
    push: React.PropTypes.func.isRequired,
  };
  static contextTypes = {
    router: React.PropTypes.object,
  };

  componentWillUnmount() {
    const { clearAreaItem } = this.props;
    clearAreaItem();
  }

  @autobind
  onSubmit(values) {
    const { fetchAreaFromForm } = this.props;
    fetchAreaFromForm(values);
  }

  render() {
    const { item, msg, submit } = this.props;

    const buttons = item.id ? [
      { name: 'addAdmin', label: msg('geo.addAdmin'), linkTo: routesList.areaAddAdmin.replace(':id', item.id) },
      { name: 'addAlias', label: msg('geo.addAlias'), linkTo: routesList.areaAddAlias.replace(':id', item.id) },
    ] : [];

    return (
      <div>
        {buttons.length > 0 &&
          <SecondAppBar
            rightUpperButtons={buttons}
          />
        }
        <div className={`main-content ${!item && 'no-appbar'}`}>
          <p>{msg('geo.description.superAdmin')}</p>
          <Paper style={{ padding: '3%' }}>
            <RootFilter
              onSubmit={this.onSubmit}
            />
            <RaisedButton
              type="submit"
              label={msg('global.confirm')}
              primary={Boolean(true)}
              onClick={() => submit('rootFilter')}
            />
          </Paper>
          <Route
            path={routesList.areaDetail}
            component={Detail}
            breadcrumb={msg('global.detail')}
          />
        </div>
      </div>
    );
  }
}
