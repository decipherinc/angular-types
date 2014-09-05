# angular-types

AngularJS introspection utilities

## Overview

AngularJS ships with various functions to check types, such as `angular.isNumber()`, `angular.isUndefined()`, and `angular.isElement()`.  This extension adds many functions to AngularJS' builtins, including a general-purpose [type-checking function](#type) and a [cloning function](#clone).

This is particularly useful if you want the type-checking functionality of Lo-Dash or Underscore, but without the libraries themselves.  Many of these functions were derived from Lo-Dash implementations.

### Type-Checking Functions 

Each of these functions accept a value and return a boolean.

- `isNull()` / `isNotNull()`
- `isBoolean()` / `isNotBoolean()`
- `isNaN()` / `isNotNaN()`
- `isFinite()` / `isNotFinite()`
- `isInfinite()` / `isNotInfinite()`
- `isArguments()` / `isNotArguments()`
- `isRegExp()` / `isNotRegExp()`
- `isEmpty()` / `isNotEmpty()`
- `isInteger()` / `isNotInteger()`
- `isFloat()` / `isNotFloat()`
- `isObjectish()` / `isNotObjectish()` (returns `true` if the value is not `null` and may contain properties)

In addition, the negation of the AngularJS built-ins are provided:

- `isNotUndefined()`
- `isNotArray()`
- `isNotDate()`
- `isNotElement()`
- `isNotObject()`
- `isNotString()`
- `isNotFunction()`
- `isNotNumber()`

### `type()` 

The `type()` function will accept a value and return one of the following strings:

`null`, `string`, `array`, `date`, `regexp`, `arguments`, `boolean`, `number`, `undefined`, `function`, `element`, `object`

> An `element` is considered to be a DOM node, jqLite object, or jQuery object.

### `clone()`

The `clone()` function will return a deep clone of some value.  This differs from `angular.copy()` in the following ways:

- Simply returns the cloned value; does not accept a `destination` parameter.
- Works on DOM nodes, jqLite elements or jQuery objects.
- If a nested value implements a `clone()` function, that function will be called.  This is useful for complex nested objects.
- Calls `angular.copy()` internally so your `$$hashKey`s are not befouled.
- Accepts an optional second Object parameter, `extra`, which can be extended onto the clone.  This is useful, for example, if you have a unique identifier in an object, and wish to re-generate it.

## Usage (Browser)

In the browser, if not using AMD, the functions are attached to the `angular` object as to not further pollute the global scope.

```js
var foo = {
  bar: 1,
  baz: function() {
    return this.bar + 1;
  }
};

angular.isInteger(foo.bar);           // true
angular.type(foo.bar);                // 'number'
angular.isNotFunction(foo.baz);       // false
angular.type(foo.baz);                // 'function'

// example of using second parameter
angular.clone(foo, {bar: 2}).baz();   // 3
```

## Usage (CommonJS/NodeJS)

In a NodeJS context, `require()` the `angular-types` module.

```js
var types = require('angular-types'),
  quux = 1;

types.isInteger(quux);
```

## Usage (AMD/RequireJS)

Using RequireJS, just require `types`.

```js
define(['/path/to/types'], function(types) {
  types.isInteger(
});
```

## Author

Christopher Hiller <chiller@decipherinc.com>

## License

Copyright &copy; 2014 Decipher, Inc.  Licensed MIT
