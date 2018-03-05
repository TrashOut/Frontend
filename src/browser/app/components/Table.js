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
import ArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';
import ArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';
import Checkbox from 'material-ui/Checkbox';
import CircularProgress from 'material-ui/CircularProgress';
import Colors from '../../../common/app/colors';
import Divider from 'material-ui/Divider';
import ImagePreview from './ImagePreview';
import IntlMessageFormat from 'intl-messageformat';
import Link from '../components/Link';
import Pagination from './Pagination';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import React, { PureComponent as Component } from 'react';
import translate from '../../../messages/translate';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { FormattedRelative } from 'react-intl';
import { setPageLimit, toggleOrderBy, selectAll, select, setPage, onSort } from '../../../common/table/actions';
import { Table as MuiTable, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

@Radium
class HeaderCell extends Component {
  static propTypes = {
    hasPrimaryColor: React.PropTypes.bool,
    id: React.PropTypes.any,
    onSort: React.PropTypes.func,
    orderBy: React.PropTypes.number,
    sortable: React.PropTypes.bool,
    style: React.PropTypes.object,
    value: React.PropTypes.any,
    hide: React.PropTypes.bool,
  };

  render() {
    const { hide, id, value, onSort, orderBy, sortable, style: customStyle, hasPrimaryColor } = this.props;
    if (hide) return null;
    return (
      <div
        style={[
          style.tableHeaderColumn.wrapper,
          customStyle,
        ]}
      >
        <TableHeaderColumn
          className={`table-header-column ${hasPrimaryColor ? 'primary' : 'secondary'} ${sortable ? 'sortable' : 'unsortable'}`}
          onClick={() => sortable && onSort(id)}
          style={orderBy !== -1 ? { backgroundColor: hasPrimaryColor ? Colors.primary : 'rgb(224, 224, 224)' } : { }}
        >
          <div style={style.align}>
            { value }
            { (orderBy === 1) && <ArrowDownward style={style.icon} /> }
            { (orderBy === 0) && <ArrowUpward style={style.icon} /> }
          </div>
        </TableHeaderColumn>
      </div>
    );
  }
}

const convertToDotNotaion = (object) => {
  const res = {};
  const recurse = (obj, current) => {
    Object.keys(obj).forEach(x => {
      const value = obj[x];
      const newKey = (current ? `${current}/${x}` : x);
      if (value && typeof value === 'object') {
        recurse(value, newKey);
      } else {
        res[newKey] = value;
      }
    });
  };
  recurse(object);
  return res;
};

const formattedMessage = (message, values) => {
  const messageFormat = new IntlMessageFormat(message.replace(/\./g, '/'), 'en');
  try {
    return messageFormat.format(values);
  } catch (error) {
    return ' ';
  }
};

@translate
@connect(state => ({
  dynamicData: {
    count: state.table.count,
    filter: state.table.filter,
    isFetching: state.table.isFetching,
  },
}), { setPageLimit, toggleOrderBy, selectAll, select, setPage, onSort })
@Radium
export default class Table extends Component { // eslint-disable-line react/no-multi-comp
  static propTypes = {
    count: React.PropTypes.number,
    data: React.PropTypes.object,
    dynamicData: React.PropTypes.object,
    filter: React.PropTypes.any,
    hasPrimaryColor: React.PropTypes.bool,
    header: React.PropTypes.object,
    isFetching: React.PropTypes.bool,
    isLocal: React.PropTypes.bool,
    isManual: React.PropTypes.bool,
    isPagination: React.PropTypes.bool,
    msg: React.PropTypes.func.isRequired,
    noResultMessage: React.PropTypes.string,
    onPageChange: React.PropTypes.func,
    select: React.PropTypes.func,
    selectable: React.PropTypes.bool,
    selectAll: React.PropTypes.func,
    setPage: React.PropTypes.func,
    setPageLimit: React.PropTypes.func,
    showLinkButton: React.PropTypes.bool,
    staticData: React.PropTypes.object,
    toggleOrderBy: React.PropTypes.func,
    translatedFields: React.PropTypes.object,
    urlTemplate: React.PropTypes.string,
  };

  @autobind
  onPageChange(page) {
    const { setPage } = this.props;
    setPage(page);
  }

  @autobind
  onLimitChange(limit) {
    const { setPageLimit } = this.props;
    setPageLimit(limit);
    this.onPageChange(1);
  }

  getMessage(obj, val, useObjectAsValue) {
    const { msg, translatedFields } = this.props;

    const possibilities = translatedFields && translatedFields[val];
    const value = useObjectAsValue ? obj : obj[val];

    if (!possibilities) return value;

    return (possibilities[value] && msg(possibilities[value].message)) || msg('global.other');
  }


  render() {
    const {
      data: propsData,
      dynamicData,
      hasPrimaryColor,
      isLocal: propsLocal,
      isManual,
      isPagination: propsPagination,
      msg,
      noResultMessage,
      select,
      selectable,
      showLinkButton,
      staticData,
      toggleOrderBy,
      urlTemplate,
    } = this.props;

    const { count, filter, isFetching: propsIsFetching } = isManual ? staticData : dynamicData;

    let { header } = this.props;
    const isPagination = !(propsPagination === false);
    const isFetching = (propsLocal !== true) ? propsIsFetching : false;
    const isSelectable = (selectable === undefined) ? true : !propsLocal && selectable;

    const data = (typeof propsData.toArray === 'function' && propsData.toArray()) || (Array.isArray(propsData) && propsData);
    if (!data) return null;

    if (showLinkButton) header = Object.assign(header, { link: { label: msg('global.showDetail'), sortable: false, type: 'detailLink' } });
    const headers = Object.keys(header);

    const headerRowItems = headers.map((val) =>
      <HeaderCell
        key={val}
        id={header[val].orderBy || val}
        value={header[val].label}
        sortable={header[val].sortable}
        orderBy={filter && filter.orderBy.indexOf(header[val].orderBy || val)}
        onSort={(value) => toggleOrderBy(value)}
        style={header[val].style || {}}
        hasPrimaryColor={hasPrimaryColor}
        hide={header[val].hide}
      />).filter(x => x);

    const rows = !isFetching && data.map((val, k) =>
      <TableRow key={val.id || k}>
        {isSelectable &&
          <td style={style.table.header.checkbox}>
            <Checkbox
              // onCheck={() => isSelectable && select(val.id)}
              checked={val.selected}
            />
          </td>
        }
        {headers.map((val2, key) => {
          let content = null;
          if (!header[val2] || header[val2].hide) return null;
          const type = header[val2].type;
          const linkName = header[val2].linkName;
          const template = header[val2].template;
          const params = header[val2].params;
          const onClick = header[val2].onClick;
          const style = header[val2].style;
          const calculatedValue = header[val2].calculatedValue;
          const areaDescription = header[val2].areaDescription;

          const value = (typeof val.toJS === 'function') ? val.toJS() : val;
          const dottedValue = convertToDotNotaion(value);

          if (type === 'detailLink') {
            content = <Link to={`${formattedMessage(urlTemplate, { id: val.id })}`}>{msg('global.detail')}</Link>;
          } else if (type === 'link') {
            content = <Link to={`${formattedMessage(template, (params || value))}`}>{(linkName && value && formattedMessage(linkName, value)) || val[val2]}</Link>;
          } else if (type === 'buttonLink') {
            content = <Link onClick={() => onClick && onClick(val)}>{(linkName && value && formattedMessage(linkName, value)) || val[val2]}</Link>;
          } else if (type === 'button') {
            content = (<RaisedButton
              onClick={() => onClick && onClick(val)}
              label={formattedMessage(linkName, value)}
              labelStyle={{ fontSize: '12px', fontWeight: 'normal' }}
              style={{ marginLeft: 'auto' }}
            />);
          } else if (type === 'date') {
            content = <FormattedRelative value={val[val2]}>{(value) => <span>{capitalizeFirstLetter(value)}</span>}</FormattedRelative>;
          } else if (type === 'image' || type === 'trashImage' || type === 'organizationImage') {
            content = (<ImagePreview
              data={[{
                src: val[val2]
                  || (type === 'organizationImage' && (val.image || {}).fullDownloadUrl && val.image)
                  || (val.images || [])[0]
                  || ((type === 'organizationImage' || type === 'trashImage') ? '/img/logo_leaf_small.png' : '/img/users/noAvatar.jpg'),
                id: '1',
              }]}
              cols={1}
              rows={1}
              showDelete={Boolean(false)}
              gridStyle={{ maxWidth: '120px', height: '70px', overflow: 'hidden', marginTop: '4px', marginBottom: '4px' }}
              autoWidth
              center
            />);
          } else if (type === 'calculated') {
            content = (calculatedValue && this.getMessage(calculatedValue(val), val2, true)) || '';
          } else if (type === 'area') {
            const area = (value.gps || { area: {} }).area;
            content = area && formattedMessage(areaDescription, area[0] || (area.toJS ? area.toJS() : area));
          } else {
            content = (linkName && formattedMessage(linkName, dottedValue)) || this.getMessage(val, val2);
          }
          return (<TableRowColumn
            style={style || {}}
            key={`${key}_${k}`}
          >
            {content}
          </TableRowColumn>);
        })
      }
      </TableRow>
    );

    const isAllSelected = () => {
      if (isFetching) return false;
      const array = data;
      for (let i = 0; i < array.length; i += 1) {
        if (!array[i].selected) return false;
      }
      return true;
    };

    return (
      <div>
        <div style={{ overflowX: 'auto', overflowY: 'auto' }}>
          <div style={{ minWidth: '700px' }}>
            <MuiTable
              selectable={Boolean(false)}
              multiSelectable={Boolean(false)}
              onCellClick={(value) => isSelectable && select(value)}
              onRowSelection={(value) => isSelectable && (value === 'all' || value === 'none') && select(value)}
              className="mui-table"
            >
              <TableHeader
                displaySelectAll={Boolean(false)}
                adjustForCheckbox={Boolean(false)}
                enableSelectAll={Boolean(false)}
                style={{ background: hasPrimaryColor ? Colors.secondary : '#f5f5f5' }}
              >
                <TableRow>
                  {[isSelectable && <th key="checkbox" style={style.table.header.checkbox}>
                    <Checkbox
                      onCheck={(e, checked) => isSelectable && select((checked && 'all') || 'none')}
                      checked={isAllSelected(data)}
                    />
                  </th>,
                    ...headerRowItems]}
                </TableRow>
              </TableHeader>
              <TableBody
                displayRowCheckbox={Boolean(false)}
                deselectOnClickaway={Boolean(false)}
                showRowHover={Boolean(true)}
                stripedRows={Boolean(false)}
              >
                {(isFetching &&
                  <CircularProgress
                    size={80}
                    thickness={5}
                    style={style.loader}
                    color={Colors.secondary}
                  />)
                  || (rows.length === 0 &&
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      {noResultMessage || msg('global.noResult')}
                    </div>
                    )
                  || rows
                }
              </TableBody>
            </MuiTable>
          </div>
        </div>
        <Divider />
        {isPagination &&
          <div style={style.footer}>
            <Pagination
              pages={Math.ceil(count / filter.limit)}
              padding={1}
              active={filter.page}
              onPageChange={this.onPageChange}
              onLimitChange={this.onLimitChange}
              showPageLimit={Boolean(true)}
              label={msg('global.itemsPerPage')}
              limits={[10, 20, 40, 80, 160, 320]}
              limit={filter.limit}
            />
          </div>
        }
      </div>
    );
  }
}

const style = {
  table: {
    header: {
      checkbox: {
        width: '24px',
        padding: '0 24px',
      },
      cell: {
        width: '20px!important',
        padding: '0!important',
      },
      row: {
        backgroundColor: '#f5f5f5',
        color: 'black!important',
        height: '10px!important',
      },
    },
    footer: {
      width: '96%',
      marginLeft: '2%',
      marginRight: '2%',
      marginTop: '10px',
      paddingBottom: '20px',
    },
    cell: {
      wordWrap: 'break-word!important',
      whiteSpace: 'normal!important',
    },
  },
  loader: {
    width: '100%',
    textAlign: 'center',
    margin: '20px',
  },
  align: {
    display: 'flex',
    alignItems: 'center',
    wordWrap: 'break-word!important',
    whiteSpace: 'normal!important',
  },
  icon: {
    width: '14px',
    height: '14px',
    marginLeft: '5px',
  },
  tableHeaderColumn: {
    wrapper: {
      display: 'table-cell',
      paddingRight: '48px',
    },
  },
};
