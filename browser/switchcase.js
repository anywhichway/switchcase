(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function () {
  function switchcase() {
    var cases = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var strict = arguments.length > 1 ? arguments[1] : undefined;
    var switches = [];
    Object.keys(cases).forEach(function (key) {
      try {
        key = Function("return " + key)();
      } catch (e) {
        true;
      }

      switches.push([key, cases[key]]);
    });

    var switcher = function switcher(value) {
      for (var _i = 0; _i < switches.length; _i++) {
        var item = switches[_i];

        var key = item[0],
            type = _typeof(key);

        if (key && type === "object" && key instanceof RegExp && key.test(value) || type === "function" && key(value) || strict && key === value || !strict && key == value) {
          return item[1];
        }
      }

      return switcher.otherwise;
    };

    switcher.otherwise = cases.default;

    switcher.case = function (test, value) {
      switches.push([test, value]);
      return switcher;
    };

    switcher.default = function (value) {
      switcher.otherwise = value;
      return switcher;
    };

    switcher.match = function (value) {
      return switcher(value);
    };

    return switcher;
  }

  if (typeof module !== "undefined") {
    module.exports = switchcase;
  }

  if (typeof window !== "undefined") {
    window.switchcase = switchcase;
  }
})();

},{}]},{},[1]);
