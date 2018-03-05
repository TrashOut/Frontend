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
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import React, { PureComponent as Component } from 'react';
import translate from '../../messages/translate';
import { autobind } from 'core-decorators';
import { ChildFilter, fields } from './form/Form';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { setRoot } from '../../common/areas/actions';
import { submit } from 'redux-form';

@translate
@connect(state => ({
  item: state.areas.item,
  items: state.areas.formOptions,
}), { push, submit, setRoot })
export default class Invite extends Component {
  static propTypes = {
    item: React.PropTypes.object,
    items: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired,
    setRoot: React.PropTypes.func,
    submit: React.PropTypes.func,
  };
  static contextTypes = {
    router: React.PropTypes.object,
  };

  @autobind
  onSubmit(values) {
    const { items, item, setRoot } = this.props;
    const array = Object.keys(values);

    for (let i = array.length - 1; i >= 0; i -= 1) {
      const index = array[i];
      if (values[index] !== 'all' && values[index] !== '') {
        const result = items.get(index).filter(x => x.label === values[index]);
        if (result.length === 0) {
          return;
        }
        if (fields.indexOf(index) < fields.indexOf(item.type)) {
          return;
        }
        setRoot(result[0].pathId, item.id);
        return;
      }
    }
    return;
  }

  render() {
    const { msg, push, submit } = this.props;

    const buttons = [
      <FlatButton type="button" label={msg('global.cancel')} onClick={() => push('../')} />,
      <FlatButton type="submit" primary={Boolean(true)} label={msg('geo.createAlias')} onClick={() => submit('childFilter')} />,
    ];

    return (
      <Dialog
        title={msg('geo.addAlias')}
        actions={buttons}
        open
        autoScrollBodyContent
        actionsContainerStyle={{ borderTop: '0' }}
        titleStyle={{ borderBottom: '0' }}
      >
        <p>{msg('geo.addAlias.description')}</p>
        <ChildFilter
          onSubmit={this.onSubmit}
        />
      </Dialog>
    );
  }
}
