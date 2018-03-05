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
import CircularProgress from 'material-ui/CircularProgress';
import Colors from '../../../common/app/colors';
import React from 'react';
import SecondAppBar from './SecondAppBar';
import Snackbar from 'material-ui/Snackbar';
import translate from '../../../messages/translate';
import { connect } from 'react-redux';

@connect(state => ({
  pendingCount: state.app.pendingCount,
}), null)
@translate
export default class Loading extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.func,
      React.PropTypes.node,
    ]),
    duration: React.PropTypes.number,
    label: React.PropTypes.string,
    msg: React.PropTypes.func.isRequired,
    pendingCount: React.PropTypes.number,
    type: React.PropTypes.string,
    wrapped: React.PropTypes.bool,
  };

  renderCircular = (wrapped) => {
    const circular = (<CircularProgress
      size={80}
      thickness={5}
      style={styles.circular}
      color={Colors.secondary}
    />);

    if (wrapped) {
      return (<div>
        <SecondAppBar />
        <div className="main-content">
          {circular}
        </div>
      </div>);
    }

    return circular;
  }

  render() {
    const { duration, label, msg, pendingCount, type, wrapped } = this.props;

    switch (type) {
      case 'circular':
        return this.renderCircular(wrapped);
    }

    return (
      <Snackbar
        open={pendingCount > 0}
        autoHideDuration={duration || 30000}
        message={label || msg('global.loading')}
      />
    );
  }
}

const styles = {
  circular: {
    width: '100%',
    textAlign: 'center',
    margin: '20px',
  },
};
