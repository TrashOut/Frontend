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
import translate from '../../../messages/translate';

@translate
export default class IconPreview extends Component {
  static propTypes = {
    msg: React.PropTypes.func,
    options: React.PropTypes.array,
    selected: React.PropTypes.bool,
    showText: React.PropTypes.bool,
    size: React.PropTypes.number,
    stretch: React.PropTypes.bool,
    style: React.PropTypes.object,
    upperText: React.PropTypes.string,
    wrapperStyle: React.PropTypes.object,
    avatarOnClick: React.PropTypes.func,
  };

  state = {
    imageHasError: [],
  };

  render() {
    const { upperText, selected, msg, options, size, showText, stretch = false, style = {}, wrapperStyle = {}, avatarOnClick = null } = this.props;

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
      avatar: {
        border: `3px solid ${Colors.gray}`,
        marginBottom: '12px',
        marginLeft: 'auto',
        marginRight: 'auto',
        cursor: avatarOnClick ? 'pointer' : 'auto',
      },
      image: {
        maxHeight: `${size * 0.65}`,
        maxWidth: `${size * 0.65}`,
      },
    };

    const avatars = typeof selected.map === 'function' && selected.map((val, key) => {
      const item = (Array.isArray(options) &&
        options.filter((obj) => (obj.id === val))[0]) ||
        options[val];

      if (!item) return null;

      const avatarProps = {
        backgroundColor: item.background || Colors.lightGray,
        key,
        size,
        style: styles.avatar,
        onClick: avatarOnClick,
      };

      const src = this.state.imageHasError.indexOf(key) < 0
        ? (item.background && item.imgActive) || item.img
        : '/img/users/noAvatar.jpg';

      const getAvatar = (src) => stretch
        ? (<Avatar {...avatarProps} src={src} />)
        : (
          <Avatar {...avatarProps}>
            <img
              src={src}
              style={styles.image}
              alt={item.label}
            />
          </Avatar>
        );

      const getUpperText = (text) => upperText ? text.toUpperCase() : text;

      return (
        <span style={{ ...styles.container, ...style }}>
          {getAvatar(src)}
          {showText && <span style={styles.container.text}>{getUpperText(item.translatedMessage || msg(item.message))}</span>}
        </span>
      );
    });

    return <div style={{ ...styles, ...wrapperStyle }}>{avatars}</div>;
  }
}
