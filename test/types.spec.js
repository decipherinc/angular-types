var expect = require('chai').expect,
    angular = require('angular'),
    sinon = require('sinon'),
    types = require('../types');

describe('types plugin', function () {
  'use strict';

  it('should expose functions on angular object in global context', function () {
    expect(types.isNull).to.be.a('function');
  });

  describe('isObjectish()', function () {
    it('should recognize a Date', function () {
      expect(types.isObjectish(new Date())).to.be.true;
    });
  });

  describe('isInteger()', function () {
    var isInteger = types.isInteger;

    it('should recognize an integer', function () {
      expect(isInteger(1)).to.be.true;
      expect(isInteger(-0)).to.be.true;
      expect(isInteger(0x0F)).to.be.true;
      expect(isInteger(Number())).to.be.true;

    });
    it('should recognize a non-integer', function () {
      expect(isInteger(1.1)).to.be.false;

      expect(isInteger(Infinity)).to.be.false;
      expect(isInteger(function () {
      })).to.be.false;
      expect(isInteger(null)).to.be.false;
      expect(isInteger({})).to.be.false;
    });
  });

  describe('isFloat()', function () {

    var isFloat = types.isFloat;

    it('should recognize a float', function () {
      expect(isFloat(1.1)).to.be.true;
      expect(isFloat(-1.1)).to.be.true;
      expect(isFloat(Number(1.1))).to.be.true;

    });
    it('should recognize a non-float', function () {
      expect(isFloat(1)).to.be.false;
      expect(isFloat(Number())).to.be.false;

      expect(isFloat(Infinity)).to.be.false;
      expect(isFloat(function () {
      })).to.be.false;
      expect(isFloat(null)).to.be.false;
      expect(isFloat({})).to.be.false;
    });
  });

  describe('isNaN()', function () {
    var isNaN = types.isNaN;

    it('should recognize NaN', function () {
      expect(isNaN(NaN)).to.be.true;
    });

    it('should recognize not NaN', function () {
      expect(isNaN(1)).to.be.false;
    });

    it('should recognize Infinity', function () {
      //noinspection DivideByZeroJS
      expect(isNaN(1 / 0)).to.be.false;
    });

  });

  describe('isNull()', function () {
    var isNull = types.isNull;
    it('should recognize null', function () {
      expect(isNull(null)).to.be.true;
    });
    it('should recognize a non-null', function () {
      expect(isNull({})).to.be.false;
    });
  });

  describe('isInfinite()', function () {
    var isInfinite = types.isInfinite;

    it('should recognize Infinity', function () {
      expect(isInfinite(Infinity)).to.be.true;
    });
    it('should recognize finite number', function () {
      expect(isInfinite(42)).to.be.false;
    });
  });

  describe('isArguments()', function () {
    var isArguments = types.isArguments;
    it('should recognize arguments', function () {
      expect(isArguments(arguments)).to.be.true;
    });
    it('should recognize objects', function () {
      expect(isArguments({})).to.be.false;
    });
  });

  describe('isRegExp()', function () {
    var isRegExp = types.isRegExp;
    it('should recognize RegExp', function () {
      expect(isRegExp(/foo/)).to.be.true;
      expect(isRegExp(new RegExp())).to.be.true;
    });
  });

  describe('isEmpty()', function () {
    var isEmpty = types.isEmpty;
    it('should recognize an empty string', function () {
      expect(isEmpty('')).to.be.true;
    });
    it('should not recognize a non-empty string', function () {
      expect(isEmpty('bar')).to.be.false;
    });
    it('should recognize an empty object', function () {
      expect(isEmpty({})).to.be.true;
    });
    it('should recognize a non-empty object', function () {
      expect(isEmpty({foo: 1})).to.be.false;
    });
    it('should recognize an empty array', function () {
      expect(isEmpty([])).to.be.true;
    });
    it('should recognize a non-empty array', function () {
      expect(isEmpty([1])).to.be.false;
    });
    it('should recognize an empty Arguments object', function () {
      expect(isEmpty(arguments)).to.be.true;
    });
    it('should recognize a non-empty Arguments object', function (done) {
      expect(isEmpty(arguments)).to.be.false;
      done();
    });
    it('should recognize a function with no parameters', function () {
      expect(isEmpty(types.noop)).to.be.true;
    });
    it('should recognize a function with parameters', function nonEmpty(done) {
      expect(isEmpty(nonEmpty)).to.be.true;
      done();
    });
  });

  describe('type()', function () {
    var type = types.type;

    it('should recognize a string', function () {
      expect(type('')).to.equal('string');
      expect(type(null)).not.to.equal('string');
    });
    it('should recognize an array', function () {
      expect(type([])).to.equal('array');
      expect(type(null)).not.to.equal('array');
    });
    it('should recognize a Date', function () {
      expect(type(new Date())).to.equal('date');
      expect(type(null)).not.to.equal('date');
    });
    it('should recognize undefined', function () {
      expect(type()).to.equal('undefined');
      expect(type(1)).to.not.equal('undefined');
    });
    it('should recognize a RegExp', function () {
      expect(type(/foo/)).to.equal('regexp');
      expect(type(null)).to.not.equal('regexp');
    });
    it('should recognize an object', function () {
      expect(type({})).to.equal('object');
      expect(type(null)).to.not.equal('object');
    });
    it('should recognize a boolean', function () {
      expect(type(true)).to.equal('boolean');
      expect(type(null)).to.not.equal('boolean');
    });
    it('should recognize null', function () {
      expect(type(null)).to.equal('null');
      expect(type(1)).to.not.equal('null');
    });
    it('should recognize a number', function () {
      expect(type(1)).to.equal('number');
      expect(type(null)).to.not.equal('number');
    });
    it('should recognize Arguments', function () {
      expect(type(arguments)).to.equal('arguments');
      expect(type(null)).to.not.equal('arguments');
    });
    it('should recognize a function', function () {
      expect(type(angular.noop)).to.equal('function');
      expect(type(null)).to.not.equal('function');
    });
    it('should recognize a DOM element', function () {
      var document = require('jsdom').jsdom('<html><head></head><body></body></html>');
      expect(type(document)).to.equal('element');
      expect(type(angular.element(document))).to.equal('element');
      expect(type(null)).to.not.equal('element');
    });
  });

  describe('clone()', function () {
    it('should clone', function () {
      var Foo = function Foo() {
        this.frick = 'frack';
      };
      Foo.prototype.baz = function baz() {
        return this.frick + 'fruck';
      };

      var Bar = function Bar() {
        Foo.call(this);
        this.frick = 'frock';
        this.date = new Date();
        this.herp = {
          derp: true
        };
      };
      Bar.prototype = Object.create(Foo.prototype);

      var bar = new Bar();
      expect(bar.baz()).to.equal('frockfruck');

      var barClone = types.clone(bar);
      expect(barClone.baz()).to.equal('frockfruck');
      expect(barClone.herp).to.not.equal(bar.herp);
      expect(barClone.date).to.not.equal(bar.date);
      expect(barClone.herp.derp).to.be.true;
      expect(barClone.date.getTime()).to.equal(bar.date.getTime());
    });

    it('should clone a RegExp properly', function () {
      var foo = {
          re: /.*/gi
        },
        bar,
        re;

      expect(function () {
        bar = types.clone(foo);
      }).not.to.throw();

      re = bar.re;
      expect(re.global).to.be.true;
      expect(re.ignoreCase).to.be.true;
      expect(re.multiline).to.be.false;
      expect(re.sticky).not.to.be.ok;
      expect(re.source).to.equal('.*');
    });
  });

});
