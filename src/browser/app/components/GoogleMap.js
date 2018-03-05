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
import DrawingManager from 'react-google-maps/lib/drawing/DrawingManager';
import FlatButton from 'material-ui/FlatButton';
import Link from './Link';
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer';
import Radium from 'radium';
import React, { PureComponent as Component } from 'react';
import SearchBox from 'react-google-maps/lib/places/SearchBox';
import translate from '../../../messages/translate';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { setCenter, setZoom, setMap, switchDrawing, clearMap, enableScrollwheel } from '../../../common/map/actions';
import { withGoogleMap, GoogleMap as GMap, Marker, InfoWindow } from 'react-google-maps';

const MAP_CONTEXT = '__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED';
const google = process.env.IS_BROWSER ? global.window.google : null;

@translate
@withGoogleMap
@connect(state => ({
  center: state.map.center,
  drawing: state.map.drawing,
  drawingEnabled: state.map.drawingEnabled,
  isScrollwheelEnabled: state.map.isScrollwheelEnabled,
  map: state.map.map,
  customMaps: state.map.customMaps,
  zoom: state.map.zoom,
}),
{ setCenter, setZoom, setMap, switchDrawing, enableScrollwheel })
@Radium
class GoogleMapContainer extends Component {
  static propTypes = {
    center: React.PropTypes.array,
    map: React.PropTypes.object,
    zoom: React.PropTypes.number,
    setCenter: React.PropTypes.func.isRequired,
    setZoom: React.PropTypes.func.isRequired,
    setMap: React.PropTypes.func.isRequired,
  };

  state = {
    mapLoaded: false,
    showedInfoBox: null,
    searchBox: null,
  }

  onChange(once) {
    const { setCenter, onIdle } = this.props;

    if (!once || !this.state.mapLoaded) {
      if (setCenter) setCenter();
      if (onIdle) onIdle();
      if (once) this.setState({ mapLoaded: true });
    }
  }

  @autobind
  onPlacesChanged() {
    const { setCenter, setZoom } = this.props;
    const places = this.state.searchBox.getPlaces();

    const markers = places.map(place => ({
      position: place.geometry.location,
    }));
    if (markers.length > 0) {
      const mapCenter = markers[0].position;
      setCenter({
        lat: mapCenter.lat(),
        lng: mapCenter.lng(),
      });
      setZoom(11);
    }
  }

  insertCurrentRectangle() {
    const { map, rectangle, switchDrawing } = this.props;

    const k = 0.003;
    const n = rectangle.north + k;
    const e = rectangle.east + k;
    const s = rectangle.south - k;
    const w = rectangle.west - k;

    const sw = new google.maps.LatLng(s, w);
    const ne = new google.maps.LatLng(n, e);

    const overlay = new google.maps.Rectangle({
      ...drawingOptions.rectangleOptions,
      bounds: rectangle,
      map: map.context[MAP_CONTEXT],
    });
    map.fitBounds(new google.maps.LatLngBounds(sw, ne));

    switchDrawing({
      type: 'rectangle',
      overlay,
    });
  }

  toggleInfoBox(key, show) {
    this.setState({ showedInfoBox: show ? key : null });
  }

  renderSearch() {
    const { msg, showSearch } = this.props;
    if (!showSearch) return null;


    return (
      <SearchBox
        ref={(searchBox) => {
          this.setState({ searchBox });
          const mapElement = document.getElementById('googlemaps_searchbox');
          if (mapElement) {
            mapElement.addEventListener('keydown', (e) => { if (event.keyCode === 13) { e.stopPropagation(); e.preventDefault(); } });
          }
        }}
        controlPosition={google.maps.ControlPosition.TOP_RIGHT}
        onPlacesChanged={this.onPlacesChanged}
        inputPlaceholder={msg('global.findPlace')}
        inputStyle={mapOverlayStyle.search}
        inputProps={{
          id: 'googlemaps_searchbox',
        }}
      />
    );
  }

  renderLoading() {
    const { msg, isFetching } = this.props;
    if (!isFetching) return null;
    return (<div style={style.loading}><div>{msg('global.loading')}</div></div>);
  }

  renderCenter() {
    const { hasCenter } = this.props;
    if (!hasCenter) return null;
    return (<div style={style.centerMarker} />);
  }

