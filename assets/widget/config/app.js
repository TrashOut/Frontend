(function() {
  (function($) {
    var _config;
    _config = {
      system: {
        api: {
          domain: '/webapi/',
          endpoints: {
            zoomPoints: 'trash/zoom-point/',
            trashList: 'trash/',
            trashDetail: 'trash/',
            eventDetail: 'event/'
          }
        },
        paths: {
          images: '/widget/assets/images/'
        }
      }
    };
    $.fn.config = function(path) {
      return $.fn.arrPath(_config, path);
    };
    $.fn.arrPath = function(obj, path) {
      var i, len;
      i = 0;
      path = path.split('.');
      len = path.length;
      while (i < len) {
        obj = obj[path[i]];
        i++;
      }
      return obj;
    };
  })(jQuery);

}).call(this);
