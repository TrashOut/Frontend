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
import { formRemoveImage, setFirstImage } from '../../../common/forms/actions';
import { formValueSelector, Field, reduxForm, touch, change } from 'redux-form';
import { validate, asyncValidate } from '../../../common/articles/validate';

const selector = formValueSelector('article');

@translate
@connect(state => ({
  oldFiles: selector(state, 'oldImages'),
  files: selector(state, 'images'),
  videos: selector(state, 'prContentVideo') || [],
  mainImage: selector(state, 'mainImage'),
}), { setFirstImage, formRemoveImage, touch, change })
@reduxForm({
  form: 'article',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  asyncValidate,
  asyncBlurFields: ['images'],
})
export default class Form extends Component {
  static propTypes = {
    change: React.PropTypes.func,
    files: React.PropTypes.array,
    formRemoveImage: React.PropTypes.func,
    handleSubmit: React.PropTypes.func,
    mainImage: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    previousPage: React.PropTypes.func,
    submitting: React.PropTypes.bool,
    videos: React.PropTypes.array,
  };

  state = {
    videos: 0,
  };

  render() {
    const {
      handleSubmit,
      msg,
      previousPage,
      files,
      change,
      formRemoveImage,
      videos,
      mainImage,
    } = this.props;

    const images = (files || []);
    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col s12">

            {images &&
              <ImagePreview
                data={images.map((image, key) => ({
                  id: key,
                  src: image.preview,
                  isMain: image.preview === mainImage,
                  ...image,
                }))}
                carousel
                showDelete
                showSetMain
                onClick={(imageId, key) => formRemoveImage('article', key)}
                onSetMain={(image) => change('mainImage', image.img.src)}
              />
            }

            <Field
              name="images"
              component={Input}
              files={files}
              type="file"
              label={msg('news.images')}
              hint={msg('global.selectFile')}
              accept="image/*"
              multiple
            />

            <Field
              name="prContentVideo"
              type="textArray"
              component={Input}
              label={msg('news.detail.attachedVideo')}
              itemLabel={msg('news.videoUrl')}
              itemClassName="col s12 m6"
              onAdd={() => change('prContentVideo', videos.concat(''))}
              onRemove={key =>
                change('prContentVideo', videos.reduce((prev, cur, k) => k === key ? prev : prev.concat(cur), []))
              }
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

