/**
 * TrashOut is an environmental project that teaches people how to recycle
 * and showcases the worst way of handling waste - illegal dumping. All you need is a smart phone.
 *
 *
 * There are 10 types of programmers - those who are helping TrashOut and those who are not.
 * Clean up our code, so we can clean up our planet.
 * Get in touch with us: help@trashout.ngo
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * See the GNU General Public License for more details: <https://www.gnu.org/licenses/>.
*/


(function() {
  (function($) {
    $.fn.getQueryVariable = function(name, url) {
      var regex, results;
      if (!url) {
        url = window.location.href;
      }
      name = name.replace(/[\[\]]/g, '\\$&');
      regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
      results = regex.exec(url);
      if (!results) {
        return null;
      }
      if (!results[2]) {
        return '';
      }
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    };
    $.fn.getQueryObject = function(url) {
      var search;
      if (url) {
        search = url.substring(1);
      } else {
        search = location.search.substring(1);
      }
      if (search) {
        return JSON.parse('{"' + search.replace(/&/g, '","').replace(RegExp('=', 'g'), '":"') + '"}', (function(key, value) {
          if (key === '') {
            return value;
          } else {
            return decodeURIComponent(value);
          }
        }));
      }
    };
    $.fn.loadJS = function(url, callback) {
      var head, script;
      head = document.getElementsByTagName('head')[0];
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.onreadystatechange = callback;
      script.onload = callback;
      return head.appendChild(script);
    };
    $.fn.isEmpty = function(obj) {
      var hasOwnProperty, key;
      hasOwnProperty = Object.prototype.hasOwnProperty;
      if (typeof obj === 'undefined') {
        return true;
      }
      if (obj === null) {
        return true;
      }
      if (obj.length > 0) {
        return false;
      }
      if (obj.length === 0) {
        return true;
      }
      if (typeof obj !== 'object') {
        return true;
      }
      for (key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          return false;
        }
      }
      return true;
    };
    $.fn.arrayIntersect = function(a, b) {
      var t;
      t = void 0;
      if (b.length > a.length) {
        t = b;
        b = a;
        a = t;
      }
      return a.filter(function(e) {
        if (b.indexOf(e) !== -1) {
          return true;
        }
      });
    };
    $.fn.round = function(nr, precision) {
      if (precision == null) {
        precision = 0;
      }
      return nr.toFixed(precision);
    };
    $.fn.truncate = function(nr){
        return Math.trunc(nr);    
    }
    $.fn.humanRound = function(nr) {
      var i, j, nr_rounded, sign, sizes, values;
      sizes = ['', 'K', 'M', 'G', 'T'];
      values = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
      if (nr < 10) {
        return nr;
      }
      sign = '';
      if (nr >= 10) {
        sign = '+';
      }
      i = parseInt(Math.floor(Math.log(nr) / Math.log(1000)));
      nr_rounded = parseInt($.fn.truncate(nr / Math.pow(1000, i)));
      j = 0;
      while (j < values.length - 1) {
        if (nr_rounded >= values[j] && nr_rounded < values[j + 1]) {
          nr_rounded = values[j];
          break;
        }
        j++;
      }
      return nr_rounded + sizes[i] + sign;
    };
    $.fn.getClusterIcon = function(cleaned, moreLess, stillHere, updateNeeded) {
      var index;
      index = 2;
      if (updateNeeded === 0) {
        if (cleaned > (stillHere + moreLess)) {
          index = 4;
        } else {
          index = 2;
        }
        if ((cleaned > 0) && (stillHere + moreLess === 0)) {
          index = 9;
        }
        if ((cleaned === 0) && (stillHere + moreLess > 0)) {
          index = 8;
        }
      } else if (updateNeeded === (stillHere + moreLess + cleaned)) {
        index = 8;
      } else {
        if (cleaned >= updateNeeded) {
          index = 4;
        } else if ((cleaned > 0) && (updateNeeded > cleaned)) {
          index = 2;
        } else if (((stillHere + moreLess - updateNeeded) >= updateNeeded) && (cleaned === 0)) {
          index = 8;
        } else if (((stillHere + moreLess - updateNeeded) < updateNeeded) && (cleaned === 0)) {
          index = 8;
        } else {
          index = 2;
        }
      }
      return index;
    };
    $.fn.customCalculator = function(markers, numStyles) {
      var count, index, result;
      index = 0;
      count = markers.length;
      result = $.fn.groupByAndSum(markers);
      result.cleaned = result.cleaned || 0;
      result.less = result.less || 0;
      result.more = result.more || 0;
      result.stillHere = result.stillHere || 0;
      result.updateNeeded = result.updateNeeded || 0;
      index = $.fn.getClusterIcon(result.cleaned, result.less + result.more, result.stillHere, result.updateNeeded);
      return {
        text: $.fn.humanRound(count),
        index: index + 1
      };
    };
    $.fn.groupByAndSum = function(arr) {
      var hist, i, result, trash;
      hist = {};
      result = [];
      for (i in arr) {
        trash = arr[i];
        if (trash.data.updateNeeded === 1) {
          result.push('updateNeeded');
        }
        result.push(trash.data.status);
      }
      result.map(function(a) {
        if (a in hist) {
          hist[a]++;
        } else {
          hist[a] = 1;
        }
      });
      return hist;
    };
  })(jQuery);

}).call(this);
