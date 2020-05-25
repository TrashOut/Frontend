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
import ChangeEmail from './ChangeEmail';
import Confirm from '../app/components/Confirm';
import Cropper from 'react-cropperjs';
import ImagePreview from '../app/components/ImagePreview';
import Input from '../app/components/Input';
import Paper from 'material-ui/Paper';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import SecondAppBar from '../app/components/SecondAppBar';
import translate from '../../messages/translate';
import validate from '../../common/users/validate';
import { addConfirm } from '../../common/confirms/actions';
import { connect } from 'react-redux';
import { disableAccount, updateUser } from '../../common/users/actions';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { Match } from '../../common/app/components';
import { push } from 'react-router-redux';
import { Switch } from 'react-router-dom';
import { languages, trueFalse } from '../../common/consts';

const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

const selector = formValueSelector('user_edit');

@translate
@connect(state => ({
  fileToCrop: selector(state, 'fileToCrop'),
  note: selector(state, 'info'),
  currentImage: selector(state, 'currentImage') && selector(state, 'currentImage').fullDownloadUrl,
  isFetching: state.users.isFetching,
  initialValues: { ...state.users.viewer.toJS(), currentImage: state.users.viewer.image },
}), { addConfirm, disableAccount, change, push, updateUser })
@reduxForm({
  form: 'user_edit',
  enableReinitialize: true,
  validate,
})
@Radium
export default class Edit extends Component {
  static propTypes = {
    addConfirm: React.PropTypes.func,
    change: React.PropTypes.func,
    currentImage: React.PropTypes.object,
    disableAccount: React.PropTypes.func,
    fileToCrop: React.PropTypes.object,
    handleSubmit: React.PropTypes.func,
    initialValues: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    note: React.PropTypes.string,
    push: React.PropTypes.func,
    submitting: React.PropTypes.bool,
    updateUser: React.PropTypes.func,
    user: React.PropTypes.any,
  };

  state = {
    image: null,
  };

