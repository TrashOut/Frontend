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
import MenuItem from 'material-ui/MenuItem';
import Radium from 'radium';
import React, { PureComponent as Component } from 'react';
import SelectField from 'material-ui/SelectField';

const style = {
  position: 'relative',
  display: 'flex',
  width: '98%',
  paddingLeft: '1%',
  paddingRight: '1%',
  paddingBottom: '1%',
  paddingTop: '1%',
  justifyContent: 'space-between',
  alignItems: 'center',
  active: {
    backgroundColor: Colors.secondary,
  },
  pagination: {
    textAlign: 'right',
  },
  floatingLabel: {
    whiteSpace: 'nowrap',
  },
};


@Radium
export default class Pagination extends Component {
  static propTypes = {
    active: React.PropTypes.number,
    label: React.PropTypes.string,
    limit: React.PropTypes.number,
    limits: React.PropTypes.array,
    onLimitChange: React.PropTypes.func,
    onPageChange: React.PropTypes.func,
    padding: React.PropTypes.any,
    pages: React.PropTypes.number,
    showPageLimit: React.PropTypes.bool,
  };

  render() {
    const {
      active,
      label,
      limit,
      limits,
      onLimitChange,
      onPageChange,
      padding,
      pages,
      showPageLimit,
    } = this.props;

    const content = [];
    let startIndex = active - padding;
    let endIndex = active + padding;

    while (startIndex < 1) startIndex += 1;
    while (endIndex > pages) endIndex -= 1;

    for (let i = startIndex; i <= endIndex; i += 1) {
      content.push(
        <li
          className={active === i ? 'active' : 'waves-effect'}
          style={active === i ? style.active : {}}
          key={i}
        >
          <a
            href={`#page-${i}`}
            onClick={() => onPageChange(i)}
          >
            {i}
          </a>
        </li>);
    }
    return (
      <div style={style}>
        {showPageLimit &&
          <SelectField
            value={limit}
            onChange={(e, i, v) => onLimitChange(v)}
            floatingLabelFixed={Boolean(false)}
            floatingLabelText={label}
            floatingLabelStyle={style.floatingLabel}
          >
            {limits.map((value, key) => <MenuItem key={key} value={value} primaryText={value} />)}
          </SelectField>
        }
        <ul className="pagination" style={style.pagination}>
          <li className={(active === 1) ? 'disabled' : 'waves-effect'}>
            <a href={`#page=${active - 1}`} onClick={() => (active !== 1) && onPageChange(active - 1)}>
              <i className="material-icons">chevron_left</i>
            </a>
          </li>
          {content}
          <li className={(active === pages) ? 'disabled' : 'waves-effect'}>
            <a href={`#page=${active + 1}`} onClick={() => (active !== pages) && onPageChange(active + 1)}>
              <i className="material-icons">chevron_right</i>
            </a>
          </li>
        </ul>
      </div>
    );
  }
}
