import React from 'react';
import { addString } from '../common/translate/actions';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';

const translate = (WrappedComponent: Function) => {
  class Translate extends React.Component {

    static propTypes = {
      intl: intlShape.isRequired,
    };

    msg(id, values) {
      const { intl } = this.props;
      if (!id) return '';

      const message = defineMessages({
        [id]: {
          id,
          defaultMessage: `##${id}`,
        },
      });

      const m = intl.formatMessage(message[id], values);
      if (!m) return `#${id}`;
      return m;
    }

    cmsg = (id, values) => (<FormattedMessage
      id={id}
      defaultMessage={`##${id}`}
      values={values}
    />);

    formatRelative(time) {
      const { intl } = this.props;
      return intl.formatRelative(time);
    }

    render() {
      const { intl, ...props } = this.props;
      props.msg = (id, values = {}) => this.msg(id, values);
      props.formatDate = (time) => this.formatRelative(time);
      props.getDateTimeFormat = intl.formatters.getDateTimeFormat;
      props.cmsg = (id, values = {}) => this.cmsg(id, values);
      return (
        <WrappedComponent {...props} />
      );
    }

  }

  Translate = connect(null, { addString })(Translate);
  Translate = injectIntl(Translate);
  return Translate;
};


export default translate;
