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
import Input from '../app/components/Input';
import Paper from 'material-ui/Paper';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import SecondAppBar from '../app/components/SecondAppBar';
import translate from '../../messages/translate';
import { changePassword } from '../../common/lib/redux-firebase/actions';
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';
import { push } from 'react-router-redux';
import { validatePassword as validate } from '../../common/auth/validate';

@translate
@connect(state => ({
  isFetching: state.users.isFetching,
}), { push, change, changePassword })
@reduxForm({
  form: 'change_password',
  validate,
})
@Radium
export default class ChangePassword extends Component {
  static propTypes = {
    changePassword: React.PropTypes.func,
    handleSubmit: React.PropTypes.func,
    msg: React.PropTypes.func.isRequired,
    push: React.PropTypes.func,
    submitting: React.PropTypes.bool,
    user: React.PropTypes.any,
  };

  render() {
    const { push, handleSubmit, changePassword, submitting, msg } = this.props;

    return (
      <div>
        <div>
          <SecondAppBar
            noContent
          />
          <div className="main-content">
            <Paper style={style.main}>
              <form onSubmit={handleSubmit(values => changePassword(values))}>
                <div className="col s12">
                  <div className="row">
                    <div className="col s12">
                      <Field
                        name="oldPassword"
                        type="password"
                        component={Input}
                        label={msg('profile.oldPassword')}
                        hint={msg('profile.oldPassword')}
                      />
                    </div>
                    <div className="col s12">
                      <Field
                        name="password"
                        type="password"
                        component={Input}
                        label={msg('profile.newPassword')}
                        hint={msg('profile.newPassword')}
                      />
                    </div>
                    <div className="col s12">
                      <Field
                        name="password_validation"
                        type="password"
                        component={Input}
                        label={msg('user.reEnterPassword')}
                        hint={msg('user.reEnterPassword')}
                      />
                    </div>
                  </div>
                </div>
                <div className="col s12 m12 right-align">
                  <RaisedButton
                    type="button"
                    disabled={submitting}
                    label={msg('global.cancel')}
                    style={style.button}
                    onClick={() => push(routesList.myProfile)}
                  />
                  <RaisedButton
                    type="submit"
                    disabled={submitting}
                    label={msg('global.update')}
                    style={style.button}
                    primary={Boolean(true)}
                  />
                </div>
              </form>
            </Paper>
          </div>
        </div>
      </div>
    );
  }
}

const style = {
  main: {
    padding: '2%',
    gridList: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
  },
  topIndentation: {
    marginTop: '2%',
  },
  social: {
    float: 'left',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    margin: '4px 0',
    icon: {
      marginRight: '10px',
      width: '32px',
      height: '32px',
    },
  },
  history: {
    padding: '1%',
    float: 'left',
    width: '100%',
    marginBottom: '2%',
    record: {
      header: {
        width: '100%',
        float: 'left',
        left: {
          float: 'left',
          padding: '0',
          margin: '0',
        },
        right: {
          float: 'right',
        },
      },
      content: {
        width: '%',
        gridList: {
          display: 'flex',
          flexWrap: 'nowrap',
          overflowX: 'auto',
        },
      },
    },
  },
  button: {
    marginLeft: '12px',
    fontSize: '0.8em',
  },
};
