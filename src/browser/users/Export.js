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
import ExportComponent from '../app/components/Export';
import React, { PureComponent as Component } from 'react';
import translate from '../../messages/translate';
import { attributes } from '../../common/users/consts';
import { connect } from 'react-redux';
import { exportUsers } from '../../common/users/actions';
import { push } from 'react-router-redux';
import { resetExport } from '../../common/table/actions';

@translate
@connect(state => ({
  currentNumber: state.table.exportCurrentNumber,
  count: state.table.exportCount,
}), { push, exportUsers, resetExport })
export default class Export extends Component {
  static propTypes = {
    resetExport: React.PropTypes.func,
    exportUsers: React.PropTypes.func,
    count: React.PropTypes.number,
    currentNumber: React.PropTypes.number,
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func,
  };

  render() {
    const {
      count,
      currentNumber,
      msg,
      resetExport,
      exportUsers,
      push,
    } = this.props;

    return (<ExportComponent
      onClose={() => {
        resetExport();
        push('../');
      }}
      onSubmit={exportUsers}
      attributes={attributes}
      pages={count}
      currentPage={currentNumber}
      title={msg('global.export')}
    />);
  }
}