  renderCluster(showedInfoBox) {
    const { drawRectangle, onMarkerToggle, points, useGoogleCluster } = this.props;

    const selectedIcon = new google.maps.MarkerImage('/img/selected.png',
      new google.maps.Size(32, 32),
      new google.maps.Point(0, 0),
      new google.maps.Point(16, 16)
    );
    const unselectedIcon = new google.maps.MarkerImage('/img/unselected.png',
      new google.maps.Size(32, 32),
      new google.maps.Point(0, 0),
      new google.maps.Point(16, 16)
    );
    const pointsMarkers = points && points.map((x, key) =>
      <Marker
        position={{ lat: parseFloat(x.lat), lng: parseFloat(x.lng || x.long) }}
        icon={!x.useDefaultIcon && drawRectangle && ((x.selected) ? selectedIcon : unselectedIcon)}
        onClick={() => onMarkerToggle(x.id)}
        onMouseOver={() => this.toggleInfoBox(key, true)}
        key={key}
      >
        {((!drawRectangle && x.selected) || showedInfoBox === key) && (
          <InfoWindow onCloseClick={() => this.toggleInfoBox(key, false)}>
            <div style={{ width: '100%' }}>
              {(x.isText && x.name) || <Link to={x.link || `../detail/${x.id}`}>{x.name}</Link>}
            </div>
          </InfoWindow>
        )}
      </Marker>
    );
    if (!pointsMarkers) return null;
    if (useGoogleCluster) {
      return (
        <MarkerClusterer
          averageCenter
          enableRetinaIcons
          gridSize={160}
          zoomOnClick
        >
          {pointsMarkers}
        </MarkerClusterer>
      );
    }
    return pointsMarkers;
  }

  renderRectangle() {
    const { showOnly, map, drawRectangle, drawing, msg, onChange, rectangle, switchDrawing } = this.props;
    if (!drawRectangle || !map || !map.context) return null;

    if (drawRectangle && rectangle && !drawing) this.insertCurrentRectangle();

    const drawManager = (<DrawingManager
      defaultDrawingMode={google.maps.drawing.OverlayType.RECTANGLE}
      onOverlayComplete={(data) => {
        switchDrawing(data);
        onChange(data.overlay.bounds.toJSON());
      }}
      defaultOptions={drawingOptions}
    />);

    const button = !showOnly && (<FlatButton
      style={{ ...mapOverlayStyle, ...mapOverlayStyle.removeRectangle }}
      onClick={() => {
        switchDrawing();
        onChange(false);
      }}
      label={msg('event.map.removeRectangle')}
      backgroundColor="#F44336"
      hoverColor="#C62828"
    />);

    return drawing ? button : drawManager;
  }

  render() {
    const {
      center,
      defaultCenter,
      defaultZoom,
      enableScrollwheel,
      isScrollwheelEnabled,
      setMap,
      zoom,
      minZoom,
    } = this.props;

    const { showedInfoBox } = this.state;

    const c = defaultCenter || { lat: center[0], lng: center[1] };
    const z = defaultZoom || zoom;

    return (
      <GMap
        ref={setMap}
        center={c}
        zoom={z}
        onDragEnd={() => this.onChange(false)}
        onBoundsChanged={() => this.onChange(true)}
        onClick={enableScrollwheel}
        options={{
          minZoom: minZoom || 4,
          scrollwheel: isScrollwheelEnabled,
        }}
        onZoomChanged={() => this.onChange(false)}
      >
        {this.renderSearch()}
        {this.renderLoading()}
        {this.renderCenter()}
        {this.renderCluster(showedInfoBox)}
        {this.renderRectangle()}
      </GMap>
    );
  }
}


@connect(state => ({
  stateCenter: state.map.center,
  stateZoom: state.map.zoom,
}), { setCenter, clearMap })
export default class GoogleMap extends Component { // eslint-disable-line react/no-multi-comp
  defaultProps = {
    showSearch: true,
    useGoogleCluster: true,
  };

  componentWillMount() {
    const { center, drawRectangle, setCenter, rectangle, stateCenter, clearMap } = this.props;
    clearMap();

    if (drawRectangle && rectangle) {
      this.setCenterFromRectangle(rectangle);
      return;
    }

    if (stateCenter && (!center || (center[0] === 0 && center[1] === 0))) {
      if (Array.isArray(stateCenter)) {
        setCenter({ lat: stateCenter[0], lng: stateCenter[1] });
      } else {
        setCenter(stateCenter);
      }
      return;
    }

    if (center) {
      if (Array.isArray(center)) setCenter({ lat: center[0], lng: center[1] });
      else setCenter(center);
      return;
    }
  }

