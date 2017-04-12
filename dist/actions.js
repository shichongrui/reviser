'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var store = require('./store');

module.exports.actions = {};
module.exports.createActions = function (actions) {
  var wrappedActions = Object.keys(actions).reduce(function (previous, key) {
    previous[key] = function () {
      var numArguments = arguments.length;
      var args = [];
      for (var i = 0; i < numArguments; i++) {
        args.push(arguments[i]);
      }
      args.unshift(store);
      return actions[key].apply(null, args);
    };
    return previous;
  }, {});

  module.exports.actions = _extends({}, module.exports.actions, wrappedActions);
};