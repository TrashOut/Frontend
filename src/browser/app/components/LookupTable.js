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
import React from 'react';
import Table from './Table';
import translate from '../../../messages/translate';

const LookupTable = ({ values, attributes, showRemove, onRemove, msg }) => {
  if (!values) return null;

  const header = attributes.reduce((prev, current) => {
    prev[current] = { label: current, sortable: false };
    return prev;
  }, {});

  if (showRemove) {
    header.remove = {
      type: 'button',
      label: msg('global.remove'),
      sortable: false,
      linkName: msg('global.remove'),
      onClick: (item) => onRemove(item.id),
    };
  }
  return (
    <Table
      isPagination={Boolean(false)}
      header={header}
      data={Object.keys(values).reduce((prev, cur) => prev.concat(values[cur]), [])}
      showLinkButton={Boolean(false)}
      isLocal={Boolean(true)}
      selectable={Boolean(false)}
    />
  );
};

LookupTable.propTypes = {
  values: React.PropTypes.object,
  attributes: React.PropTypes.array,
  showRemove: React.PropTypes.bool,
  onRemove: React.PropTypes.func,
  item: React.PropTypes.object,
  msg: React.PropTypes.func.isRequired,
};


export default translate(LookupTable);