  componentWillUpdate(nextProps) {
    const { onChange, rectangle, stateCenter: center, zoom, drawRectangle } = this.props;

    if (drawRectangle && ((!rectangle && nextProps.rectangle) || (nextProps.rectangle && (nextProps.rectangle !== rectangle)))) {
      this.setCenterFromRectangle(nextProps.rectangle);
    }

    if ((center !== nextProps.stateCenter || zoom !== nextProps.zoom) && onChange && !drawRectangle) {
      onChange({
        lat: nextProps.stateCenter[0],
        lng: nextProps.stateCenter[1],
      });
    }
  }

  setCenterFromRectangle(rectangle) {
    const { setCenter } = this.props;
    const n = rectangle.north;
    const e = rectangle.east;
    const s = rectangle.south;
    const w = rectangle.west;
    const c = { lat: (n + s) / 2.0, lng: (e + w) / 2.0 };
    setCenter(c);
  }

  render() {
    const {
      center,
      drawRectangle,
      hasCenter,
      height,
      isFetching,
      minZoom,
      onChange,
      onIdle,
      points,
      rectangle,
      showOnly,
      showSearch,
      stateZoom,
      useGoogleCluster,
      zoom,
      onMarkerToggle,
    } = this.props;

    return (
      <GoogleMapContainer
        onIdle={onIdle}
        defaultCenter={center}
        defaultZoom={zoom || stateZoom || 10}
        drawRectangle={drawRectangle}
        hasCenter={hasCenter}
        isFetching={isFetching}
        onChange={onChange}
        onMarkerToggle={(id) => onMarkerToggle && onMarkerToggle(id)}
        points={points}
        rectangle={rectangle}
        showSearch={showSearch}
        useGoogleCluster={useGoogleCluster}
        showOnly={showOnly}
        minZoom={minZoom}
        containerElement={
          <div style={{ height: `${height || 600}px` }} />
        }
        mapElement={
          <div style={{ height: `${height || 600}px` }} />
        }
      />
    );
  }
}

GoogleMap.propTypes = GoogleMapContainer.propTypes = {
  center: React.PropTypes.object,
  clearMap: React.PropTypes.func,
  defaultCenter: React.PropTypes.obj,
  drawRectangle: React.PropTypes.bool,
  hasCenter: React.PropTypes.bool,
  height: React.PropTypes.number,
  isFetching: React.PropTypes.bool,
  minZoom: React.PropTypes.number,
  onChange: React.PropTypes.func,
  onIdle: React.PropTypes.func,
  onMarkerToggle: React.PropTypes.func,
  points: React.PropTypes.number,
  rectangle: React.PropTypes.obj,
  setCenter: React.PropTypes.func,
  showOnly: React.PropTypes.bool,
  showSearch: React.PropTypes.bool,
  stateCenter: React.PropTypes.number,
  stateZoom: React.PropTypes.number,
  useGoogleCluster: React.PropTypes.bool,
  zoom: React.PropTypes.number,
  switchDrawing: React.PropTypes.func,
  defaultZoom: React.PropTypes.number,
  enableScrollwheel: React.PropTypes.func,
  isScrollwheelEnabled: React.PropTypes.bool,
  drawing: React.PropTypes.object,
  msg: React.PropTypes.func,
};

const drawingOptions = {
  drawingControl: true,
  drawingControlOptions: {
    position: google && google.maps.ControlPosition.TOP_RIGHT,
    drawingModes: [
      google && google.maps.drawing.OverlayType.RECTANGLE,
    ],
  },
  rectangleOptions: {
    fillColor: '#ff00ff',
    fillOpacity: 0.3,
    strokeWeight: 2,
    clickable: false,
    editable: false,
    zIndex: 1,
    geodesic: false,
  },
};

const mapOverlayStyle = {
  position: 'absolute',
  right: '2%',
  search: {
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
  },
  removeRectangle: {
    bottom: 'calc(600px - 140px)',
    color: 'white',
  },
};

const style = {
  centerMarker: {
    width: '32px',
    height: '32px',
    left: 'calc(50% - 16px)',
    top: '50%',
    position: 'absolute',
    backgroundImage: 'url("/img/marker.png")',
  },
  cluster: {
    background: 'url("/img/cluster.png")',
    width: '56px',
    height: '55px',
    ':hover': {
      cursor: 'pointer',
      background: 'black',
    },
    text: {
      padding: '0',
      margin: '0',
      width: '100%',
      height: '100%',
      textAlign: 'center',
      paddingTop: '19px',
      fontSize: '12px',
    },
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