  render() {
    const {
      addConfirm,
      disableAccount,
      currentImage,
      push,
      msg,
      handleSubmit,
      fileToCrop,
      change,
      updateUser,
      submitting,
      initialValues,
    } = this.props;

    const filePreview = fileToCrop && fileToCrop[0] &&
      <div style={{ width: '100%' }}>
        <div style={{ marginBottom: '5px' }}>
          <Cropper
            ref={(image) => {
              this.setState({ image });
            }}
            src={fileToCrop[0].preview}
            style={{ height: 350, width: '100%' }}
            aspectRatio={1 / 1}
            guides={false}
            built={() => change('image', dataURItoBlob(this.state.image.getCroppedCanvas().toDataURL()))}
            cropend={() => change('image', dataURItoBlob(this.state.image.getCroppedCanvas().toDataURL()))}
            zoomable={Boolean(false)}
          />
        </div>
        <RaisedButton
          onClick={() => {
            change('image', null);
            change('fileToCrop', null);
          }}
          label={msg('global.remove')}
          secondary={Boolean(true)}
          fullWidth={Boolean(true)}
        />
      </div>;

    const menuButtons = [
      { name: 'removeAccount', label: msg('profile.removeAccount'), onClick: () => addConfirm('profile.disable', { onSubmit: () => disableAccount() }) },
      !initialValues.isSocialLogin && { name: 'changeEmail', label: msg('profile.changeEmail'), linkTo: routesList.userChangeEmail },
    ].filter(x => x);

    return (
      <div>
        <Confirm
          cancelLabel={msg('global.cancel')}
          submitLabel={msg('global.ok')}
          title={msg('profile.removeAccount')}
        />
        <Switch>
          <Match
            path={routesList.userChangeEmail}
            component={ChangeEmail}
          />
        </Switch>
        <div>
          <SecondAppBar
            title={msg('profile.edit.header')}
            rightUpperButtons={menuButtons}
          />
          <div className="main-content">
            <form onSubmit={handleSubmit(values => updateUser(values))}>
              <h2>{msg('profile.avatar')}</h2>
              <Paper style={styles.main}>
                <div className="row">
                  <div className="col m12">
                    {filePreview &&
                      <div className="col m4">
                        {filePreview}
                      </div>
                    }
                    {currentImage && !filePreview &&
                      <div className="col m4">
                        <ImagePreview
                          data={[{
                            src: currentImage,
                            id: '1',
                          }]}
                          cols={1}
                          rows={1}
                          padding={1}
                          showDelete={Boolean(false)}
                        />
                      </div>
                    }
                    <div className={`col m${currentImage || filePreview ? '8' : '12'}`}>
                      <Field
                        name="fileToCrop"
                        type="file"
                        component={Input}
                        label={msg('profile.edit.profileImage')}
                        accept="image/*"
                        multiple={Boolean(false)}
                        description={msg('profile.edit.profileImage')}
                        dismissHint
                      />
                    </div>
                  </div>
                </div>
              </Paper>
              <h2>{msg('profile.edit.mainInfo')}</h2>
              <Paper style={styles.main}>
                <div className="row">
                  <div className="col s12 m6">
                    <Field
                      name="firstName"
                      type="text"
                      component={Input}
                      label={msg('user.firstName')}
                      hint={msg('user.firstName')}
                    />
                  </div>
                  <div className="col s12 m6">
                    <Field
                      name="lastName"
                      type="text"
                      component={Input}
                      label={msg('user.lastName')}
                      hint={msg('user.lastName')}
                    />
                  </div>
                  <div className="col s12">
                    <Field
                      name="info"
                      type="text"
                      component={Input}
                      label={msg('user.aboutMe')}
                      multiLine={Boolean(true)}
                      rows={3}
                    />
                  </div>
                </div>
              </Paper>
              <h2>{msg('profile.edit.otherInfo')}</h2>
              <Paper style={styles.main}>
                <div className="row">
                  <div className="col s12 m6">
                    <Field
                      name="facebookUrl"
                      type="text"
                      component={Input}
                      label={msg('user.facebook')}
                      hint={msg('user.facebook.hint')}
                    />
                  </div>

                  <div className="col s12 m6">
                    <Field
                      name="twitterUrl"
                      type="text"
                      component={Input}
                      label={msg('user.twitter')}
                      hint={msg('user.twitter.hint')}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col s12 m6">
                    <Field
                      name="googlePlusUrl"
                      type="text"
                      component={Input}
                      label={msg('user.google')}
                      hint={msg('user.google.hint')}
                    />
                  </div>

                  <div className="col s12 m6">
                    <Field
                      name="phoneNumber"
                      type="phone"
                      component={Input}
                      label={msg('global.phone')}
                      hint={msg('global.phone.hint')}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col s12 m6">
                    <Field
                      name="birthdate"
                      type="date"
                      component={Input}
                      label={msg('user.birthday')}
                      hint={msg('user.birthday')}
                      maxDate={new Date()}
                    />
                  </div>
                  <div className="col s12 m6">
                    <Field
                      name="language"
                      type="select"
                      items={languages}
                      component={Input}
                      label={msg('user.language')}
                      hint={msg('user.language')}
                      selectPlaceholder="global.select"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col s12 m6">
                    <Field
                      name="volunteerCleanup"
                      type="radioList"
                      component={Input}
                      label={msg('user.volunteerCleanup')}
                      items={trueFalse}
                      inRow={Boolean(true)}
                    />
                  </div>

                  <div className="col s12 m6">
                    <Field
                      name="eventOrganizer"
                      type="radioList"
                      component={Input}
                      label={msg('user.eventOrganizer')}
                      items={trueFalse}
                      inRow={Boolean(true)}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col s12 m6">
                    <Field
                      name="trashActivityEmailNotification"
                      type="radioList"
                      component={Input}
                      label={msg('user.trashActivityEmailNotification')}
                      items={trueFalse}
                      inRow={Boolean(true)}
                    />
                  </div>
                </div>
                <div className="col s12 m12 right-align">
                  <RaisedButton
                    type="button"
                    disabled={submitting}
                    label={msg('global.cancel')}
                    style={styles.button}
                    onClick={() => push(routesList.myProfile)}
                  />
                  <RaisedButton
                    type="submit"
                    disabled={submitting}
                    label={msg('global.update')}
                    style={styles.button}
                    primary={Boolean(true)}
                  />
                </div>
              </Paper>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  main: {
    padding: '2%',
    marginTop: '2%',
    marginBottom: '2%',
  },
  button: {
    marginLeft: '12px',
    fontSize: '0.8em',
  },
};

