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
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';
import React, { PureComponent as Component } from 'react';
import Slider from 'material-ui/Slider';
import translate from '../../../messages/translate';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

const limitMax = 5000;
const limitUnlimited = 100000;

@connect(state => ({
  exportFinished: state.table.exportFinished,
}))
@translate
export default class Export extends Component {
  static propTypes = {
    attributes: React.PropTypes.object,
    currentPage: React.PropTypes.number,
    msg: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
    pages: React.PropTypes.number,
    title: React.PropTypes.string,
    exportFinished: React.PropTypes.bool,
    allowUnlimited: React.PropTypes.bool,
  };
  static contextTypes = {
    router: React.PropTypes.object,
  };

  state = {
    attributesNeeded: ['id'],
    limit: 1000,
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.exportFinished && nextProps.exportFinished) {
      setTimeout(this.handleClose, 3000);
    }
  }

  @autobind
  handleClose() {
    const { onClose } = this.props;
    onClose();
  }

  @autobind
  initExport() {
    const { onSubmit } = this.props;
    const { attributesNeeded, limit } = this.state;

    const applyLimit = limit > limitMax ? limitUnlimited : limit;

    onSubmit(attributesNeeded, applyLimit);
  }

  selectAttribute(value) {
    const { attributesNeeded: a } = this.state;
    const attributesNeeded = a.slice();

    const index = attributesNeeded.indexOf(value);

    if (index > -1) {
      attributesNeeded.splice(index, 1);
    } else {
      attributesNeeded.push(value);
    }

    this.setState({ attributesNeeded });
  }

  @autobind
  changeLimit(e, limit) {
    e.preventDefault();
    this.setState({ limit });
  }

  render() {
    const { attributes, pages, currentPage, msg, title, allowUnlimited } = this.props;
    const { attributesNeeded, limit } = this.state;

    const buttons = [
      <FlatButton label={msg('global.cancel')} onClick={this.handleClose} />,
      <FlatButton label={msg('global.export')} onClick={this.initExport} />,
    ];

    const checkboxes = Object
      .keys(attributes)
      .map((x, key) => <Checkbox
        key={key}
        label={msg(attributes[x].message)}
        onClick={() => this.selectAttribute(x)}
        checked={attributesNeeded.indexOf(x) > -1}
        style={styles.checkbox}
      />);

    return (
      <Dialog
        title={title}
        actions={buttons}
        contentStyle={{
          width: '70%',
          maxWidth: 'none',
        }}
        open
        autoScrollBodyContent
        actionsContainerStyle={{ borderTop: '0' }}
        titleStyle={{ borderBottom: '0' }}
      >
        <p>{msg('export.description')}</p>
        <strong>{msg('export.selectAttributes')}</strong>
        <div style={styles.checkbox.wrapper}>
          {checkboxes}
        </div>

        <strong>{msg('export.itemsPerFile')}</strong>
        <Slider
          min={100}
          max={allowUnlimited ? limitMax + 1 : limitMax}
          step={100}
          defaultValue={limit}
          value={limit}
          onChange={this.changeLimit}
        />
        <strong>{msg('export.itemsPerFile.currentValue')} </strong>{limit > limitMax ? '∞' : limit}
        {pages > 0 &&
          <div>
            <p>{msg('export.preparingExport')}</p>
            <LinearProgress max={pages} mode="determinate" value={currentPage} />
          </div>
        }
      </Dialog>
    );
  }
}

const styles = {
  checkbox: {
    wrapper: {
      width: '100%',
      position: 'relative',
      display: 'table',
      marginTop: '10px',
      marginBottom: '30px',
    },
    width: '25%',
    float: 'left',
  },
};

