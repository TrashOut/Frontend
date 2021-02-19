/**
 * TRASHOUT IS an environmental project that teaches people how to recycle
 * and showcases the worst way of handling waste - illegal dumping. All you need is a smart phone.
 *
 * FOR PROGRAMMERS: There are 10 types of programmers -
 * those who are helping TrashOut and those who are not. Clean up our code,
 * so we can clean up our planet. Get in touch with us: help@trashout.ngo
 *
 * Copyright 2020 TrashOut, n.f.
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
import {
  joinOrganization,
  leaveOrganization
} from '../../common/organizations/actions';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { RadioButton } from 'material-ui/RadioButton';
import { RadioButtonGroup } from "material-ui";
import routesList from "../routesList";

@translate
@connect(null, { push, joinOrganization, leaveOrganization })
export default class EditUser extends Component {
  static propTypes = {
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired,
    match: React.PropTypes.object,
    joinOrganization: React.PropTypes.func,
    leaveOrganization: React.PropTypes.func,
  };

  state = {
    selected: null
  }

  @autobind
  componentWillMount() {
    const { match } = this.props;
    this.setState({ selected: match.params.val });
  }

  @autobind
  onChange(event, value) {
    this.setState({ selected: value });
  }

  submit() {
    const { match, joinOrganization, leaveOrganization, push } = this.props;

    const organizationId = match.params.id;
    const userId = match.params.userId;
    const option = this.state.selected;

    if (option == '0') {
      leaveOrganization(organizationId, userId);
    } else {
      joinOrganization(organizationId, userId, option);
    }

    push(routesList.organizationsDetail.replace(':id', match.params.id));
  }

  render() {
    const { msg, push } = this.props;
    const { selected } = this.state;

    const buttons = [
      <FlatButton type="button" label={msg('global.cancel')} onClick={() => push('../../')} />,
      <FlatButton type="submit" primary={Boolean(true)} label={msg('global.save')} onClick={() => this.submit()} />,
    ];

    return (
      <Dialog
        title={msg('organizations.changeUserRole')}
        actions={buttons}
        open={Boolean(true)}
        autoScrollBodyContent
        actionsContainerStyle={{ borderTop: '0' }}
        titleStyle={{ borderBottom: '0' }}
      >
        <div style={style.options}>

          <RadioButtonGroup name="role" valueSelected={selected} onChange={this.onChange}>
            <RadioButton
              value="1"
              label={msg('organizations.changeUserRole.manager')}
              style={style.options.radioButton}
            />
          </RadioButtonGroup>
          <div style={style.options.desc}>{msg('organizations.changeUserRole.manager.desc')}</div>

          <RadioButtonGroup name="role" valueSelected={selected} onChange={this.onChange}>
            <RadioButton
              value="2"
              label={msg('organizations.changeUserRole.member')}
              style={style.options.radioButton}
            />
          </RadioButtonGroup>
          <div style={style.options.desc}>{msg('organizations.changeUserRole.member.desc')}</div>

          <RadioButtonGroup name="role" valueSelected={selected} onChange={this.onChange}>
            <RadioButton
              value="0"
              label={msg('organizations.changeUserRole.delete')}
              style={style.options.radioButton}
            />
          </RadioButtonGroup>
          <div style={style.options.desc}>{msg('organizations.changeUserRole.delete.desc')}</div>

        </div>
      </Dialog>
    );
  }
}

const style = {
  options: {
    margin: '40px 30px 10px 30px',
    radioButton: {
      fontWeight: 'bold',
    },
    desc: {
      marginLeft: '40px',
      marginBottom: '20px',
    },
  },
}
