/* eslint-disable */
/*
# TrashMap Widget
# Author: @TrashOut.ngo
*/

(function() {
  (function($, window, document) {
    var TrashMap, self;
    TrashMap = function(elem, options) {
      this.elem = elem;
      this.$elem = $(elem);
      this.options = options;
    };
    self = this;
    TrashMap.prototype = {
      defaults: {
        searchInputId: 'trash-map-search',
        widget: {
          id: '#trash-map'
        },
        map: {
          id: '#map',
          options: {
            center: [48.8620722, 2.352047],
            zoom: 5,
            minZoom: 4,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            mapTypeControl: false,
            navigationControl: true,
            scrollwheel: true,
            streetViewControl: false,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [
                  {
                    visibility: 'off'
                  }
                ]
              }
            ]
          },
          cluster: {
            imagePath: $.fn.config('system.paths.images') + '/trashmap/cluster/m',
            minimumClusterSize: 2,
            zoomOnClick: true,
            averageCenter: true
          },
          zoomDelimiter: 10
        }
      },
      map: {
        object: null,
        cluster: null,
        markers: [],
        initialize: false
      },
      data: {
        trashlist: [],
        trashlistGeocells: [],
        zoompoints: []
      },
      isUpdatingBoth: false,
      filter: null,
      isInitialized: false,
      canUpdate: true,
      cb: {},
      xtoken: '',
      init: function() {
        this.config = $.extend(true, {}, this.defaults, this.options);
        self = this;
        this.isInitialized = true;
        this.initLoader();
        this.initMap();
        this.initSearch();
        return this;
      },
      initMap: function() {
        self.isProcessing = false;
        this.map.object = $(this.config.map.id);
        this.map.object.gmap3(this.config.map.options).on({
          idle: function(e,x) {
            if (self.isProcessing === false) {
              self.updateMap();
              self.setMapType();
            } else {
              self.isProcessing = false;
            }
          },
          tilesloaded: function() {
            if (self.map.initialize === false) {
              self.map.initialize = true;
              self.isProcessing = true;
              self.setMapType();
              self.updateMap();
            }
          },
          bounds_changed: function() {
            self.isProcessing = true;
            self.setMapType();
          },
        });
        this.setMapType();
      },

      initSearch: function () {
        const input = document.getElementById(this.config.searchInputId);
        if (!input) {
          return;
        }

        const map = this.getMap();

        // data fields that we need
        const autocomplete = new google.maps.places.Autocomplete(input, {
          fields: ["geometry"],
        });

        autocomplete.bindTo("bounds", map);
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

        autocomplete.addListener("place_changed", function () {
          const place = autocomplete.getPlace();

          if (!place.geometry || !place.geometry.location) {
            return;
          }

          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }
        });
      },

      getMap: function() {
        return self.map.object.gmap3().get(0);
      },
      addMarkers: function() {
        var currenZoom, i, index, map, marker, marker_icon, obj, tmpData;
        map = self.map.object.gmap3().get(0);
        currenZoom = map.getZoom();
        tmpData = self.data.zoompoints[currenZoom];
        for (i in tmpData) {
          obj = tmpData[i];
          if (obj.hasOwnProperty('counts')) {
            self.data.zoompoints[currenZoom][i].onMap = true;
            index = $.fn.getClusterIcon(obj.counts.cleaned, obj.counts.less + obj.counts.more, obj.counts.stillHere, obj.counts.updateNeeded);
            marker_icon = $.fn.config('system.paths.images') + '/trashmap/cluster/m' + index + '.png';
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(obj.lat, obj.long),
              label: '' + $.fn.humanRound(obj.counts.cleaned + obj.counts.less + obj.counts.more + obj.counts.stillHere),
              map: map,
              icon: {
                url: marker_icon,
                anchor: new google.maps.Point(30, 30)
              }
            });
            marker.addListener('click', function() {
              self.isUpdatingBoth = true;
              map.setZoom(map.getZoom() + 2);
              return map.setCenter(this.position);
            });
            self.map.markers.push(marker);
          }
        }
        return true;
      },
      addCluster: function(data, init) {
        var i, marker, markers, obj;
        if (init == null) {
          init = false;
        }
        markers = [];
        for (i in data) {
          obj = data[i];
          if (init || !(obj.id in self.data.trashlist)) {
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(obj.gps.lat, obj.gps.long),
              options: {
                icon: self.getMarkerIcon(obj.status, obj.updateNeeded)
              },
              data: {
                id: obj.id,
                activityId: obj.activityId,
                size: obj.size,
                status: obj.status,
                types: obj.types,
                accessibility: obj.accessibility,
                note: obj.note,
                updateNeeded: obj.updateNeeded,
              },
              map: self.map.object.gmap3().get(0),
              id: obj.id,
              hasListener: false,
            });
            google.maps.event.addListener(marker, 'click', function() {
              self.cb.onClick(this.id);
            });
            marker.hasListener = true;
            markers.push(marker);
            self.data.trashlist[obj.id] = obj;
          }
        }

        var styles = [
          { width: 64, height: 64, url: $.fn.config('system.paths.images') + '/trashmap/cluster/m0.png' },
          { width: 64, height: 64, url: $.fn.config('system.paths.images') + '/trashmap/cluster/m1.png' },
          { width: 64, height: 64, url: $.fn.config('system.paths.images') + '/trashmap/cluster/m2.png' },
          { width: 64, height: 64, url: $.fn.config('system.paths.images') + '/trashmap/cluster/m3.png' },
          { width: 64, height: 64, url: $.fn.config('system.paths.images') + '/trashmap/cluster/m4.png' },
          { width: 64, height: 64, url: $.fn.config('system.paths.images') + '/trashmap/cluster/m5.png' },
          { width: 64, height: 64, url: $.fn.config('system.paths.images') + '/trashmap/cluster/m6.png' },
          { width: 64, height: 64, url: $.fn.config('system.paths.images') + '/trashmap/cluster/m7.png' },
          { width: 64, height: 64, url: $.fn.config('system.paths.images') + '/trashmap/cluster/m8.png' },
          { width: 64, height: 64, url: $.fn.config('system.paths.images') + '/trashmap/cluster/m9.png' },
          { width: 64, height: 64, url: $.fn.config('system.paths.images') + '/trashmap/cluster/m10.png' }
        ];

        if (self.map.cluster === null) {
          MarkerClusterer.prototype.setCalculator($.fn.customCalculator);
          self.map.cluster = new MarkerClusterer(self.map.object.gmap3().get(0), markers, { styles: styles });
        } else {
          self.map.cluster.addMarkers(markers);
        }
        self.applyFilterTrashList();
        return true;
      },
      setMapType: function() {
        var map, zoom;
        map = self.map.object.gmap3().get(0);
        zoom = map.getZoom();
        if (zoom <= 14) {
          return map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
        } else if (zoom > 14 && zoom < 17) {
          return map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
        } else if (zoom >= 17) {
          return map.setMapTypeId(google.maps.MapTypeId.HYBRID);
        }
      },
      getTrashList: function(geocells, filter) {
        var cfg, query;
        if (geocells === null || geocells.length === 0) {
          return false;
        }
        $.each(geocells, function(key, obj) {
          return self.data.trashlistGeocells[obj] = {};
        });
        cfg = $.fn.config('system.api');
        query = {
          attributesNeeded: 'id,status,types,size,created,updateNeeded,gpsShort,note,spam,unreviewed,accessibility',
          geocells: geocells,
          limit: 10000,
          page: 1
        };
        if (!filter) filter = { page: 1, limit: 100000 };
        return $.ajax({
          url: cfg.domain + cfg.endpoints.trashList + '?' + $.param(Object.assign(filter, query)),
          async: true,
          headers: {
            'X-token': self.xtoken
          }
        }).done(function(data) {
          $.each(data, function(key, obj) {
            return self.data.trashlistGeocells[obj.geocell] = {};
          });
          self.addCluster(data);
        }).fail(function(reason) {
          self.cb.onError(reason, function() { self.getTrashList(geocells, filter) });
          $.each(geocells, function(key, obj) {
            return delete self.data.trashlistGeocells[obj];
          });
        });
      },
      drawTrashList: function() {
        var data, geocells;
        if (self.data.trashlist.length > 0 && self.map.cluster === null) {
          self.clearMap();
          self.addCluster(self.data.trashlist, true);
        }
        geocells = self.filterGeocellsTrashList(self.getGeocells());
        return data = self.getTrashList(geocells, self.filter);
      },
      getZoomPoints: function(zoomLevel, geocells, filter) {
        var cfg, query;
        if (zoomLevel === null || geocells === null || geocells.length === 0) {
          return false;
        }
        if (!self.data.zoompoints[zoomLevel] || typeof self.data.zoompoints[zoomLevel] === void 0) {
          self.data.zoompoints[zoomLevel] = [];
        }
        $.each(geocells, function(key, obj) {
          return self.data.zoompoints[zoomLevel][obj] = {};
        });
        cfg = $.fn.config('system.api');
        query = {
          zoomLevel: zoomLevel,
          geocells: geocells,
        };

        if (!filter) filter = { page: 1, limit: 100000 };
        return $.ajax({
          url: cfg.domain + cfg.endpoints.zoomPoints + '?' + $.param(Object.assign(filter, query)),
          async: true,
          headers: {
            'X-token': self.xtoken
          }
        }).done(function(data) {
          $.each(data, function(key, obj) {
            return self.data.zoompoints[zoomLevel][obj.geocell] = obj;
          });
          self.updateMap();
          return true;
        }).fail(function(reason) {
          self.cb.onError(reason, function() { self.getZoomPoints(zoomLevel, geocells, filter) });
          $.each(geocells, function(key, obj) {
            return delete self.data.zoompoints[zoomLevel][obj];
          });
          return true;
        });
      },
      drawZoomPoints: function(filter) {
        var geocells, map;
        if (!filter && this.filter) {
          filter = this.filter;
        }
        map = self.map.object.gmap3().get(0);
        geocells = self.filterGeocellsZoomPoints(map.getZoom(), self.getGeocells());
        self.getZoomPoints(map.getZoom(), geocells, filter);
        return self.addMarkers();
      },
      setFilter: function(filter) {
        this.filter = filter;
      },
      updateMap: function(clear) {
        var map;
        if (clear == null) {
          clear = true;
        }
        if (!self.map.initialize) {
           return false;
        }

        map = this.map.object.gmap3().get(0);

        if (map.getZoom() <= 10) {
          if (clear) {
            self.clearMap();
          }
          return this.drawZoomPoints();
        } else {
          self.clearMap('all');
          return this.drawTrashList();
        }
      },
      clearMap: function(type) {
        var i;
        if (type == null) {
          type = 'all';
        }
        if (type === 'all' || type === 'trash') {
          if (this.map.cluster) {
            this.map.cluster.clearMarkers();
            this.map.cluster = null;
          }
        }
        if (type === 'all' || type === 'zoompoint') {
          if (this.map.markers && this.map.markers.length) {
            i = 0;
            while (i < this.map.markers.length) {
              this.map.markers[i].setMap(null);
              i++;
            }
            return this.map.markers = [];
          }
        }
      },
      initLoader: function() {
        $(document).ajaxStart(function() {
          return $('.spinner').removeClass('hide');
        });
        return this.stopLoader();
      },
      stopLoader: function() {
        $(document).ajaxStop(function() {
          return $('.spinner').addClass('hide');
        });
      },
      getMarkerIcon: function(status, updateNeeded) {
        var imgPath;
        imgPath = $.fn.config('system.paths.images') + '/trashmap/';
        if (status === 'cleaned') {
          return imgPath + 'map_cleaned.png';
        } else if (updateNeeded) {
          return imgPath + 'map_unknown.png';
        } else {
          return imgPath + 'map_reported.png';
        }
      },
      filterGeocellsZoomPoints: function(zoom, geocells) {
        var result;
        result = [];
        $.each(geocells, function(key, obj) {
          if (typeof self.data.zoompoints[zoom] === 'undefined') {
            return result.push(obj);
          } else if (typeof self.data.zoompoints[zoom][obj] === 'undefined') {
            return result.push(obj);
          }
        });
        return result;
      },
      filterGeocellsTrashList: function(geocells) {
        var result;
        result = [];
        $.each(geocells, function(key, obj) {
          return result.push(obj);
        });
        return result;
      },
      getGeocells: function() {

        var Geomodel, bb, geocell1, geocell2, geocells1, geocells2, map, ne, sw, zoom;
        if (!self.map.initialize) {
         return false;
        }
        map = this.map.object.gmap3().get(0);
        zoom = map.getZoom();
        Geomodel = create_geomodel();
        ne = map.getBounds().getNorthEast();
        geocells1 = Geomodel.generate_geocells(Geomodel.create_point(ne.lat(), ne.lng()));
        geocell1 = geocells1[this.getGeocellResolution(zoom)];
        sw = map.getBounds().getSouthWest();
        geocells2 = Geomodel.generate_geocells(Geomodel.create_point(sw.lat(), sw.lng()));
        geocell2 = geocells2[this.getGeocellResolution(zoom)];
        bb = Geomodel.interpolate(geocell1, geocell2);
        return bb;
      },
      applyFilterTrashList: function(filter) {
        var data, filter, i, obj, tmpData, visibility;
        if (this.filter) {
          filter = this.filter;
        }
        else return;
        if (self.map.cluster === null) {
          return;
        }
        tmpData = self.map.cluster.getMarkers();
        for (i in tmpData) {
          visibility = true;
          obj = tmpData[i];

          if (filter['trashStatus'] && $.inArray('updateNeeded', filter['trashStatus'].split(',')) > -1) {
            filter['trashStatus'].push('more');
            filter['trashStatus'].push('less');
          }

          if (filter['trashSize'] && $.inArray(obj.data.size, filter['trashSize'].split(',')) === -1) {
            visibility = false;
          } else if (filter['trashType'] && $.isArray(obj.data.types) && $.fn.arrayIntersect(filter['trashType'].split(','), obj.data.types).length === 0) {
            visibility = false;
          } else if (filter['trashStatus'] && $.inArray(obj.data.status, filter['trashStatus'].split(',')) === -1) {
            visibility = false;
          } else if (filter['trashNote']) {
            if (!obj.data.note) {
              visibility = false;
            } else if (obj.data.note.indexOf(filter.trashNote) === -1) {
              visibility = false;
            }
          } else if (filter.trashAccessibility) {
            visibility = Object.keys(obj.data.accessibility).reduce(function(prev, cur) {
              if (prev) return true;
              if (!obj.data.accessibility[cur] && $.inArray(cur, filter.trashAccessibility)) return false;
              return true;
            }, false);
          }
          obj.setVisible(visibility);
        }
        return self.map.cluster.repaint();
      },
      getGeocellResolution: function(zoom) {
        var fix;
        if (!zoom) {
          return;
        }
        fix = -1;
        switch (zoom) {
          case 1:
          case 2:
          case 3:
          case 4:
            return 2 + fix;
          case 5:
          case 6:
            return 3 + fix;
          case 7:
          case 8:
            return 4 + fix;
          case 9:
          case 10:
            return 5 + fix;
          case 11:
          case 12:
            return 6 + fix;
          case 13:
          case 14:
            return 7 + fix;
          case 15:
          case 16:
            return 8 + fix;
          case 17:
          case 18:
            return 9 + fix;
          case 19:
          case 20:
          case 21:
            return 7 + fix;
          default:
            return 8 + fix;
            break;
        }
      }
    };
    TrashMap.defaults = TrashMap.prototype.defaults;
    var trashmap = null;
    window.TrashMap = function(options) {
      if (!this.trashmap) this.trashmap = new TrashMap(this, options);
      return this.trashmap;
    };
  })(jQuery, window, document);
}).call(this);
