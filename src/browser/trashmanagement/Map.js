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
import '../../../assets/widget/assets/css/app.css';
import '../../../assets/widget/assets/css/components.css';
import '../../../assets/widget/vendor/fancybox/helpers/jquery.fancybox-buttons.css';
import '../../../assets/widget/vendor/fancybox/jquery.fancybox.css';
import Paper from 'material-ui/Paper';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import Script from 'react-load-script';
import { connect } from 'react-redux';
import { renewToken } from '../../common/lib/redux-firebase/actions';
import { setCenter, setZoom } from '../../common/map/actions';
import translate from '../../messages/translate';

@translate
@connect(state => ({
  zoom: state.map.zoom,
  cluster: state.trashes.cluster,
  isFetching: state.table.isFetching || state.trashes.isFetching,
  results: state.table.map,
  tab: state.trashes.selectedTab,
  currentPosition: state.map.currentPosition,
  map: state.map.map,
  center: state.map.center,
  filter: state.table.filter,
  xtoken: state.users.viewer.token,
}), { setCenter, setZoom, renewToken })
class TrashMap extends Component {
  static propTypes = {
    center: React.PropTypes.array,
    currentPosition: React.PropTypes.array,
    filter: React.PropTypes.object,
    setCenter: React.PropTypes.func,
    setZoom: React.PropTypes.func,
    zoom: React.PropTypes.number,
    renewToken: React.PropTypes.func.isRequired,
    xtoken: React.PropTypes.string,
    msg: React.PropTypes.func,
  };

  componentDidMount() {
    const { renewToken, filter, setCenter, setZoom, center, zoom, currentPosition, xtoken } = this.props;
    const trashMap = window.TrashMap({
      map: {
        options: {
          center: currentPosition || center,
          zoom,
        },
      },
    });

    if (trashMap) {
      trashMap.map.cluster = null;
      trashMap.filter = filter.toFilter(true);
      trashMap.cb.onError = ({ status }, callback) => {
        trashMap.stopLoader();
        if (status === 440) {
          renewToken((token) => {
            trashMap.xtoken = token;
            if (callback) callback();
          });
        }
      };
      trashMap.cb.onClick = (trashId) => window.open(`${routesList.trashDetail.replace(':id', trashId)}`);
      trashMap.xtoken = xtoken;
      trashMap.init();

      const map = trashMap.getMap();
      map.addListener('idle', () => {
        setZoom(map.getZoom());
        setCenter(map.getCenter());
      });
    }
  }

  componentWillUpdate(nextProps) {
    const { center, filter, zoom } = this.props;
    const trashMap = window.TrashMap();
    const zoomChanged = nextProps.zoom !== zoom;
    const centerChanged = nextProps.center !== center;

    if (trashMap && (centerChanged || zoomChanged)) {
      if (zoomChanged) {
        trashMap.data.zoompoints = [];
      }
      trashMap.updateMap();
    }

    if (trashMap && nextProps.filter !== filter) {
      trashMap.data.zoompoints = [];
      trashMap.data.trashlistGeocells = [];
      trashMap.data.trashlist = [];
      trashMap.setFilter(nextProps.filter.toFilter(true));
      trashMap.applyFilterTrashList();
      trashMap.updateMap();
    }
  }

  componentWillUnmount() {
    const trashMap = window.TrashMap();
    trashMap.clearMap();
    trashMap.data = {
      trashlist: [],
      trashlistGeocells: [],
      zoompoints: [],
    };
  }

  render() {
    const { msg } = this.props;

    return (
      <Paper>
        <div id="trash-map" className="widget">
          <div style={{ display: 'none' }}>
            <input
              type="text"
              id="trash-map-search"
              style={searchStyle}
              placeholder={msg('global.findPlace')}
            />
          </div>
          <div id="map" style={{ height: '600px' }} />
          <div className="spinner hide">
            <div className="rect1" />
            <div className="rect2" />
            <div className="rect3" />
            <div className="rect4" />
            <div className="rect5" />
          </div>
        </div>
      </Paper>
    );
  }
}

@connect(state => ({
  widgetJsFilename: state.device.widgetJsFilename,
}), null)
export default class TrashMapWrapper extends Component { // eslint-disable-line react/no-multi-comp

  static propTypes = {
    widgetJsFilename: React.PropTypes.string,
  };

  state = {
    scriptLoaded: false,
    scriptLoadedError: false,
  };

  render() {
    const { scriptLoadedError, scriptLoaded } = this.state;
    const { widgetJsFilename } = this.props;

    return (<div>
      <Script
        url={widgetJsFilename}
        onLoad={() => this.setState({ scriptLoaded: true })}
        onError={() => this.setState({ scriptLoadedError: true })}
      />
      {!scriptLoadedError && scriptLoaded &&
        <TrashMap />
      }
    </div>);
  }
}

const searchStyle = {
  boxSizing: 'border-box',
  MozBoxSizing: 'border-box',
  border: '1px solid transparent',
  width: '200px',
  height: '32px',
  marginTop: '27px',
  padding: '0 12px',
  borderRadius: '1px',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
  fontSize: '14px',
  outline: 'none',
  textOverflow: 'ellipses',
  marginRight: '10px',
};
