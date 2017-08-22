'use strict';

var createStore = require('simmutable');
var setupReviser = require('./reviser');

var setupActions = require('./actions');

module.exports = function () {
  var store = createStore();
  var actions = {};

  return {
    store: store,
    reviser: setupReviser(store, actions),
    createActions: setupActions(store, actions),
    actions: actions
  };
};