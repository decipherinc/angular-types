/**
 * @module types
 */

'use strict';

var angular = require('angular');

var isUndefined, isArray, isDate, isElement, isObject, isString, isFunction,
  str, isDefined, isNumber, extend, copy, forEach, types, clone, type,
  angularTypes;

angularTypes = {};
isDefined = angular.isDefined;
isUndefined = angular.isUndefined;
isArray = angular.isArray;
isDate = angular.isDate;
isElement = angular.isElement;
isObject = angular.isObject;
isString = angular.isString;
isFunction = angular.isFunction;
isNumber = angular.isNumber;
extend = angular.extend;
copy = angular.copy;
forEach = angular.forEach;

/**
 * Calls Object.prototype.toString() on anything.
 * @param {*} value Thing to see what it is
 * @returns {string}
 */
str = function str(value) {
  return Object.prototype.toString.call(value);
};

/**
 *
 * @type {{
   *  isArray: Function,
   *  isDate: Function,
   *  isElement: Function,
   *  isObject: Function,
   *  isNumber: Function,
   *  isUndefined: Function,
   *  isFunction: Function,
   *  isDefined: Function,
   *  isString: Function,
   *  isNull: Function,
   *  isBoolean: Function,
   *  isNaN: Function,
   *  isFinite: Function,
   *  isInfinite: Function,
   *  isArguments: Function,
   *  isRegExp: Function,
   *  isEmpty: Function,
   *  isInteger: Function,
   *  isFloat: Function,
   *  isObjectish: Function,
   *  isNotArray: Function,
   *  isNotDate: Function,
   *  isNotElement: Function,
   *  isNotObject: Function,
   *  isNotNumber: Function,
   *  isNotUndefined: Function,
   *  isNotFunction: Function,
   *  isNotDefined: Function,
   *  isNotString: Function,
   *  isNotNull: Function,
   *  isNotBoolean: Function,
   *  isNotNaN: Function,
   *  isNotFinite: Function,
   *  isNotInfinite: Function,
   *  isNotArguments: Function,
   *  isNotRegExp: Function,
   *  isNotEmpty: Function,
   *  isNotInteger: Function,
   *  isNotFloat: Function,
   *  isNotObjectish: Function,
   * }}
 */
types = {

  Defined: isDefined,
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
    /* eslint "eqeqeq":0 */
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
      str(value) === '[object Arguments]' || false;
  },

  /**
   * Returns `true` if the value is an Arguments object
   * @param {*} [value] Value to evaluate
   * @returns {boolean}
   * @alias isRegExp
   */
  RegExp: function isRegExp(value) {
    return value && types.isObjectish(value) &&
      str(value) === '[object RegExp]' ||
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
};
clone = function clone(value, extra) {
  var o, flags;

  extra = extra || {};
  // noinspection IfStatementWithTooManyBranchesJS
  if (types.isNotObjectish(value)) {
    return value;
  } else if (isArray(value)) {
    if (isFunction(value.clone)) {
      return value.clone();
    }
    return value.slice().map(function (val) {
      return isObject(val) && isFunction(val.clone) ? val.clone() : clone(val);
    });
  } else if (isDate(value)) {
    return new Date(value.getTime());
  } else if (types.isRegExp(value)) {
    flags = '';
    if (value.global) {
      flags += 'g';
    }
    if (value.ignoreCase) {
      flags += 'i';
    }
    if (value.multiline) {
      flags += 'm';
    }
    if (value.sticky) {
      flags += 'y';
    }
    return new RegExp(value.source, flags);
  } else if (isElement(value)) {
    if (isFunction(value.clone)) {
      return value.clone();
    }
    return value.cloneNode(true);
  }

  o = copy(value);
  forEach(value, function (val, key) {
    o[key] = types.isObjectish(val) && isFunction(val.clone) ? val.clone() :
      clone(val);
  });
  extend(o, extra);
  return o;
};
type = function type(value) {
  var varType = null,
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
  for (i = 0; i < checkers.length && !varType; i++) {
    checker = checkers[i];
    if (types[checker](value)) {
      varType = checker.substring(2).toLowerCase();
    }
  }
  return varType;
};

forEach(types, function (fn, name) {
  angularTypes['is' + name] = types['is' + name] = fn;
  angularTypes['isNot' + name] = types['isNot' + name] = function () {
    return !fn.apply(null, arguments);
  };
  delete types[name];
});

angularTypes.clone = clone;
angularTypes.type = type;

module.exports = angularTypes;
