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
import { Field, reduxForm, formValueSelector, touch } from 'redux-form';
import { formRemoveImage } from '../../../common/forms/actions';
import { validateCreate, asyncValidate } from '../../../common/collectionpoints/validate';

const selector = formValueSelector('collectionPointCreate');

@translate
@reduxForm({
  form: 'collectionPointCreate',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate: validateCreate,
  asyncValidate,
  asyncBlurFields: ['images'],
})
@connect(state => ({
  currentImage: selector(state, 'currentImage'),
  files: selector(state, 'images'),
}), { touch, formRemoveImage })
export default class FormThird extends Component {
  static propTypes = {
    currentImage: React.PropTypes.object,
    files: React.PropTypes.array,
    formRemoveImage: React.PropTypes.func,
    handleSubmit: React.PropTypes.func,
    msg: React.PropTypes.func.isRequired,
    previousPage: React.PropTypes.func,
    touch: React.PropTypes.func,
  }

  render() {
    const { currentImage, handleSubmit, files, touch, formRemoveImage, previousPage, msg } = this.props;

    const isFormImage = files && touch('images');
    const isCurrentImage = currentImage && currentImage.fullDownloadUrl;
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
                onClick={() => formRemoveImage('collectionPointCreate', 0)}
                withoutControls
              />
            </div>
          }
          <div className="col s12">
            <Field
              accept="image/*"
              component={Input}
              files={files}
              label={msg('global.images')}
              multiple={Boolean(false)}
              name="images"
              type="file"
              description={msg('global.images')}
            />
          </div>
        </div>
        <div className="row col s12">
          <div className="right-align">
            <RaisedButton type="button" style={styles.button} label={msg('global.back')} onClick={previousPage} />
            <RaisedButton type="submit" style={styles.button} label={msg('global.save')} primary={Boolean(true)} />
          </div>
        </div>
      </form>
    );
  }
}

const styles = {
  preview: {
    padding: '1%',
    marginRight: '2%',
    wrapper: {
      width: '100%',
    },
    image: {
      maxWidth: '100%',
      maxHeight: '200px',
    },
    remove: {
      color: 'red',
      float: 'right',
      marginBottom: '1%',
    },
  },
  button: {
    marginLeft: '12px',
    fontSize: '0.8em',
  },
};
