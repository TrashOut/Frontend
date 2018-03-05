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
import AppBar from 'material-ui/AppBar';
import Colors from '../../common/app/colors';
import Confirm from '../app/components/Confirm';
import Loading from '../app/components/Loading';
import Paper from 'material-ui/Paper';
import React, { PureComponent as Component } from 'react';
import SecondAppBar from '../app/components/SecondAppBar';
import translate from '../../messages/translate';
import { addConfirm } from '../../common/confirms/actions';
import { connect } from 'react-redux';
import { resolveSpam, removeSpam, fetchSpam } from '../../common/spam/actions';

@connect(state => ({
  ...state.spam.get('item'),
  isFetching: state.spam.get('isFetching'),
}), { addConfirm, fetchSpam, removeSpam, resolveSpam })
@translate
export default class Detail extends Component {
  static propTypes = {
    addConfirm: React.PropTypes.func.isRequired,
    data: React.PropTypes.array,
    fetchSpam: React.PropTypes.func,
    isFetching: React.PropTypes.bool,
    item: React.PropTypes.any,
    match: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    params: React.PropTypes.object,
    removeSpam: React.PropTypes.func,
    resolveSpam: React.PropTypes.func,
  };

  componentWillMount() {
    const { fetchSpam, match: { params: { id } } } = this.props;
    fetchSpam(id);
  }

  render() {
    const { addConfirm, data, isFetching, msg, removeSpam, resolveSpam } = this.props;
    if (isFetching || !data) return <Loading />;

    return (
      <div>
        <div>
          <SecondAppBar
            title={msg('global.detail')}
            rightUpperButtons={[
              { name: 'resolve', label: msg('notifications.approve'), onClick: () => addConfirm('resolve', { onSubmit: () => resolveSpam(data.id) }) },
              { name: 'remove', label: msg('notifications.deny'), onClick: () => addConfirm('remove', { onSubmit: () => removeSpam(data.id) }) },
            ]}
          />
          <div className="main-content">
            <AppBar
              title={msg('notifications.detail')}
              style={{ background: Colors.secondary }}
              showMenuIconButton={Boolean(false)}
            />
            <Confirm />
            <Paper style={style.main}>
              <div className="row">
                <div className="col m6">
                  <h4>Poznámka</h4>
                  <p>{data.description || ''}</p>
                </div>
              </div>
            </Paper>
          </div>
        </div>
      </div>
    );
  }
}

const style = {
  main: {
    padding: '2%',
    gridList: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
  },
  topIndentation: {
    marginTop: '2%',
  },
  history: {
    padding: '1%',
    float: 'left',
    width: '100%',
    marginBottom: '2%',
    record: {
      header: {
        width: '100%',
        float: 'left',
        left: {
          float: 'left',
          padding: '0',
          margin: '0',
        },
        right: {
          float: 'right',
        },
      },
      content: {
        width: '100%',
        gridList: {
          display: 'flex',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          width: '100%',
        },
      },
    },
  },
};
