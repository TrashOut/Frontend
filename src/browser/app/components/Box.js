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
import Colors from '../../../common/app/colors';
import GoogleMap from './GoogleMap';
import Link from './Link';
import Radium from 'radium';
import React, { PureComponent as Component } from 'react';
import ToggleIndeterminateCheckBox from 'material-ui/svg-icons/toggle/indeterminate-check-box';
import { connect } from 'react-redux';
import { FormattedDate } from 'react-intl';

@connect(state => ({
  googleMapsApiKey: state.config.googleMaps,
}), null)
@Radium
export default class Box extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    className: React.PropTypes.string,
    data: React.PropTypes.array,
    googleMapsApiKey: React.PropTypes.string,
    headerStyle: React.PropTypes.object,
    item: React.PropTypes.object,
    onClick: React.PropTypes.func,
    showAddress: React.PropTypes.bool,
    showGPS: React.PropTypes.bool,
    showIfEmpty: React.PropTypes.bool,
    showMap: React.PropTypes.bool,
    showRectangle: React.PropTypes.bool,
    style: React.PropTypes.object,
    text: React.PropTypes.text,
    title: React.PropTypes.string,
    titleStyle: React.PropTypes.object,
    type: React.PropTypes.text,
    wrapperStyle: React.PropTypes.object,
    zoom: React.PropTypes.number,
  };

  static defaultProps = {
    className: 'col s12',
    type: 'text',
    showIfEmpty: true,
  };

  getGoogleMapImage(lat, lng, width = 400.0) {
    const { googleMapsApiKey } = this.props;
    return `http://maps.google.com/maps/api/staticmap?center=${lat},${lng}&zoom=12&size=${parseInt(width, 10)}x${parseInt(width, 10) / 2}&maptype=roadmap&markers=color:red%7Clabel:A%7C${lat},${lng}&sensor=false&key=${googleMapsApiKey}`;
  }

  renderContent() {
    const { text, children, type } = this.props;

    switch (type) {
      case 'location':
        return this.renderLocation();
      case 'date':
        return this.renderDate();
      case 'statistics':
        return this.renderStatistics();
      case 'statisticsOrganization':
        return this.renderStatisticsOrganization();
      case 'checkboxes':
        return this.renderCheckboxes();
      default:
        return <div style={styles.content}>{children || text}</div>;
    }
  }

  renderCheckboxes() {
    const { data } = this.props;
    const result = data.map(x =>
      <div>
        <Checkbox
          label={x.label}
          disabled={Boolean(true)}
          checked={!!x.value}
          uncheckedIconuncheckedIcon={<ToggleIndeterminateCheckBox />}
          labelStyle={styles.checkboxes.text}
          style={styles.checkboxes}
        />
      </div>
    );

    return <div>{result}</div>;
  }

  renderStatisticImage(image) {
    switch (image) {
      case 'cleaned':
        return '/widget/assets/images/icons/icon_cleaned.png';
      case 'reported':
        return '/widget/assets/images/icons/icon_reported.png';
      case 'updated':
        return '/widget/assets/images/icons/icon_update.png';
      default:
        return '';
    }
  }

  renderStatisticsOrganization() {
    const { data, onClick } = this.props;
    const result = data.map((x, key) =>
      <div style={styles.statisticsBlock}>
        <img style={styles.statisticsOrganization.image} alt="location" src={this.renderStatisticImage(x.image)} />
        <div
          key={key}
          style={[
            styles.statisticsOrganization,
            parseInt(x.content, 10) && onClick && styles.statisticsOrganization.pointer,
          ].filter(exists => exists)}
          onClick={() => {
            if (parseInt(x.content, 10) && onClick) onClick(x);
          }}
        >
          <div style={styles.statisticsOrganization.content}>{x.content}</div>
          <div style={styles.statisticsOrganization.label}>{x.label}</div>
        </div>
      </div>
    );
    return <div>{result}</div>;
  }

  renderStatistics() {
    const { data, onClick } = this.props;
    const result = data.map((x, key) =>
      <div
        key={key}
        style={[
          styles.statistics,
          parseInt(x.content, 10) && onClick && styles.statistics.pointer,
        ].filter(exists => exists)}
        onClick={() => {
          if (parseInt(x.content, 10) && onClick) onClick(x);
        }}
      >
        <div style={styles.statistics.content}>{x.content}</div>
        <div style={styles.statistics.label}>{x.label}</div>
      </div>
    );
    return <div>{result}</div>;
  }

  renderLocation() {
    const { zoom, item, showAddress, showMap, showGPS, showRectangle } = this.props;

    const lat = item.lat || item.centerLat;
    const lng = item.lng || item.long || item.centerLong;
    const name = item.area || item.name;

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          {showGPS && lat && lng &&
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img alt="location" src="/img/icons/location.png" />
              <div style={{ marginLeft: '10px' }}>
                <Link to={`http://maps.google.com/maps?&z=12&q=${lat}+${lng}&ll=${lat}+${lng}`}>
                  {lat}, {lng}
                </Link>
              </div>
            </div>
          }
          {showAddress && name &&
            <Link to={`http://maps.google.com/maps?&z=12&q=${lat}+${lng}&ll=${lat}+${lng}`}>
              {name}
            </Link>
          }
        </div>
        {showMap && lat && lng &&
          <GoogleMap
            hasCenter={Boolean(false)}
            zoom={zoom || 13}
            showSearch={Boolean(false)}
            points={[{ lat: parseFloat(lat), lng: parseFloat(lng) }]}
            center={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
            height={300}
            context="pointMap"
          />
        }
        {showRectangle &&
          <GoogleMap
            drawRectangle={Boolean(item.cleaningArea)}
            showOnly
            points={item.trashPoints}
            rectangle={item.cleaningArea}
            showSearch={Boolean(false)}
            useGoogleCluster={Boolean(false)}
            height={300}
          />
        }
      </div>
    );
  }

  renderDate() {
    const { text } = this.props;

    return (
      <FormattedDate
        value={text}
        year="numeric"
        month="long"
        day="numeric"
      />
    );
  }

  render() {
    const { children, headerStyle = {}, className, title, text, showIfEmpty, style, wrapperStyle, titleStyle } = this.props;
    if (!showIfEmpty && !text && !children) return null;

    return (
      <div
        style={[wrapperStyle, styles.wrapper, !title && styles.wrapper.nonTitle, titleStyle].filter(exists => exists)}
        className={className}
      >
        {title && <h4 style={[styles.header, headerStyle]}>{title}</h4>}
        <div style={style}>
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

const styles = {
  header: {
    fontSize: '16px',
  },
  statisticsBlock: {
    margin: 'auto',
    float: 'left',
  },
  statisticsOrganization: {
    display: 'flex',
    flexDirection: 'column',
    float: 'right',
    textAlign: 'center',
    pointer: {
      ':hover': {
        cursor: 'pointer',
        color: Colors.primary,
      },
    },
    image: {
      float: 'left',
      display: 'block',
      width: '55px',
      height: '55px',
      margin: 'auto auto auto auto',
    },
    content: {
      fontSize: '28px',
      fontWeight: 'bold',
    },
    margin: '0 16px',
  },
  statistics: {
    display: 'flex',
    flexDirection: 'column',
    float: 'left',
    textAlign: 'center',
    pointer: {
      ':hover': {
        cursor: 'pointer',
        color: Colors.primary,
      },
    },
    content: {
      fontSize: '28px',
      fontWeight: 'bold',
    },
    margin: '0 16px',
  },
  checkboxes: {
    marginTop: '4px',
    text: {
      color: 'black',
    },
  },
  content: {
    hyphens: 'auto',
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
  },
  wrapper: {
    nonTitle: {
      marginTop: '1.33em',
    },
  },
};
