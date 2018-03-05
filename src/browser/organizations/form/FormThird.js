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
import ImagePreview from '../../app/components/ImagePreview';
import Input from '../../app/components/Input';
import RaisedButton from 'material-ui/RaisedButton';
import React, { PureComponent as Component } from 'react';
import translate from '../../../messages/translate';
import { connect } from 'react-redux';
import { Field, reduxForm, touch, formValueSelector, change } from 'redux-form';
import { formRemoveImage } from '../../../common/forms/actions';
import { validateCreate, asyncValidate } from '../../../common/organizations/validate';

const selector = formValueSelector('organization');

@translate
@connect(state => ({
  files: selector(state, 'images'),
  currentImage: selector(state, 'currentImage'),
  data: state.table.map,
  isFetching: state.table.isFetching,
}), {
  formRemoveImage,
  change,
})
@reduxForm({
  form: 'organization',
  validate: validateCreate,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  asyncValidate,
  asyncBlurFields: ['images'],
})
export default class Form extends Component {
  static propTypes = {
    change: React.PropTypes.func,
    data: React.PropTypes.object,
    email: React.PropTypes.string,
    fetchOrganizationList: React.PropTypes.func,
    files: React.PropTypes.array,
    handleSubmit: React.PropTypes.func,
    isFetching: React.PropTypes.bool,
    managers: React.PropTypes.array,
    msg: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
    setTable: React.PropTypes.func,
    usersFetching: React.PropTypes.bool,
    previousPage: React.PropTypes.func.isRequired,
    currentImage: React.PropTypes.object,
  };

  render() {
    const {
      change,
      files,
      handleSubmit,
      msg,
      data,
      isFetching,
      previousPage,
      currentImage,
    } = this.props;

    if (isFetching || !data) return null;

    const isFormImage = files && touch('images');
    const isCurrentImage = (currentImage || {}).fullDownloadUrl;
    const formImageData = () => files.map((image, key) => ({
      id: key,
      src: image.preview,
      ...image,
    }));

    const currentImageData = () => ([{ src: currentImage.fullDownloadUrl, id: '1', title: '' }]);

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          {(isFormImage || isCurrentImage) &&
            <div className="col s12">
              <h4>{msg('global.currentImage')}</h4>
              <ImagePreview
                data={isFormImage ? formImageData() : currentImageData()}
                carousel
                showDelete={isFormImage}
                onClick={() => change('images', null)}
                withoutControls
              />
            </div>
          }
          <div className="col s12">
            <Field
              name="images"
              component={Input}
              type="file"
              label={msg('organization.logo')}
              hint={msg('global.selectFile')}
              accept="image/*"
              multiple={Boolean(false)}
            />
          </div>
        </div>
        <div className="row col s12">
          <div className="right-align">
            <RaisedButton
              type="button"
              style={styles.button}
              label={msg('global.back')}
              onClick={previousPage}
            />
            <RaisedButton
              type="submit"
              style={styles.button}
              label={msg('global.nextStep')}
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
  preview: {
    flexBasis: '25%',
    padding: '1%',
    marginRight: '2%',
    wrapper: {
      width: '100%',
      float: 'left',
      position: 'relative',
      display: 'flex',
      justifyContent: 'flex-start',
    },
    image: {
      width: '100%',
    },
    remove: {
      color: 'red',
      float: 'right',
      marginBottom: '1%',
    },
  },
};

