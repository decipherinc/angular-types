/**
 * @file Provides type introspection and utilities to AngularJS.
 */

/* jshint -W018, -W116*/
/* global define, exports, module, require, global */
(function (root, factory) {
  'use strict';

  var angular;

  // if AMD or CommonJS module, return a module.
  if (typeof define === 'function' && define.amd) {
    define(['angular'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('angular'), global);
    // otherwise, attach to global `angular` object.
  } else {
    angular = root.angular;
    angular.extend(angular, factory(angular, root));
  }
})(this, function (angular, root) {

  'use strict';

  root = root || window;

  var isNaN = root.isNaN,
      isFinite = root.isFinite,

      isUndefined = angular.isUndefined,
      isArray = angular.isArray,
      isDate = angular.isDate,
      isElement = angular.isElement,
      isObject = angular.isObject,
      isString = angular.isString,
      isFunction = angular.isFunction,
      isNumber = angular.isNumber,

      extend = angular.extend,
      copy = angular.copy,
      forEach = angular.forEach,

      toString = function toString(value) {
        return Object.prototype.toString.call(value);
      },
      module = {},

      types = {

        Undefined: isUndefined,
        Array: isArray,
        Date: isDate,
        Element: isElement,
        Object: isObject,
        String: isString,
        Function: isFunction,
        Number: isNumber,

        /**
         * Returns `true` if the value is `null`.
         * @param {*} [value] Value to evaluate
         * @alias isNull
         * @returns {boolean}
         */
        Null: function isNull(value) {
          return value === null;
        },

        /**
         * Returns `true` if the value is a boolean.
         * @param {*} [value] Value to evaluate
         * @returns {boolean}
         * @alias isBoolean
         */
        Boolean: function isBoolean(value) {
          return !!value === value;
        },

        /**
         * Returns `true` if the value is a NaN
         * @param {*} [value] Value to evaluate
         * @returns {boolean}
         * @alias isNaN
         */
        NaN: function isNaN(value) {
          return isNumber(value) && value != +value;
        },

        /**
         * Returns `true` if the value is finite
         * @param {*} [value] Value to evaluate
         * @returns {boolean}
         * @alias isFinite
         */
        Finite: function isFinite_(value) {
          return isFinite(value) && !isNaN(+value);
        },

        /**
         * Returns `true` if the value is infinity
         * @param {*} value Value to evaluate
         * @returns {boolean}
         * @alias isInfinite
         */
        Infinite: function isInfinite(value) {
          return value === Infinity;
        },

        /**
         * Returns `true` if the value is an Arguments object
         * @param {*} [value] Value to evaluate
         * @returns {boolean}
         * @alias isArguments
         */
        Arguments: function isArguments(value) {
          return value && types.isObjectish(value) && isNumber(value.length) &&
            toString(value) === '[object Arguments]' || false;
        },

        /**
         * Returns `true` if the value is an Arguments object
         * @param {*} [value] Value to evaluate
         * @returns {boolean}
         * @alias isRegExp
         */
        RegExp: function isRegExp(value) {
          return value && types.isObjectish(value) && toString(value) === '[object RegExp]' ||
            false;
        },

        /**
         * Returns `true` if the value is an objectlike thing with nothing in it.
         * For Arrays, Strings or Arguments, this checks the `length`.
         * @param {*} [value] Value to evaluate
         * @returns {boolean}
         * @alias isEmpty
         */
        Empty: function isEmpty(value) {
          var retval = true,
              length;
          if (!isString(value) && !isArray(value) && !types.isArguments(value) &&
            !types.isObject(value)) {
            return retval;
          }

          length = value.length;
          if ((isArray(value) || isString(value) || types.isArguments(value) ||
            types.isObjectish(value)) && isNumber(length)) {
            return !length;
          }

          angular.forEach(value, function () {
            return (retval = false);
          });

          return retval;
        },

        /**
         * Returns `true` if the value is an integer.
         * @param {*} [value] Value to evaluate
         * @returns {boolean}
         * @alias isInteger
         */
        Integer: function isInteger(value) {
          return types.isNumber(value) && isFinite(value) && value % 1 === 0;
        },

        /**
         * Returns `true` if the value is a float.
         * @param {*} [value] Value to evaluate
         * @returns {boolean}
         * @alias isFloat
         */
        Float: function isFloat(value) {
          return types.isNumber(value) && isFinite(value) && value % 1 !== 0;
        },

        /**
         * Returns `true` if the value accepts properties, and is not a string.
         * @param {*} [value] Value to evaluate
         * @returns {boolean}
         * @alias isObjectish
         */
        Objectish: function isObjectish(value) {
          return typeof value === 'object' && types.isNotNull(value);
        }
      },

      /**
       * @summary Provides a deep clone of a value, retaining prototypes.
       * @description Does not yet support cyclic objects.
       * @todo Support cyclic objects.
       * @param {*} value anything
       * @param {Object} [extra] Extra stuff to put in a plain `Object` `value`; you could use this to potentially overwrite unique identifiers, or something.  If `value` is not a plain `Object` (`angular.isObject(value)` returns false`), this does nothing.
       * @returns {*} anything
       */
      clone = function clone(value, extra) {
        var o;

        extra = extra || {};
        if (types.isNotObjectish(value)) {
          return value;
        }
        else if (isArray(value)) {
          if (isFunction(value.clone)) {
            return value.clone();
          }
          return value.slice().map(function (val) {
            return isObject(val) && isFunction(val.clone) ? val.clone() : clone(val);
          });
        } else if (isDate(value)) {
          return new Date(value.getTime());
        } else if (types.isRegExp(value)) {
          return new RegExp(value, value.toString().match(/[^\/]*$/)[0]);
        } else if (isElement(value)) {
          if (isFunction(value.clone)) {
            return value.clone();
          }
          return value.cloneNode(true);
        }

        o = copy(value);
        forEach(value, function (val, key) {
          o[key] = types.isObjectish(val) && isFunction(val.clone) ? val.clone() : clone(val);
        });
        extend(o, extra);
        return o;
      },

      type = function type(value) {
        var var_type = null,
            checkers = [
              'isNull',
              'isString',
              'isArray',
              'isDate',
              'isRegExp',
              'isArguments',
              'isBoolean',
              'isNumber',
              'isUndefined',
              'isFunction',
              'isElement',
              'isObject'
            ],
            i,
            checker;
        for (i = 0; i < checkers.length && !var_type; i++) {
          checker = checkers[i];
          types[checker](value) && (var_type = checker.substring(2).toLowerCase());
        }
        return var_type;
      };

  forEach(types, function (fn, name) {
    module['is' + name] = types['is' + name] = fn;
    module['isNot' + name] = types['isNot' + name] = function () {
      return !fn.apply(null, arguments);
    };
    delete types[name];
  });
  module.clone = clone;
  module.type = type;

  return module;
});
