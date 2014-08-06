'use strict';

(function() {
  angular.module('eme.services', [])
  .service('URLService', function() {

    var DELIMITER = '.';

    function buildObject(keyArray, val) {
      if (keyArray.length) {
        var obj = {};
        var lastKey = keyArray.pop(); // get and remove last key in keyArray

        obj[lastKey] = val; // {key: previous object}
        return buildObject(keyArray, obj);
      } else {
        return val;
      }
    }

    /**
     * normalize value retrieved from url casting from string to the correct type
     * @param  [string] val [value to convert]
     * @return [string]     [converted value]
     */
    function castValue(val) {
      if (val === 'false') {
        val = false;
      } else if (val === 'true') {
        val = true;
      } else if (/^[0-9.\-]+$/.test(val) && val.split('.').length < 3) {
        val = parseFloat(val);
      }
      return val;
    }

    return {
      /**
       * recursive function to transform object into url params
       */
      serialize: function(input, parent, parentPrefix, normalized) {
        var normalizedData = normalized || {};
        var prefix = parent ? parent + DELIMITER : '';

        prefix = parentPrefix ? parentPrefix + prefix : prefix;

        for (var i in input) {
          if (angular.isObject(input[i])) {
            normalizedData = this.serialize(input[i], i, prefix, normalizedData);
          } else {
            normalizedData[prefix + i] = input[i].toString();
          }
        }
        return normalizedData;
      },

      /**
       * transform url params to object
       * @param  [object] input [url params obtained from $location.search()]
       */
      deserialize: function(input) {
        var denormalizedData = {};

        for (var key in input) {
          var keyArray = key.split('.');      // ['key', 'with', 'dot']
          var val = castValue(input[key]);    // 'value'

          this.extend(true, denormalizedData, buildObject(keyArray, val));
        }

        return denormalizedData;
      },


      /**
       * copy jQuery.extend() function
       * @src https://github.com/jquery/jquery/blob/master/src/core.js#L124
       *
       * modified: jQuery.isFunction => angular.isFunction
       * modified: jQuery.isArray => angular.isArray
       * modified: jQuery.isPlainObject => angular.isObject
       */
      extend: function() {
        var
          options, name, src, copy, copyIsArray, clone,
          target = arguments[0] || {},
          i = 1,
          length = arguments.length,
          deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
          deep = target;

          // skip the boolean and the target
          target = arguments[i] || {};
          i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !angular.isFunction(target)) {
          target = {};
        }

        // extend jQuery itself if only one argument is passed
        if (i === length) {
          target = this;
          i--;
        }

        for (; i < length; i++) {
          // Only deal with non-null/undefined values
          if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
              src = target[name];
              copy = options[name];

              // Prevent never-ending loop
              if (target === copy) {
                continue;
              }

              // Recurse if we're merging plain objects or arrays
              if (deep && copy && (angular.isObject(copy) || (copyIsArray = angular.isArray(copy)))) {
                if (copyIsArray) {
                  copyIsArray = false;
                  clone = src && angular.isArray(src) ? src : [];

                } else {
                  clone = src && angular.isObject(src) ? src : {};
                }

                // Never move original objects, clone them
                target[name] = this.extend(deep, clone, copy);

                // Don't bring in undefined values
              } else if (copy !== undefined) {
                target[name] = copy;
              }
            }
          }
        }

        // Return the modified object
        return target;
      }
    }
  });
}());
