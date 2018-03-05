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
import Dialog from 'material-ui/Dialog';
import React, { PureComponent as Component } from 'react';
import routesList from '../../routesList';
import translate from '../../../messages/translate';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { FlatButton } from 'material-ui';
import { push } from 'react-router-redux';
import { RootFilter } from '../form/Form';
import { submit } from 'redux-form';

@translate
@connect(state => ({
  userAreas: state.users.viewer.userHasArea,
  items: state.areas.formOptions,
}), { push, submit })
export default class AddManager extends Component {
  static propTypes = {
    item: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    submit: React.PropTypes.func,
    userAreas: React.PropTypes.array,
    push: React.PropTypes.func,
    match: React.PropTypes.object,
    items: React.PropTypes.array,
  };

  @autobind
  onSubmit(values) {
    const { push, items, match: { params: { id } } } = this.props;

    const array = Object.keys(values);
    for (let i = array.length - 1; i >= 0; i -= 1) {
      const index = array[i];
      if (values[index] !== 'all' && values[index] !== '') {
        const result = items.get(index).filter(x => x.label === values[index]);
        if (result.length === 0) {
          return push(routesList.areaDetail.replace(':id', id));
        }
        return push(routesList.areaDetail.replace(':id', result[0].pathId));
      }
    }
    return push(routesList.areaDetail.replace(':id', id));
  }

  render() {
    const { userAreas, push, msg, submit, match: { params: { id } } } = this.props;

    const userArea = userAreas.filter(x => x.areaId === id)[0];
    if (!userArea) return null;

    const buttons = [
      <FlatButton type="button" label={msg('global.cancel')} onClick={() => push('../')} />,
      <FlatButton type="button" label={msg('geo.selectArea')} onClick={() => submit('rootFilter')} />,
    ];

    const { type } = userArea.area;

    return (
      <Dialog
        title={msg('geo.selectSpecificArea')}
        actions={buttons}
        open
        autoScrollBodyContent
        actionsContainerStyle={{ borderTop: '0' }}
        titleStyle={{ borderBottom: '0' }}
      >
        <RootFilter
          startPoint={{
            type,
            id: userArea.area[type],
            firstDisabled: true,
          }}
          useIds
          onSubmit={this.onSubmit}
        />
      </Dialog>
    );
  }
}
