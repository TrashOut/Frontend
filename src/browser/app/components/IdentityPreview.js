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
import Avatar from 'material-ui/Avatar';
import Colors from '../../../common/app/colors';
import React, { Component } from 'react';

export default class IdentityPreview extends Component {
  static propTypes = {
    img: React.PropTypes.string,
    text: React.PropTypes.string,
    size: React.PropTypes.number,
    style: React.PropTypes.object,
    wrapperStyle: React.PropTypes.object,
    avatarOnClick: React.PropTypes.func,
  };

  render() {
    const { img, text, size, style = {}, wrapperStyle = {}, avatarOnClick = null } = this.props;

    const styles = {
      display: 'flex',
      flexFlow: 'row wrap',
      alignItems: 'flex-start',
      container: {
        margin: '20px',
        marginTop: '0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        maxWidth: '120px',
        text: {
          overflowWrap: 'break-word',
          wordWrap: 'break-word',
        },
      },
    };

    const avatarStyle = {
      objectFit: 'cover',
      border: `3px solid ${Colors.gray}`,
      marginBottom: '12px',
      cursor: avatarOnClick ? 'pointer' : 'auto',
    }

    return <div style={{ ...styles, ...wrapperStyle }}>
      <span style={{ ...styles.container, ...style }}>
          <Avatar
            src={img}
            size={size}
            style={avatarStyle}
            onClick={avatarOnClick}
          />
        <span style={styles.container.text}>{text}</span>
        </span>
    </div>;
  }
}
