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
import Radium from 'radium';
import React, { PureComponent as Component } from 'react';

export const getAvatar = (checked, background, src, srcActive) =>
  <Avatar size={75} style={Object.assign({}, styles.avatar, (checked && { backgroundColor: background || Colors.primary }) || { backgroundColor: Colors.lightGray })} >
    <img src={(checked && srcActive) || src} style={styles.img} alt="checkbox" />
  </Avatar>;

@Radium
export default class ImageCheckbox extends Component {
  static propTypes = {
    checked: React.PropTypes.bool,
    onCheck: React.PropTypes.func,
    name: React.PropTypes.string,
    value: React.PropTypes.any,
    src: React.PropTypes.string,
    srcActive: React.PropTypes.string,
    label: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    style: React.PropTypes.object,
    background: React.PropTypes.string,
    type: React.PropTypes.string,
  };

  toggleCheckbox() {
    const { checked, onCheck } = this.props;
    onCheck(null, !checked);
  }
  render() {
    const { name, checked, src, srcActive, label, style, background } = this.props;
    return (
      <label
        htmlFor={name}
        style={styles.label}
        onClick={() => this.toggleCheckbox()}
      >
        {getAvatar(checked, background, src, srcActive)}
        <div style={{ color: style.color || 'black' }}>
          {label}
        </div>
      </label>
    );
  }
}

const styles = {
  display: 'none',
  label: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '10px',
    marginRight: '15px',
    width: '100px',
    textAlign: 'center',
    cursor: 'pointer',
  },
  avatar: {
    border: `2px solid ${Colors.gray}`,
    marginTop: '15px',
    marginBottom: '5px',
  },
  img: {
    maxWidth: '40px',
    maxHeight: '40px',
  },
};
