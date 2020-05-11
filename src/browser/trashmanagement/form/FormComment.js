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
import Input from '../../app/components/Input';
import RaisedButton from 'material-ui/RaisedButton';
import React, { PureComponent as Component } from 'react';
import translate from '../../../messages/translate';
import { Field, reduxForm } from 'redux-form';
import { validateComment } from '../../../common/trashmanagement/validate';
import {connect} from "react-redux";

@translate
@connect(state => ({
  viewer: state.users.viewer
}), null)
@reduxForm({
  form: 'commentForm',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate: validateComment,
})
export default class Form extends Component {
  static propTypes = {
    handleSubmit: React.PropTypes.func,
    msg: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func,
    viewer: React.PropTypes.object,
  };

  render() {
    const {
      handleSubmit,
      msg,
      onCancel,
      viewer,
    } = this.props;

    const organizations = viewer.organizations
      .filter(org => org.organizationRoleId == 1)
      .reduce((obj, val) => { obj[val.id] = val.name; return obj; }, {});

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <h3>{msg('comment.addComment')}</h3>
          <p>{msg('comment.intro')}</p>
          <div className="col s12">
            <Field
              name="body"
              component={Input}
              label={msg('comment.body')}
              type="mdText"
              toolbar={[
                'bold',
                'italic',
                'link',
              ]}
            />
          </div>
          <div className="col s12 m4">
            <Field
              name="organizationId"
              type="select"
              component={Input}
              items={organizations}
              label={msg('comment.commentAs')}
              translatedSelectPlaceholder={viewer.displayName}
            />
          </div>
        </div>
        <div className="col s12">
          <div className="right-align">
            <RaisedButton
              type="button"
              style={styles.button}
              label={msg('global.cancel')}
              onClick={onCancel}
            />
            <RaisedButton
              type="submit"
              style={styles.button}
              label={msg('global.create.send')}
              primary={Boolean(true)}
            />
          </div>
        </div>
      </form>
    );
  }
}

const styles = {
  button: {
    marginLeft: '12px',
  },
};
