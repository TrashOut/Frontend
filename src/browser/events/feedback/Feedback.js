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
import _ from 'lodash';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ImagePreview from '../../app/components/ImagePreview';
import Input from '../../app/components/Input';
import React, { PureComponent as Component } from 'react';
import routesList from '../../routesList';
import translate from '../../../messages/translate';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { eventFeedback } from '../../../common/events/actions';
import { Field, reduxForm, formValueSelector, touch } from 'redux-form';
import { formRemoveImage } from '../../../common/forms/actions';
import { push } from 'react-router-redux';
import { validateFeedback as validate, asyncValidate } from '../../../common/events/validate';

const selector = formValueSelector('eventFeedback');

@translate
@connect(state => {
  const viewer = state.users.viewer;
  const eventUser = _.head(state.events.item.users.filter(x => x.userId === viewer.id));
  const initialValues = eventUser && {
    feedbackGuessGuestCount: eventUser.feedbackGuessGuestCount,
    feedbackGuessTrashCount: eventUser.feedbackGuessTrashCount,
  };
  return {
    event: state.events.item,
    images: selector(state, 'images') || [],
    initialValues,
  };
}, { eventFeedback, formRemoveImage, push, touch })
@reduxForm({
  form: 'eventFeedback',
  validate,
  asyncValidate,
  asyncBlurFields: ['images'],
})
export default class EventFeedback extends Component {
  static propTypes = {
    item: React.PropTypes.object,
    items: React.PropTypes.object,
    submit: React.PropTypes.func,
    setRoot: React.PropTypes.func,
    msg: React.PropTypes.func.isRequired,
    eventFeedback: React.PropTypes.func,
    event: React.PropTypes.object,
    formRemoveImage: React.PropTypes.func,
    images: React.PropTypes.array,
    handleSubmit: React.PropTypes.func,
    push: React.PropTypes.func,
  };

  @autobind
  onSubmit(data) {
    const { event, eventFeedback } = this.props;
    eventFeedback(event.id, data);
  }

  render() {
    const { event, formRemoveImage, images, handleSubmit, msg, push } = this.props;

    const buttons = [
      <FlatButton type="button" label={msg('global.cancel')} onClick={() => push(routesList.eventDetail.replace(':id', event.id))} />,
      <FlatButton type="submit" primary={Boolean(true)} label={msg('event.feedback.addFeedback')} onClick={handleSubmit(this.onSubmit)} />,
    ];

    const previews = images &&
      <ImagePreview
        data={images.map((image, key) => ({
          id: key,
          src: image.preview,
          ...image,
        }))}
        carousel
        showDelete
        onClick={(imageId, key) => formRemoveImage('eventFeedback', key)}
      />;

    return (
      <Dialog
        title={msg('event.feedback.header')}
        actions={buttons}
        open={Boolean(true)}
        autoScrollBodyContent
        actionsContainerStyle={{ borderTop: '0' }}
        titleStyle={{ borderBottom: '0' }}
        contentStyle={{
          width: '80%',
          maxWidth: 'none',
        }}
      >
        <form>
          {previews}
          <Field
            name="images"
            type="file"
            component={Input}
            label={msg('event.feedback.images')}
            multiple
            files={images}
          />
          <Field
            name="feedbackGuessGuestCount"
            type="number"
            label={msg('event.feedback.guessGuestCount')}
            component={Input}
          />
          <Field
            name="feedbackGuessTrashCount"
            type="number"
            label={msg('event.feedback.guessCollectTrashCount')}
            component={Input}
          />
        </form>
      </Dialog>
    );
  }
}
