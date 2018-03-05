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
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import Table from '../app/components/Table';
import translate from '../../messages/translate';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { unsetRoot } from '../../common/areas/actions';
import { withRouter } from 'react-router';
import { areaTypes } from '../../common/consts';

@withRouter
@translate
@connect(state => ({
  isAreaFetching: state.areas.isAreaFetching,
  item: state.areas.item,
  aliases: state.areas.item && state.areas.item.aliases,
}), { push, unsetRoot })
export default class Aliases extends Component {
  static propTypes = {
    aliases: React.PropTypes.any,
    fetchArea: React.PropTypes.func,
    isAreaFetching: React.PropTypes.bool,
    item: React.PropTypes.object,
    match: React.PropTypes.func.object,
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired,
    unsetRoot: React.PropTypes.func,
  };
  static contextTypes = {
    router: React.PropTypes.object,
  }

  @autobind
  removeAlias(i) {
    const { item, unsetRoot } = this.props;
    unsetRoot(i.id, item.id);
  }

  render() {
    const { aliases, msg, isAreaFetching, match, push, item } = this.props;
    if (isAreaFetching) return null;

    const areas = Object.keys(areaTypes);
    const shownColumns = areas.indexOf(item.type);
    const columns = {};

    for (let i = shownColumns + 1; i > shownColumns - 3; i -= 1) {
      if (areas[i]) columns[areas[i]] = { label: msg(`geo.${areas[i]}`), sortable: false };
    }

    columns.remove = {
      label: msg('geo.removeAlias'),
      sortable: false,
      type: 'button',
      onClick: this.removeAlias,
      linkName: msg('geo.removeAlias'),
    };

    return (
      <div>
        {(aliases && aliases.length > 0) ?
          <Paper>
            <Table
              isPagination={Boolean(false)}
              header={columns}
              data={aliases}
              showLinkButton={Boolean(false)}
              isLocal={Boolean(true)}
              selectable={Boolean(false)}
            />
          </Paper>
          :
          <div style={style.button}>
            <p>{msg('geo.noAliasExists')}</p>
            <RaisedButton
              onClick={() => push(routesList.areaAddAlias.replace(':id', match.params.id))}
              fullWidth
            >
              {msg('geo.addAlias')}
            </RaisedButton>
          </div>
        }
      </div>
    );
  }
}

const style = {
  button: {
    width: '40%',
    marginLeft: '30%',
    height: '30px',
    marginTop: '5%',
    textAlign: 'center',
  },
};
