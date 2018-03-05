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
import React, { PureComponent as Component } from 'react';
import translate from '../../../messages/translate';
import Radium from 'radium';

const Th = Radium(({ children }) => <th style={styles.th}>{children}</th>);
const Td = Radium(({ children }) => <td style={styles.th}>{children}</td>);

@translate
@Radium
export default class Table extends Component {
  static propTypes = {
    columnHeader: React.PropTypes.array,
    data: React.PropTypes.array,
    msg: React.PropTypes.func.isRequired,
    rowHeader: React.PropTypes.array,
  };

  render() {
    const { columnHeader, rowHeader, data } = this.props;
    return (
      <table style={styles.table}>
        { rowHeader &&
          <tr>
            {columnHeader && <Th />}
            {rowHeader.map(x => <Th>{x}</Th>)}
          </tr>
        }
        {
          data.map((x, key) =>
            <tr>
              {columnHeader && <Th>{columnHeader[key]}</Th>}
              {x.map(y => <Td>{y}</Td>)}
            </tr>
          )
        }
      </table>
    );
  }
}

Th.propTypes = Td.propTypes = {
  children: React.PropTypes.object,
};

const styles = {
  table: {
    fontSize: '14px',
  },
  th: {
    padding: '5px 5px',
  },
};
