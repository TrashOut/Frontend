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
import Colors from '../../../common/app/colors';
import Link from './Link';
import React, { Component } from 'react';
import routesList from '../../routesList';
import UiAvatar from 'material-ui/Avatar';


export default class UserBox extends Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    email: React.PropTypes.string.isRequired,
    imageUrl: React.PropTypes.string,
  };

  state = {
    imageHasError: false,
  };

  render() {
    const { name, email, imageUrl } = this.props;

    return (
      <div className="UserInfo">
        <Link to={routesList.myProfile}>
          <img
            src={imageUrl}
            alt="checker"
            style={{ display: 'none' }}
            onError={() => {
              this.setState({ imageHasError: true });
            }}
          />

          {!this.state.imageHasError &&
            <UiAvatar size={40} src={imageUrl} className="Avatar" backgroundColor={Colors.primary} />
          }

          {this.state.imageHasError &&
            <UiAvatar size={40} className="Avatar" backgroundColor={Colors.primary} >
              {name[0]}
            </UiAvatar>
          }

          <div className="Contact">
            <div
              className="UserName"
              style={{ overflow: 'hidden', width: '166px', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {name}
            </div>
            {(email !== name) &&
              <div className="Email">{email}</div>
            }
          </div>
        </Link>
      </div>
    );
  }
}
