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
import CircularProgress from 'material-ui/CircularProgress';
import Input from '../../app/components/Input';
import React, { PureComponent as Component } from 'react';
import translate from '../../../messages/translate';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { fetchAreaList } from '../../../common/areas/actions';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';

export const fields = ['continent', 'country', 'aa1', 'aa2', 'aa3', 'locality', 'subLocality'];

const connectState = (state, formName, insertAreaId) => {
  const selector = formValueSelector(formName);
  const values = fields.reduce((prev, cur) => {
    prev[cur] = selector(state, cur);
    return prev;
  }, {});

  const items = state.areas.formOptions;
  const isFetching = state.areas.isFetching;

  return {
    values,
    items,
    isFetching,
    formName,
    insertAreaId,
  };
};

@translate
class Filter extends Component {
  static propTypes = {
    change: React.PropTypes.func,
    description: React.PropTypes.string,
    fetchAreaList: React.PropTypes.func,
    formName: React.PropTypes.string,
    handleSubmit: React.PropTypes.any,
    insertAreaId: React.PropTypes.func,
    isFetching: React.PropTypes.bool,
    items: React.PropTypes.object,
    level: React.PropTypes.string,
    msg: React.PropTypes.func.isRequired,
    onSend: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
    startPoint: React.PropTypes.object,
    submitting: React.PropTypes.bool,
    values: React.PropTypes.object,
  };

  static defaultProps = {
    startPoint: {
      type: '',
      id: '',
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      fields: [...fields],
    };
  }

  componentWillMount() {
    const { formName, change, fetchAreaList, startPoint, values } = this.props;
    const { type, id } = startPoint;
    const { fields } = this.state;

    const fieldIndex = fields.indexOf(type);

    if (!startPoint || fieldIndex < 0) {
      const result = fields.reduce((filter, x) => {
        if (values[x] && values[x] !== 'all') {
          filter.type = x;
          fetchAreaList(filter);
          filter[x] = values[x];
        } else {
          const nextHasValue = fields.slice(fieldIndex).reduce((hasValue, current) => hasValue || Boolean(values[current]), false);
          if (nextHasValue) {
            filter.type = x;
            change(formName, x, 'all');
            fetchAreaList(filter);
          }
        }
        return filter;
      }, {});

      const nextId = result.type ? fields.indexOf(result.type) + 1 : 0;
      if (nextId < fields.length) {
        fetchAreaList({
          ...result,
          type: fields[nextId],
        });
      }

      return;
    }


    this.setState({
      fields: fields.slice(fieldIndex + 1, fields.length),
    });

    const fetchingObject = {
      type: fields[fieldIndex + 1],
    };
    fetchingObject[fields[fieldIndex]] = id;

    fetchAreaList(fetchingObject);
  }

  componentWillUpdate(nextProps) {
    const { items, formName, change, insertAreaId, values, fetchAreaList } = this.props;
    const { fields } = this.state;

    const keys = Object.keys(values);
    for (let i = 0; i < keys.length; i += 1) {
      if (values[fields[i]] !== nextProps.values[fields[i]]) {
        if (nextProps.values[fields[i]] === '') {
          this.removeToEnd(i + 1);
          break;
        }

        let add = 0;
        for (let j = i; j >= 0; j -= 1) {
          if (nextProps.values[fields[j]] === 'all') add += 1;
          else break;
        }
        const field = fields[i - add];
        const filter = { type: fields[i + 1] };
        filter[field] = nextProps.values[field];

        if (fields[i + 1]) {
          fetchAreaList(filter);
        }
        if (insertAreaId && items) {
          const id = items.get(field).filter(x => x.id === nextProps.values[field]);
          if (id.length > 0) {
            change(formName, 'areaId', id[0].pathId);
          }
        }
        this.removeToEnd(i + 1);
        break;
      }
    }
  }

