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
import Colors from '../../common/app/colors';
import Filter from './form/Filter';
import Paper from 'material-ui/Paper';
import Radium from 'radium';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import SecondAppBar from '../app/components/SecondAppBar';
import Table from '../app/components/Table';
import translate from '../../messages/translate';
import { connect } from 'react-redux';
import { fetchArticleList } from '../../common/articles/actions';
import { toggleFilter, setFilter, setTable } from '../../common/table/actions';
import withRole from '../../common/app/withRole';
import { languages } from '../../common/consts';

@translate
@connect(state => ({
  showFilter: state.table.showFilter,
  filter: state.table.filter,
  data: state.table.map,
}), { setFilter, toggleFilter, setTable, fetchArticleList })
@withRole()
@Radium
export default class ListPage extends Component {
  static propTypes = {
    data: React.PropTypes.object,
    fetchArticleList: React.PropTypes.func,
    filter: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    setFilter: React.PropTypes.func,
    setTable: React.PropTypes.func,
    showFilter: React.PropTypes.bool,
    toggleFilter: React.PropTypes.func,
    roles: React.PropTypes.object,
  };
  componentWillMount() {
    const { setTable, fetchArticleList } = this.props;
    setTable('TABLE_TYPE_ARTICLE');
    fetchArticleList();
  }

  componentWillUpdate(nextProps) {
    const { fetchArticleList, filter } = this.props;
    if (nextProps.filter !== filter) {
      fetchArticleList();
    }
  }

  render() {
    const { data, msg, setFilter, showFilter, toggleFilter, roles } = this.props;
    return (
      <div>
        <SecondAppBar
          rightUpperButtons={[
            {
              name: 'filter',
              label: msg(showFilter ? 'global.hideFilter' : 'global.showFilter'),
              onClick: toggleFilter,
            },
            roles.isAuthorized('manager') && {
              name: 'add',
              label: msg('global.create'),
              linkTo: routesList.articleCreate,
            },
          ].filter(notNull => notNull)}
        />
        <div className="main-content">
          <Paper
            style={{
              ...style.wrapper,
              ...(showFilter ? {} : style.wrapper.hidden),
            }}
          >
            <Filter
              onSubmit={(values) => setFilter(values)}
            />
          </Paper>
          <br />
          <Paper style={style}>
            <Table
              header={{
                title: { label: msg('news.title'), sortable: true },
                created: { label: msg('news.created'), sortable: true, type: 'date' },
                language: { label: msg('news.language'), sortable: true },
                id: { label: msg('news.id'), sortable: true },
              }}
              data={data}
              showLinkButton={Boolean(true)}
              urlTemplate={routesList.articleDetail.replace(':id', '{id}')}
              hasPrimaryColor
              translatedFields={{
                language: Object.keys(languages).map(key => ({ ...languages[key], id: languages[key].globalId }))
                        .reduce((acc, cur) => {
                          acc[cur.id] = cur;
                          return acc;
                        }, {}),
              }}
            />
          </Paper>
        </div>
      </div>
    );
  }
}

const style = {
  wrapper: {
    marginBottom: '20px',
    padding: '3%',
    zIndex: '0',
    display: 'block',
    hidden: {
      display: 'none',
    },
  },
  tabs: {
    backgroundColor: Colors.secondary,
  },
  inkBar: {
    backgroundColor: Colors.orange,
  },
};
