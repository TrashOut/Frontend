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
import AppBar from 'material-ui/AppBar';
import Colors from '../../common/app/colors';
import Input from '../app/components/Input';
import Paper from 'material-ui/Paper';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import React, { PureComponent as Component } from 'react';
import translate from '../../messages/translate';
import { autobind } from 'core-decorators';
import { change, Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { cpCategories, cpScrapyardTypes, cpDustbinTypes, collectionPointSizes } from '../../common/collectionpoints/consts';
import { spams } from '../../common/trashmanagement/consts';
import { TrashFilter } from '../areas/form/Form';

const selector = formValueSelector('filter');

@translate
@connect(state => ({
  showFilter: state.table.get('showFilter'),
  initialValues: state.table.filter.toJS(),
  selectedTab: state.collectionPoints.selectedTab,
  selectedSize: selector(state, 'collectionPointSize'),
  selectedTypes: selector(state, 'collectionPointType'),
  selectedCategories: selector(state, 'categories'),
}), { change })
@reduxForm({
  form: 'filter',
})
@Radium
export default class Filter extends Component {
  static propTypes = {
    change: React.PropTypes.func.isRequired,
    changeFieldValue: React.PropTypes.func,
    destroy: React.PropTypes.func,
    handleSubmit: React.PropTypes.any,
    isSelected: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func,
    pristine: React.PropTypes.bool,
    selectedCategories: React.PropTypes.object,
    selectedSize: React.PropTypes.string,
    selectedTab: React.PropTypes.string,
    selectedTypes: React.PropTypes.string,
    showFilter: React.PropTypes.bool,
    submitting: React.PropTypes.bool,
  }

  componentWillUpdate(nextProps) {
    const { change, selectedSize: prevSelectedSize } = this.props;
    const { selectedSize, selectedTypes } = nextProps;

    if (selectedSize !== prevSelectedSize && selectedTypes && selectedSize.dustbin && !selectedSize.scrapyard) {
      const types = Object.keys(cpScrapyardTypes).reduce((prev, cur) => {
        if (cpDustbinTypes[cur] && selectedTypes[cur]) prev[cur] = true;
        return prev;
      }, {});

      change('collectionPointType', types);
    }
  }

  @autobind
  clearAndClose() {
    const { destroy, onSubmit } = this.props;

    destroy();
    setTimeout(() => onSubmit({}), 10);
  }

  render() {
    const {
      change,
      handleSubmit,
      msg,
      selectedSize,
      selectedTab,
      selectedTypes,
      selectedCategories,
      showFilter,
      submitting,
    } = this.props;

    const types = (selectedSize && selectedSize.dustbin && !selectedSize.scrapyard) ? cpDustbinTypes : cpScrapyardTypes;

    return (
      <div style={[!showFilter && { display: 'none' }].filter(style => style)}>
        <AppBar
          showMenuIconButton={false}
          title={<span style={styles.header}>{msg('collectionPoint.filter.header')}</span>}
          style={styles.appBar}
        />
        <Paper style={styles.wrapper} >
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col m12">
                <Field
                  name="collectionPointSize"
                  type="checkboxList"
                  component={Input}
                  label={msg('collectionPoint.size')}
                  items={collectionPointSizes}
                  inRow={Boolean(true)}
                />
              </div>
              <div className="col s12">
                <Field
                  name="categories"
                  type="checkboxList"
                  component={Input}
                  label={msg('collectionPoint.category')}
                  items={_.pickBy(cpCategories, (value) => value.selectable)}
                  onValueChange={(value) => {
                    const category = cpCategories[value.id];
                    const types = category.selectAll
                      ? []
                      : category.types;
                    const result = types.reduce((prev, cur) => {
                      prev[cur] = value.checked;
                      return prev;
                    }, {});
                    const newTypes = { ...selectedTypes, ...result, ...selectedCategories };
                    newTypes[category.id] = value.checked;
                    change('collectionPointType', newTypes);
                  }}
                  inRow
                />
              </div>
              <div className="col s12">
                <Field
                  name="collectionPointType"
                  type="checkboxList"
                  component={Input}
                  label={msg('collectionPoint.type')}
                  categories={_.pickBy(cpCategories, (value) => value.types)}
                  items={types}
                  inRow={Boolean(true)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col s12">
                {selectedTab === 'table' && <TrashFilter />}
              </div>
            </div>
            <div className="row">
              <div className="col s6">
                <Field
                  name="collectionPointNote"
                  type="text"
                  component={Input}
                  label={msg('global.note')}
                  hint={msg('global.note.hint')}
                />
              </div>
              <div className="col s6">
                <Field
                  name="collectionPointIds"
                  type="text"
                  component={Input}
                  label={msg('collectionPoint.filter.ids')}
                  hint={msg('collectionPoint.filter.ids')}
                />
              </div>
            </div>
            <div className="row">
              <div className="col s12">
                <Field
                  name="spam"
                  type="select"
                  component={Input}
                  items={spams}
                  label={msg('global.markedAsSpam')}
                  selectPlaceholder="global.select"
                />
              </div>
            </div>
            <div className="row">
              <div className="right-align">
                <RaisedButton
                  type="button"
                  disabled={submitting}
                  onClick={this.clearAndClose}
                  label={msg('global.cancelFilter')}
                  style={styles.button}
                />
                <RaisedButton
                  type="submit"
                  disabled={submitting}
                  label={msg('global.submitFilter')}
                  style={styles.button}
                  labelColor="white"
                  backgroundColor={Colors.primary}
                />
              </div>
            </div>
          </form>
        </Paper>
      </div>
    );
  }
}

const styles = {
  wrapper: {
    marginBottom: '20px',
    padding: '3%',
    zIndex: '0',
    display: 'block',
  },
  button: {
    marginLeft: '12px',
  },
  header: {
    fontSize: '0.8em',
    fontWeight: '200',
  },
  appBar: {
    backgroundColor: Colors.secondary,
  },
};
