"use strict";

module.exports = function (store, actions) {
  return function (newActions) {
    Object.keys(newActions).forEach(function (key) {
      actions[key] = function () {
        var numArguments = arguments.length;
        var args = [];
        for (var i = 0; i < numArguments; i++) {
          args.push(arguments[i]);
        }
        args.unshift(store);
        return newActions[key].apply(null, args);
      };
    });
  };
};