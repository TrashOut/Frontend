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
import './markdown/style.css';
import 'react-phone-number-input/rrui.css';
import 'react-phone-number-input/style.css';
import './stylesheets/phone-input-style.css';

import Checkbox from 'material-ui/Checkbox';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import DatePicker from 'material-ui/DatePicker';
import Dropzone from 'react-dropzone';
import Editor from 'react-simplemde-editor';
import geolib from 'geolib';
import GoogleMap from './GoogleMap';
import ImageCheckbox from './ImageCheckbox';
import MenuItem from 'material-ui/MenuItem';
import PhoneInput from 'react-phone-number-input';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import SelectField from 'material-ui/SelectField';
import Slider from 'material-ui/Slider';
import TextField from 'material-ui/TextField';
import TimePicker from 'material-ui/TimePicker';
import translate from '../../../messages/translate';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { red500 } from 'material-ui/styles/colors';

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const Input = ({
  locale,
  input,
  type,
  label,
  nonTranslatedHint,
  hint,
  id,
  inRow,
  src,
  srcActive,
  items,
  files,
  msg,
  style,
  meta: {
    touched,
    error,
    warning,
  },
  disabled,
  defaultValue,
  min,
  max,
  step,
  multiLine,
  ...next
 }) => {
  label = label && label.toUpperCase();

  let itemsSimpleFormat = false;
  let firstItemElement;
  for(const i in items){
    firstItemElement = items[i];
    break;
  }
  if (firstItemElement !== undefined && (typeof firstItemElement === 'string' || typeof firstItemElement === 'number')) {
    itemsSimpleFormat = true;
  } else {
    if (Array.isArray(items) && items[0] && items[0].message) {
      items = items.reduce((prev, cur) => ({ ...prev, [cur.id]: cur }), {});
    }

    if (!Array.isArray(items) && typeof items === 'object') {
      items = Object.keys(items).map((x) => ({ label: msg(items[x].message), ...items[x] }));
    }
  }

  if (!hint && nonTranslatedHint) hint = msg(nonTranslatedHint);

  const errorType = error;
  if (typeof error === 'string') {
    error = msg(errorType);
  }

  if (typeof warning === 'string') {
    warning = msg(warning);
  }

  if (type === 'lookup') {
    return (
      <div className="form-section-container">
        <h4>{label}</h4>
        <TextField
          {...input}
          errorText={(touched && (error || warning)) ? (error || warning) : ''}
          onKeyPress={(event) => {
            if (event.key === 'Enter') next.onAdd();
          }}
        />
        <RaisedButton label={next.addLabel} onClick={next.onAdd} primary />
      </div>
    );
  }

  if (type === 'phone') {
    return (
      <div className="form-section-container">
        <h4>{label}</h4>
        <PhoneInput
          value={input.value}
          onChange={(value) => {
            input.onFocus();
            input.onChange(value);
            input.onBlur();
          }}
          error={touched && error}
          indicateInvalid
          placeholder={msg('global.phone.placeholder')}
        />
      </div>
    );
  }

  if (type === 'select') {
    let formItems = [];
    if (itemsSimpleFormat) {
      for(const i in items) {
        formItems.push(<MenuItem key={i} value={i} primaryText={items[i]}/>);
      }
    } else {
      formItems = items.map(({ id, label }, key) =>
        <MenuItem key={key} value={id} primaryText={label} />
      );
    }

    if (next.allPlaceholder) {
      formItems.unshift(<MenuItem key="all" value="all" primaryText={msg(next.allPlaceholder)} />);
    }

    if (next.selectPlaceholder) {
      formItems.unshift(<MenuItem key="select" value="" primaryText={msg(next.selectPlaceholder)} />);
    }

    if (next.translatedSelectPlaceholder) {
      formItems.unshift(<MenuItem key="select" value="" primaryText={next.translatedSelectPlaceholder} />);
    }

    return (
      <div className="form-section-container">
        <h4>{label}</h4>
        <SelectField
          {...input}
          onChange={(event, index, value) => input.onChange(value)}
          errorText={touched && error}
          value={((input.value || {}).toString && input.value.toString()) || input.value}
        >
          {formItems}
        </SelectField>
      </div>
    );
  }
  if (type === 'file') {
    const loadFile = (f) => {
      if (files === undefined || !next.multiple) {
        files = [];
      } else {
        files = files.slice();
      }

      for (let i = 0; i < f.length; i += 1) {
        files.push(f[i]);
      }

      input.onChange(files);
      input.onBlur(files);
    };

    return (
      <div className="form-section-container">
        <h4>{label}</h4>
        {!next.dismissHint && <p>{msg('global.images.requirements')}</p>}
        <Dropzone
          accept={next.accept || 'image/*'}
          multiple={next.multiple}
          disableClick={Boolean(false)}
          onDrop={(okFiles, nokFiles) => {
            input.onFocus();
            if (next.afterSelectAccept) {
              loadFile([...okFiles, ...nokFiles].filter(file => next.afterSelectAccept.indexOf(file.type) > -1));
            } else {
              loadFile(okFiles);
            }
          }}
          style={{ ...styles.upload, ...style }}
        >
          <div style={styles.upload.dropzone}>
            <span>
              {hint || (next.multiple
                ? msg('global.selectFiles')
                : msg('global.selectFile'))
              }
            </span>
            {touched && error &&
              <span style={styles.upload.error}>{error}</span>
            }
          </div>
        </Dropzone>
      </div>
    );
  }

  if (type === 'map') {
    return (
      <div className="form-section-container">
        <h4>{label}</h4>
        {touched && error &&
          <strong
            style={{ ...styles.validationError, width: '100%', marginBottom: '5px' }}
          >
            {error}
          </strong>
        }
        <GoogleMap
          {...input}
          center={input.value}
          hasCenter={Boolean(true)}
          onChange={(value) => input.onChange(value)}
          isFetching={next.isFetching}
          showSearch
          {...next}
        />
      </div>
    );
  }

  if (type === 'crop_map') {
    return (
      <div className="form-section-container">
        <h4>{label}</h4>
        {hint &&
          <p>{hint}</p>
        }
        {touched && error &&
          <p>
            <strong
              style={styles.validationError}
            >
              {error}
            </strong>
          </p>
        }
        <GoogleMap
          {...input}
          drawRectangle={Boolean(true)}
          onChange={(value) => {
            input.onFocus();
            input.onBlur();
            input.onChange(value);

            const { east, south, north, west } = value;
            const p1 = {
              latitude: north,
              longitude: east,
            };
            const p2 = {
              latitude: south,
              longitude: west,
            };

            const distance = east && south && north && west && geolib.getDistance(p1, p2);
            if (next.onMapChanged) next.onMapChanged(value, distance);
          }}
          onMarkerToggle={(value) => next.onSelect(value)}
          points={items}
          rectangle={input.value}
          showSearch={Boolean(true)}
          useGoogleCluster={Boolean(false)}
          isFetching={next.isFetching}
        />
      </div>
    );
  }

  if (type === 'select_map') {
    return (
      <div className="form-section-container">
        <h4>{label}</h4>
        {touched && error &&
          <strong
            style={{ ...styles.validationError, width: '100%', marginBottom: '5px' }}
          >
            {error}
          </strong>
        }
        <GoogleMap
          {...input}
          onChange={(value) => input.onChange(value)}
          points={items}
          selectable={Boolean(true)}
          isFetching={next.isFetching}
        />
      </div>
    );
  }

  if (type === 'slider') {
    if (!isNumeric(input.value)) {
      input.value = defaultValue || min;
      input.onChange(defaultValue || min);
    }
    return (
      <div className="form-section-container">
        <h4>{label}</h4>
        <Slider
          min={min}
          max={max}
          step={step}
          defaultValue={defaultValue}
          onChange={(e, value) => input.onChange(value)}
          value={input.value}
        />
        <p>{msg(items[input.value].message)}</p>
        {touched && error &&
          <div style={styles.validationError}>{error}</div>
        }
      </div>
    );
  }

  if (type === 'date') {
    return (
      <div className="form-section-container">
        <h4>{label}</h4>
        <DatePicker
          value={input.value === '' ? null : input.value}
          onChange={(e, value) => input.onChange(value)}
          onFocus={() => input.onFocus()}
          onBlur={() => input.onBlur()}
          hintText={label}
          className="datepicker"
          formatDate={(date) => `${date.getDate()}.  ${date.getMonth() + 1}. ${date.getFullYear()}`}
          errorText={touched && error}
          DateTimeFormat={global.Intl.DateTimeFormat}
          locale={locale}
          maxDate={next.maxDate}
          minDate={next.minDate}
        />
      </div>
    );
  }
  if (type === 'time') {
    return (
      <div className="form-section-container">
        <h4>{label}</h4>
        <TimePicker
          {...input}
          onChange={(e, value) => input.onChange(value)}
          onFocus={() => input.onFocus()}
          onBlur={() => input.onBlur()}
          format="24hr"
          hintText={label}
          errorText={touched && error}
          DateTimeFormat={global.Intl.DateTimeFormat}
          locale={locale}
        />
      </div>
    );
  }
  if (type === 'checkbox') {
    if (src && srcActive) {
      return (
        <ImageCheckbox
          checked={Boolean(input.value || false)}
          value={input.value}
          onCheck={(e, checked) => input.onChange(checked)}
          label={label}
          src={src}
          srcActive={srcActive}
          style={{ ...inRow && styles.checkbox.rowItem, ...style }}
          background={next.background}
        />
      );
    }

    return (
      <div className="form-section-container" style={{ ...styles.checkbox.wrapper, ...(next.wrapperStyle || {}) }}>
        <Checkbox
          checked={input.value || false}
          value={input.value}
          onCheck={(e, checked) => {
            input.onChange(checked);
            if (next.onValueChange) next.onValueChange({ id, name: input.name, checked });
          }}
          label={label || hint}
          style={inRow ? styles.checkbox.rowItem : {}}
          labelStyle={style}
          iconStyle={style}
          className="checkbox"
        />
        {touched && error &&
          <div style={styles.validationError}>{error}</div>
        }
      </div>
    );
  }

  if (type === 'checkboxList') {
    const getItems = (items, disableInRow) =>
      items.map(({ id, label, img, imgActive, background }, key) =>
        <Field
          key={key}
          name={`${input.name}[${id}]`}
          type="checkbox"
          component={Input}
          label={label}
          inRow={disableInRow ? false : inRow}
          id={id}
          src={img}
          srcActive={imgActive}
          background={background}
          style={(touched && error) ? { color: 'red' } : {}}
          onValueChange={next.onValueChange}
        />);

    const formItems = next.categories
      ? Object.keys(next.categories).map((x, key) => {
        const category = next.categories[x];
        const filteredItems = items.filter(value => category.types.indexOf(value.id) >= 0);
        if (filteredItems.length === 0) return null;
        return (
          <div key={key} className="col s12 m4">
            <h5 style={{ padding: 0, marginTop: '4px' }}>{msg(category.message)}</h5>
            {getItems(filteredItems, true)}
          </div>
        );
      }) : getItems(items);

    return (
      <div className="form-section-container">
        <h4>{label}</h4>
        {touched && error &&
          <div style={styles.validationError}>{error}</div>
        }
        <div style={inRow ? styles.row : styles.column}>
          {formItems}
        </div>
      </div>
    );
  }

  const imageRadioList = () => {
    const formItems = items.map(({ id, label, img, imgActive, background }, key) =>
      <ImageCheckbox
        checked={input.value === id}
        name={input.name}
        value={id}
        onCheck={() => input.onChange(id)}
        label={label.toUpperCase()}
        src={img}
        srcActive={imgActive}
        background={background}
        style={(touched && error) ? { color: 'red' } : {}}
        type="radio"
        key={key}
      />
    );

    return (
      <div className="form-section-container">
        <h4>{label}</h4>
        {touched && error &&
          <div style={styles.validationError}>{error}</div>
        }
        <div style={inRow ? styles.row : styles.column}>
          {formItems}
        </div>
      </div>
    );
  };

  const radioList = () => {
    const formItems = items.map(({ id, label, background }, key) =>
      <RadioButton
        key={key}
        value={id}
        label={label.toUpperCase()}
        style={styles.checkbox.wrapper}
        iconStyle={{}}
        labelStyle={touched && error && { color: 'red' }}
      />
    );

    return (
      <div className="form-section-container">
        <h4>{label}</h4>
        {touched && error &&
          <div style={styles.validationError}>{error}</div>
        }
        <div style={inRow ? styles.row : styles.column}>
          <RadioButtonGroup
            {...input}
            onChange={(event, value) => input.onChange(value)}
            style={inRow ? styles.row : styles.column}
            valueSelected={((input.value || {}).toString && input.value.toString()) || input.value}
          >
            {formItems}
          </RadioButtonGroup>
        </div>
      </div>
    );
  };

  if (type === 'radioList') {
    if (items[0].imgActive && items[0].img) return imageRadioList();
    return radioList();
  }

  if (type === 'mdText') {
    return (
      <div className="form-section-container">
        <h4>{label}</h4>
        {hint && <small>{hint}</small>}
        {touched && error &&
          <strong
            style={{ ...styles.validationError, width: '100%', marginBottom: '5px' }}
          >
            {error}
          </strong>
        }
        <div>
          <Editor
            value={input.value}
            onChange={input.onChange}
            options={{
              autofocus: true,
              spellChecker: false,
              forceSync: false,
              toolbar: [
                'bold',
                'italic',
                'link',
                '|',
                'heading-1',
                'heading-2',
                'heading-3',
              ],
              toolbarTips: false,
              styleSelectedText: false,
              renderingConfig: {
                singleLineBreaks: false,
                codeSyntaxHighlighting: true,
              },
            }}
          />
        </div>
      </div>
    );
  }

  if (type === 'textArray') {
    return (
      <div className="form-section-container">
        <h4>{label}</h4>
        {(input.value || []).map((value, key) =>
          <div className={next.itemClassName}>
            <div className="col s10">
              <Field
                name={`${input.name}[${key}]`}
                component={Input}
                type="text"
                hint={next.itemLabel}
                onRemove={() => next.onRemove(key)}
              />
            </div>
            <div className="col s2">
              <RaisedButton
                onClick={() => next.onRemove(key)}
                icon={<ClearIcon color={red500} />}
              />
            </div>
          </div>
        )}
        <RaisedButton onClick={next.onAdd}>
          {msg('global.addNext')}
        </RaisedButton>
      </div>
    );
  }

  if (type === 'disabled') {
    return (
      <div className="form-section-container">
        <h4>{label}</h4>
        <TextField
          disabled
          hintText={hint}
          errorText={(touched && error) ? error : ''}
          type={type}
          multiLine={multiLine}
          value={defaultValue}
          style={style}
        />
      </div>
    );
  }

  if (type === 'numberWithExtension') {
    return (
      <div className="form-section-container">
        <h4>{label}</h4>
        <div className="col s10">
          <TextField
            {...input}
            hintText={hint}
            errorText={(touched && error) ? error : ''}
            type="number"
          />
        </div>
        <div className="col s2">
          <Field
            key="select_field_vole"
            type="select"
            name="select_type"
            items={[]}
            component={Input}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="form-section-container">
      <h4>{label}</h4>
      <TextField
        {...input}
        disabled={disabled}
        defaultValue={defaultValue}
        hintText={hint}
        errorText={(touched && error) ? error : ''}
        type={type}
        multiLine={multiLine}
      />
    </div>
  );
};

Input.propTypes = {
  description: React.PropTypes.string,
  files: React.PropTypes.array,
  formName: React.PropTypes.string,
  hint: React.PropTypes.string,
  id: React.PropTypes.any,
  input: React.PropTypes.any,
  inRow: React.PropTypes.bool,
  msg: React.PropTypes.func,
  items: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object,
  ]),
  label: React.PropTypes.string,
  meta: React.PropTypes.object,
  name: React.PropTypes.string,
  selected: React.PropTypes.bool,
  src: React.PropTypes.string,
  srcActive: React.PropTypes.string,
  style: React.PropTypes.object,
  type: React.PropTypes.string,
  locale: React.PropTypes.string,
  nonTranslatedHint: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  defaultValue: React.PropTypes.any,
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  step: React.PropTypes.number,
  multiLine: React.PropTypes.bool,
};

const styles = {
  validationError: {
    color: 'red',
    marginTop: '3px',
    marginBottom: '3px',
  },
  upload: {
    width: '100%',
    height: '100px',
    borderWidth: '2px',
    borderColor: 'rgb(102, 102, 102)',
    borderStyle: 'dashed',
    borderRadius: '5px',
    error: {
      color: 'red',
      marginTop: '5px',
    },
    dropzone: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      flexDirection: 'column',
      cursor: 'pointer',
    },
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkbox: {
    wrapper: {
      display: 'block',
      flexBasis: 'auto',
      marginRight: '20px',
      whiteSpace: 'nowrap',
      width: 'auto!important',
    },
    rowItem: {
      display: 'inline!important',
    },
  },
};

export default connect(state => ({
  locale: state.intl.currentLocale,
}), null)(translate(Input));
