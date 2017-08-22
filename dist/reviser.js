'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var hoistStatics = require('hoist-non-react-statics');

var NOOP = function NOOP() {};

module.exports = function (store, actions) {
  return function (mapStore, mapActions) {
    mapStore = mapStore || NOOP;
    mapActions = mapActions || NOOP;

    return function (ComponentToWrap) {
      var Reviser = function (_React$Component) {
        _inherits(Reviser, _React$Component);

        function Reviser() {
          _classCallCheck(this, Reviser);

          return _possibleConstructorReturn(this, (Reviser.__proto__ || Object.getPrototypeOf(Reviser)).apply(this, arguments));
        }

        _createClass(Reviser, [{
          key: 'componentWillMount',
          value: function componentWillMount() {
            this.boundForceUpdate = this.forceUpdate.bind(this);
            store.on('change', this.boundForceUpdate);
          }
        }, {
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
            store.removeListener('change', this.boundForceUpdate);
          }
        }, {
          key: 'render',
          value: function render() {
            return React.createElement(ComponentToWrap, _extends({}, this.props, mapStore(store.get()), mapActions(actions)));
          }
        }]);

        return Reviser;
      }(React.Component);

      hoistStatics(Reviser, ComponentToWrap);
      return Reviser;
    };
  };
};