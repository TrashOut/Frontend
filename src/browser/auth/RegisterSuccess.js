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
import Link from '../app/components/Link';
import Paper from 'material-ui/Paper';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import translate from '../../messages/translate';

@translate
export default class Register extends Component {
  static propTypes = {
    msg: React.PropTypes.func.isRequired,
  };

  render() {
    const { msg } = this.props;
    return (
      <div>
        <Paper className="paper">
          <h3 style={styles.center}>{msg('global.accountCreated')}</h3>
          <p>{msg('global.activateAccount')}</p>
        </Paper>
        <p style={styles.center}>
          <Link
            to={routesList.login}
          >
            &larr; {msg('global.backToLogin')}
          </Link>
        </p>
      </div>
    );
  }
}

const styles = {
  center: {
    textAlign: 'center',
  },
};