  @autobind
  onThisSubmit(values) {
    const { items, onSubmit } = this.props;

    const array = Object.keys(values);
    for (let i = array.length - 1; i >= 0; i -= 1) {
      const index = array[i];
      if (values[index] !== 'all' && values[index] !== '') {
        const result = items.get(index).filter(x => x.label === values[index]);
        if (result.length === 0) {
          onSubmit(false);
          return;
        }
        onSubmit(result[0], index);
        return;
      }
    }
    onSubmit(false);
    return;
  }

  getField(key) {
    const { values, level } = this.props;
    const { fields } = this.state;

    if (key === -1) return true;
    if (!values) return false;
    if (key < 0 || key > 6) return false;

    const fieldName = fields[key];
    if (level && fieldName === level) return false;
    return values[fieldName] || false;
  }

  removeToEnd(fromIndex) {
    const { formName, values, change } = this.props;
    const { fields } = this.state;
    if (!values) return;

    for (let i = fromIndex; i < fields.length; i += 1) {
      const fieldName = fields[i];
      if (values[fieldName]) change(formName, fieldName, '');
    }
    return;
  }

  renderFields() {
    const { items, isFetching, msg } = this.props;
    const { fields } = this.state;

    if (isFetching) {
      return (
        <CircularProgress
          size={80}
          thickness={5}
          style={styles.loader}
        />
      );
    }

    return fields.map((x, key) => {
      const field = this.getField(key - 1);
      if (!field) return null;

      const formItems = items.get(x).map(x => ({
        label: x.label,
        id: x.id,
        pathId: x.pathId,
      }));

      return (<Field
        key={key}
        name={x}
        component={Input}
        type="select"
        label={msg(`global.form.${x}`)}
        items={formItems}
        selectPlaceholder="global.select"
        allPlaceholder="global.all"
      />);
    });
  }

  render() {
    const { description, msg, handleSubmit, startPoint: { firstDisabled, id } } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onThisSubmit)}>
        <div className="row textbox-container">
          <h4 style={styles.header}>{msg('global.form.selectArea')}</h4>
          {description && <div>{description}</div>}
          <div style={{ width: '100%' }}>
            { firstDisabled &&
              <Field
                name="defaultArea"
                component={Input}
                items={[{ id: '', label: id }]}
                type="select"
                label={msg('geo.selectedArea')}
                disabled={Boolean(true)}
              />
            }
            {this.renderFields()}
          </div>
        </div>
      </form>
    );
  }
}

export const RootFilter = reduxForm({ form: 'rootFilter' })(connect(state => connectState(state, 'rootFilter'), { change, fetchAreaList })(Filter));
export const ChildFilter = reduxForm({ form: 'childFilter' })(connect(state => connectState(state, 'childFilter'), { change, fetchAreaList })(Filter));
export const TrashFilter = reduxForm({ form: 'filter', destroyOnUnmount: false, forceUnregisterOnUnmount: true })(connect(state => connectState(state, 'filter'), { change, fetchAreaList })(Filter));
export const OrganizationAreaFilter = reduxForm({ form: 'organization', destroyOnUnmount: false, forceUnregisterOnUnmount: true })(connect(state => connectState(state, 'organization', true), { change, fetchAreaList })(Filter));
export const ArticleFilter = reduxForm({ form: 'article', destroyOnUnmount: false, forceUnregisterOnUnmount: true })(connect(state => connectState(state, 'article'), { change, fetchAreaList })(Filter));
export const ArticleAreaSelect = reduxForm({ form: 'article', destroyOnUnmount: false, forceUnregisterOnUnmount: true })(connect(state => connectState(state, 'article', true), { change, fetchAreaList })(Filter));
export const UserAreaFilter = reduxForm({ form: 'filter', destroyOnUnmount: false, forceUnregisterOnUnmount: true })(connect(state => connectState(state, 'filter', true), { change, fetchAreaList })(Filter));


const styles = {
  loader: {
    width: '100%',
    textAlign: 'center',
    margin: '20px',
  },
  header: {
    width: '100%',
  },
};
