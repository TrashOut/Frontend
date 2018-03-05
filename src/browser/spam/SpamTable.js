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
import Colors from '../../common/app/colors';
import Paper from 'material-ui/Paper';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import Table from '../app/components/Table';
import translate from '../../messages/translate';

@translate
export default class SpamTableData extends Component {
  static propTypes = {
    data: React.PropTypes.array,
    msg: React.PropTypes.func.isRequired,
    onApprove: React.PropTypes.func.isRequired,
    onRemove: React.PropTypes.func.isRequired,
    type: React.PropTypes.string,
  };

  render() {
    const { type, data, onApprove, onRemove, msg } = this.props;

    const image = type === 'trash'
      ? { img: { label: msg('trash.image'), sortable: false, type: 'trashImage' } }
      : {};

    const header = {
      ...image,
      id: {
        label: msg('global.detail'),
        sortable: true,
        type: 'link',
        linkName: type === 'trash'
          ? '{trashPointId}'
          : '{collectionPointId}',
        template: type === 'trash'
          ? routesList.trashDetail.replace(':id', '{trashPointId}')
          : routesList.collectionPointDetail.replace(':id', '{collectionPointId}'),
      },
      reported: {
        label: msg('notifications.reported'),
        sortable: true,
        type: 'date',
      },
      resolve: {
        label: msg('notifications.spam.confirm'),
        sortable: false,
        type: 'button',
        onClick: onApprove,
        linkName: msg('notifications.spam.confirm'),
      },
      delete: {
        label: msg('notifications.spam.deny'),
        sortable: false,
        type: 'button',
        onClick: onRemove,
        linkName: msg('notifications.spam.deny'),
      },
    };

    return (
      <Paper style={style}>
        <Table
          header={header}
          data={data}
          showLinkButton={Boolean(false)}
        />
      </Paper>
    );
  }
}

const style = {
  tableFooter: {
    width: '96%',
    marginLeft: '2%',
    marginRight: '2%',
    marginTop: '10px',
    paddingBottom: '20px',
  },
  inkBar: {
    backgroundColor: Colors.orange,
  },
};
