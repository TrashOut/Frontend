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
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { formRemoveImage } from '../../../common/forms/actions';
import { validateCreate as validate, asyncValidate } from '../../../common/trashmanagement/validate';

const selector = formValueSelector('trashForm');

@translate
@connect(state => ({
  files: selector(state, 'images'),
}), { formRemoveImage })
@reduxForm({
  form: 'trashForm',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  asyncValidate,
  asyncBlurFields: ['images'],
})
export default class FormThird extends Component {
  static propTypes = {
    files: React.PropTypes.array,
    formRemoveImage: React.PropTypes.func,
    handleSubmit: React.PropTypes.func,
    msg: React.PropTypes.func.isRequired,
    previousPage: React.PropTypes.func,
    submitting: React.PropTypes.bool,
  }

  render() {
    const { handleSubmit, files, formRemoveImage, previousPage, msg, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col s12">
            {files &&
              <ImagePreview
                data={files.map((x, key) => ({
                  id: key,
                  src: x.preview,
                  ...x,
                }))}
                carousel
                showDelete
                onClick={(x) => formRemoveImage('trashForm', x)}
              />
            }
          </div>
          <div className="col s12">
            <Field
              name="images"
              type="file"
              accept="image/*"
              multiple
              component={Input}
              files={files}
              label={msg('global.images')}
              description={msg('global.images')}
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
              disabled={submitting}
            />
            <RaisedButton
              type="submit"
              style={styles.button}
              label={msg('trash.create')}
              primary={Boolean(true)}
              disabled={submitting}
            />
          </div>
        </div>
      </form>
    );
  }
}

const styles = {
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
  button: {
    marginLeft: '12px',
    fontSize: '0.8em',
  },
};
