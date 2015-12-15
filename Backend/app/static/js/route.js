/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _mapinit = __webpack_require__(1);
	
	var _mapinit2 = _interopRequireDefault(_mapinit);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	ymaps.ready(_mapinit2.default);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = init;
	
	var _routepoint = __webpack_require__(2);
	
	var _routepoint2 = _interopRequireDefault(_routepoint);
	
	var _route = __webpack_require__(3);
	
	var _route2 = _interopRequireDefault(_route);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function init() {
	
	    var myMap = new ymaps.Map('map', {
	        center: [59.95, 30.2],
	        zoom: 10
	    }, {
	        searchControlProvider: 'yandex#search'
	    });
	
	    var start_elem = document.getElementById('ts_route_start');
	    var end_elem = document.getElementById('ts_route_finish');
	    var isRouterInitialized = false;
	
	    var startP = new _routepoint2.default({
	        map: myMap,
	        elem: start_elem,
	        content: 'A'
	    });
	
	    var endP = new _routepoint2.default({
	        map: myMap,
	        elem: end_elem,
	        content: 'B'
	    });
	
	    myMap.geoObjects.events.add('add', function (e) {
	        if (isRouterInitialized) return;
	        var target = e.get('target');
	        var last_added = target.get(target.getLength() - 1);
	        if (!last_added.geometry) return;
	
	        if (!startP.coords || !endP.coords) return;
	
	        var router = new _route2.default({
	            map: myMap,
	            pointA: startP.placemark,
	            pointB: endP.placemark
	        });
	
	        isRouterInitialized = true;
	    });
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var RoutePoint = (function () {
	  function RoutePoint(options) {
	    var _this = this;
	
	    _classCallCheck(this, RoutePoint);
	
	    if (options.map) this.map = options.map;
	    this._collection = this.map.geoObjects;
	    this.content = options.content || 'Точка';
	    if (options.elem) {
	      this.elem = options.elem;
	      var suggestView = new ymaps.SuggestView(this.elem);
	      suggestView.events.add('select', function () {
	        return _this.render();
	      });
	    }
	  }
	
	  _createClass(RoutePoint, [{
	    key: 'render',
	    value: function render() {
	      var ctx = this;
	      if (this.input_value == this.elem.value) return;
	      this.input_value = this.elem.value;
	
	      ymaps.geocode(this.input_value, {
	        results: 1
	      }).then(function (res) {
	        ctx.clear();
	        ctx.coords = res.geoObjects.get(0).geometry.getCoordinates();
	        ctx.placemark = new ymaps.Placemark(ctx.coords, {
	          iconContent: ctx.content,
	          balloonContent: ctx.input_value
	        }, {
	          preset: 'islands#violetStretchyIcon',
	          draggable: true
	        });
	        ctx.add();
	      }, function (err) {
	        console.log('Point error');
	      });
	    }
	  }, {
	    key: 'add',
	    value: function add() {
	      this._collection.add(this.placemark);
	      this.index = this._collection.getLength() - 1;
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      if (!this.index && this.index != 0) return;
	      this._collection.remove(this._collection.get(this.index));
	      this.index = null;
	    }
	  }]);
	
	  return RoutePoint;
	})();
	
	exports.default = RoutePoint;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Router = (function () {
	    function Router(options) {
	        _classCallCheck(this, Router);
	
	        this.map = options.map;
	        this.pointA = options.pointA;
	        this.pointB = options.pointB;
	        this._collection = this.map.geoObjects;
	        this._startEditing = false;
	        this._isButtonListening = false;
	        this.render();
	    }
	
	    _createClass(Router, [{
	        key: 'render',
	        value: function render() {
	            var ctx = this;
	            var coords = [];
	
	            debugger;
	
	            if (!this.points) {
	                this.points = new ymaps.GeoObjectCollection({
	                    children: [this.pointA, this.pointB]
	                });
	            }
	
	            this.points.each(function (elem, i) {
	                coords[i] = elem.geometry.getCoordinates();
	            });
	
	            ymaps.route(coords).then(function (route) {
	                ctx.route = route;
	                ctx._collection.removeAll();
	                ctx.add();
	            }, function (error) {
	                console.log('error: ' + error);
	            });
	        }
	    }, {
	        key: 'add',
	        value: function add() {
	            var _this = this;
	
	            // TODO: editbutton задавать через конструктор
	
	            var editButton = document.getElementById('editor');
	            var ctx = this;
	
	            this._collection.add(this.route);
	
	            if (!this._isButtonListening) {
	                editButton.addEventListener('click', function () {
	                    if (_this._startEditing = !_this._startEditing) {
	                        _this.route.editor.start({ addWayPoints: true });
	                        editButton.value = 'Отключить редактор маршрута';
	                    } else {
	                        _this.route.editor.stop();
	                        editButton.value = 'Включить редактор маршрута';
	                    }
	                });
	                this._isButtonListening = true;
	            }
	
	            this.points = this.route.getWayPoints();
	            this.points.options.set('preset', 'islands#redStretchyIcon');
	            this.points.options.set('draggable', 'true');
	            this.points.each(function (elem) {
	                elem.events.add('dragend', function (e) {
	                    return ctx.onChange(e);
	                });
	            });
	        }
	    }, {
	        key: 'onChange',
	        value: function onChange(e) {
	            //let thisPoint = e.get('target');
	            //let coords = thisPoint.geometry.getCoordinates();
	            //thisPoint.geometry.setCoordinates(coords);
	            this.render();
	        }
	    }]);
	
	    return Router;
	})();
	
	exports.default = Router;

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMjA1ZTI0ODhjNDU4YTEzMWU1ZWUiLCJ3ZWJwYWNrOi8vLy4vcm91dGUvYXBwLmpzIiwid2VicGFjazovLy8uL3JvdXRlL21hcGluaXQuanMiLCJ3ZWJwYWNrOi8vLy4vcm91dGUvcm91dGVwb2ludC5qcyIsIndlYnBhY2s6Ly8vLi9yb3V0ZS9yb3V0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQSxhQUFZLENBQUM7Ozs7Ozs7O0FBSWIsTUFBSyxDQUFDLEtBQUssbUJBQU0sQzs7Ozs7O0FDSmpCLGFBQVksQ0FBQzs7Ozs7bUJBS1csSUFBSTs7Ozs7Ozs7Ozs7O0FBQWIsVUFBUyxJQUFJLEdBQUc7O0FBSTNCLFNBQUksS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7QUFDN0IsZUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztBQUNyQixhQUFJLEVBQUUsRUFBRTtNQUNYLEVBQUU7QUFDQyw4QkFBcUIsRUFBRSxlQUFlO01BQ3pDLENBQUMsQ0FBQzs7QUFHSCxTQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDM0QsU0FBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzFELFNBQUksbUJBQW1CLEdBQUcsS0FBSyxDQUFDOztBQUVoQyxTQUFJLE1BQU0sR0FBRyx5QkFBZTtBQUN4QixZQUFHLEVBQUUsS0FBSztBQUNWLGFBQUksRUFBRSxVQUFVO0FBQ2hCLGdCQUFPLEVBQUUsR0FBRztNQUNmLENBQUMsQ0FBQzs7QUFFSCxTQUFJLElBQUksR0FBRyx5QkFBZTtBQUN0QixZQUFHLEVBQUUsS0FBSztBQUNWLGFBQUksRUFBRSxRQUFRO0FBQ2QsZ0JBQU8sRUFBRSxHQUFHO01BQ2YsQ0FBQyxDQUFDOztBQUVILFVBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDdEMsYUFBRyxtQkFBbUIsRUFBRSxPQUFPO0FBQy9CLGFBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0IsYUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDcEQsYUFBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsT0FBTzs7QUFFaEMsYUFBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU87O0FBRTFDLGFBQUksTUFBTSxHQUFHLG9CQUFXO0FBQ3BCLGdCQUFHLEVBQUUsS0FBSztBQUNWLG1CQUFNLEVBQUUsTUFBTSxDQUFDLFNBQVM7QUFDeEIsbUJBQU0sRUFBRSxJQUFJLENBQUMsU0FBUztVQUN6QixDQUFDLENBQUM7O0FBRUgsNEJBQW1CLEdBQUcsSUFBSSxDQUFDO01BRTlCLENBQUMsQ0FBQzs7Ozs7OztBQ2pEUCxhQUFZLENBQUM7Ozs7Ozs7Ozs7S0FFUSxVQUFVO0FBQzNCLFlBRGlCLFVBQVUsQ0FDZixPQUFPLEVBQUU7OzsyQkFESixVQUFVOztBQUV2QixTQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0FBQ3ZDLFNBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7QUFDdkMsU0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQztBQUMxQyxTQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDYixXQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDekIsV0FBSSxXQUFXLEdBQUcsSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuRCxrQkFBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFO2dCQUFNLE1BQUssTUFBTSxFQUFFO1FBQUEsQ0FBQyxDQUFDO01BQ3pEO0lBQ0o7O2dCQVZnQixVQUFVOzs4QkFZbEI7QUFDTCxXQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDZixXQUFHLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTztBQUMvQyxXQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDOztBQUVuQyxZQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDNUIsZ0JBQU8sRUFBRSxDQUFDO1FBQ2IsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRTtBQUNuQixZQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDWixZQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUM3RCxZQUFHLENBQUMsU0FBUyxHQUFJLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFO0FBQzdDLHNCQUFXLEVBQUUsR0FBRyxDQUFDLE9BQU87QUFDeEIseUJBQWMsRUFBRSxHQUFHLENBQUMsV0FBVztVQUNsQyxFQUFFO0FBQ0MsaUJBQU0sRUFBRSw0QkFBNEI7QUFDcEMsb0JBQVMsRUFBRSxJQUFJO1VBQ2xCLENBQUMsQ0FBQztBQUNILFlBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUViLEVBQUUsVUFBUyxHQUFHLEVBQUU7QUFDYixnQkFBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUM7TUFDTjs7OzJCQUVLO0FBQ0YsV0FBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3JDLFdBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7TUFDakQ7Ozs2QkFFTztBQUNKLFdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxFQUFFLE9BQU87QUFDMUMsV0FBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDMUQsV0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7TUFDckI7OztVQTdDZ0IsVUFBVTs7O21CQUFWLFVBQVUsQzs7Ozs7O0FDRi9CLGFBQVksQ0FBQzs7Ozs7Ozs7OztLQUVRLE1BQU07QUFFdkIsY0FGaUIsTUFBTSxDQUVYLE9BQU8sRUFBRTsrQkFGSixNQUFNOztBQUduQixhQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFDdkIsYUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQzdCLGFBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUM3QixhQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO0FBQ3ZDLGFBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO0FBQzNCLGFBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7QUFDaEMsYUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO01BQ2pCOztrQkFWZ0IsTUFBTTs7a0NBWWQ7QUFDTCxpQkFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2YsaUJBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQzs7QUFFaEIsc0JBQVM7O0FBRVQsaUJBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2IscUJBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUM7QUFDeEMsNkJBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQztrQkFDdkMsQ0FBQyxDQUFDO2NBQ047O0FBRUQsaUJBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsRUFBRTtBQUNoQyx1QkFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7Y0FDOUMsQ0FBQyxDQUFDOztBQUdILGtCQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUNkLElBQUksQ0FDTCxVQUFTLEtBQUssRUFBRTtBQUNaLG9CQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNsQixvQkFBRyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUM1QixvQkFBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO2NBQ2IsRUFDRCxVQUFTLEtBQUssRUFBRTtBQUNaLHdCQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQztjQUNsQyxDQUNKO1VBQ0o7OzsrQkFFSzs7Ozs7QUFHRixpQkFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNuRCxpQkFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDOztBQUVmLGlCQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRWpDLGlCQUFHLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFO0FBQ3pCLDJCQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQU07QUFDdkMseUJBQUksTUFBSyxhQUFhLEdBQUcsQ0FBQyxNQUFLLGFBQWEsRUFBRTtBQUMxQywrQkFBSyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2hELG1DQUFVLENBQUMsS0FBSyxHQUFHLDZCQUE2QixDQUFDO3NCQUNwRCxNQUFNO0FBQ0gsK0JBQUssS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN6QixtQ0FBVSxDQUFDLEtBQUssR0FBRyw0QkFBNEIsQ0FBQztzQkFDbkQ7a0JBQ0osQ0FBQyxDQUFDO0FBQ0gscUJBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7Y0FDbEM7O0FBRUQsaUJBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUN4QyxpQkFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0FBQzdELGlCQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzdDLGlCQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBRSxVQUFTLElBQUksRUFBRTtBQUM3QixxQkFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFVBQUMsQ0FBQzs0QkFBSyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztrQkFBQSxDQUFDLENBQUM7Y0FDdEQsQ0FBQyxDQUFDO1VBRU47OztrQ0FFUSxDQUFDLEVBQUU7Ozs7QUFJUixpQkFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1VBQ2pCOzs7WUE3RWdCLE1BQU07OzttQkFBTixNQUFNLEMiLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDIwNWUyNDg4YzQ1OGExMzFlNWVlXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgaW5pdCBmcm9tICcuL21hcGluaXQuanMnO1xuXG55bWFwcy5yZWFkeShpbml0KTtcblxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9yb3V0ZS9hcHAuanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBSb3V0ZVBvaW50IGZyb20gJy4vcm91dGVwb2ludC5qcyc7XG5pbXBvcnQgUm91dGVyIGZyb20gJy4vcm91dGUuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpbml0KCkge1xuXG5cblxuICAgIGxldCBteU1hcCA9IG5ldyB5bWFwcy5NYXAoJ21hcCcsIHtcbiAgICAgICAgY2VudGVyOiBbNTkuOTUsIDMwLjJdLFxuICAgICAgICB6b29tOiAxMFxuICAgIH0sIHtcbiAgICAgICAgc2VhcmNoQ29udHJvbFByb3ZpZGVyOiAneWFuZGV4I3NlYXJjaCdcbiAgICB9KTtcblxuXG4gICAgbGV0IHN0YXJ0X2VsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHNfcm91dGVfc3RhcnQnKTtcbiAgICBsZXQgZW5kX2VsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHNfcm91dGVfZmluaXNoJyk7XG4gICAgbGV0IGlzUm91dGVySW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICAgIGxldCBzdGFydFAgPSBuZXcgUm91dGVQb2ludCh7XG4gICAgICAgIG1hcDogbXlNYXAsXG4gICAgICAgIGVsZW06IHN0YXJ0X2VsZW0sXG4gICAgICAgIGNvbnRlbnQ6ICdBJ1xuICAgIH0pO1xuXG4gICAgbGV0IGVuZFAgPSBuZXcgUm91dGVQb2ludCh7XG4gICAgICAgIG1hcDogbXlNYXAsXG4gICAgICAgIGVsZW06IGVuZF9lbGVtLFxuICAgICAgICBjb250ZW50OiAnQidcbiAgICB9KTtcblxuICAgIG15TWFwLmdlb09iamVjdHMuZXZlbnRzLmFkZCgnYWRkJywgKGUpID0+IHtcbiAgICAgICAgaWYoaXNSb3V0ZXJJbml0aWFsaXplZCkgcmV0dXJuO1xuICAgICAgICBsZXQgdGFyZ2V0ID0gZS5nZXQoJ3RhcmdldCcpO1xuICAgICAgICBsZXQgbGFzdF9hZGRlZCA9IHRhcmdldC5nZXQodGFyZ2V0LmdldExlbmd0aCgpIC0gMSk7XG4gICAgICAgIGlmKCFsYXN0X2FkZGVkLmdlb21ldHJ5KSByZXR1cm47XG5cbiAgICAgICAgaWYoIXN0YXJ0UC5jb29yZHMgfHwgIWVuZFAuY29vcmRzKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHJvdXRlciA9IG5ldyBSb3V0ZXIoe1xuICAgICAgICAgICAgbWFwOiBteU1hcCxcbiAgICAgICAgICAgIHBvaW50QTogc3RhcnRQLnBsYWNlbWFyayxcbiAgICAgICAgICAgIHBvaW50QjogZW5kUC5wbGFjZW1hcmtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXNSb3V0ZXJJbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICB9KTtcbn1cblxuXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3JvdXRlL21hcGluaXQuanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJccmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvdXRlUG9pbnQge1xyICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcciAgICAgICAgaWYob3B0aW9ucy5tYXApIHRoaXMubWFwID0gb3B0aW9ucy5tYXA7XHIgICAgICAgIHRoaXMuX2NvbGxlY3Rpb24gPSB0aGlzLm1hcC5nZW9PYmplY3RzO1xyICAgICAgICB0aGlzLmNvbnRlbnQgPSBvcHRpb25zLmNvbnRlbnQgfHwgJ9Ci0L7Rh9C60LAnO1xyICAgICAgICBpZihvcHRpb25zLmVsZW0pIHtcciAgICAgICAgICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcciAgICAgICAgICAgIGxldCBzdWdnZXN0VmlldyA9IG5ldyB5bWFwcy5TdWdnZXN0Vmlldyh0aGlzLmVsZW0pO1xyICAgICAgICAgICAgc3VnZ2VzdFZpZXcuZXZlbnRzLmFkZCgnc2VsZWN0JywgKCkgPT4gdGhpcy5yZW5kZXIoKSk7XHIgICAgICAgIH1cciAgICB9XHJcciAgICByZW5kZXIoKSB7XHIgICAgICAgIGxldCBjdHggPSB0aGlzO1xyICAgICAgICBpZih0aGlzLmlucHV0X3ZhbHVlID09IHRoaXMuZWxlbS52YWx1ZSkgcmV0dXJuO1xyICAgICAgICB0aGlzLmlucHV0X3ZhbHVlID0gdGhpcy5lbGVtLnZhbHVlO1xyXHIgICAgICAgIHltYXBzLmdlb2NvZGUodGhpcy5pbnB1dF92YWx1ZSwge1xyICAgICAgICAgICAgcmVzdWx0czogMVxyICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcciAgICAgICAgICAgIGN0eC5jbGVhcigpO1xyICAgICAgICAgICAgY3R4LmNvb3JkcyA9IHJlcy5nZW9PYmplY3RzLmdldCgwKS5nZW9tZXRyeS5nZXRDb29yZGluYXRlcygpO1xyICAgICAgICAgICAgY3R4LnBsYWNlbWFyayA9ICBuZXcgeW1hcHMuUGxhY2VtYXJrKGN0eC5jb29yZHMsIHtcciAgICAgICAgICAgICAgICBpY29uQ29udGVudDogY3R4LmNvbnRlbnQsXHIgICAgICAgICAgICAgICAgYmFsbG9vbkNvbnRlbnQ6IGN0eC5pbnB1dF92YWx1ZVxyICAgICAgICAgICAgfSwge1xyICAgICAgICAgICAgICAgIHByZXNldDogJ2lzbGFuZHMjdmlvbGV0U3RyZXRjaHlJY29uJyxcciAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IHRydWVcciAgICAgICAgICAgIH0pO1xyICAgICAgICAgICAgY3R4LmFkZCgpO1xyXHIgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xyICAgICAgICAgICAgY29uc29sZS5sb2coJ1BvaW50IGVycm9yJyk7XHIgICAgICAgIH0pO1xyICAgIH1cclxyICAgIGFkZCgpIHtcciAgICAgICAgdGhpcy5fY29sbGVjdGlvbi5hZGQodGhpcy5wbGFjZW1hcmspO1xyICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy5fY29sbGVjdGlvbi5nZXRMZW5ndGgoKSAtIDE7XHIgICAgfVxyXHIgICAgY2xlYXIoKSB7XHIgICAgICAgIGlmKCF0aGlzLmluZGV4ICYmIHRoaXMuaW5kZXggIT0gMCkgcmV0dXJuO1xyICAgICAgICB0aGlzLl9jb2xsZWN0aW9uLnJlbW92ZSh0aGlzLl9jb2xsZWN0aW9uLmdldCh0aGlzLmluZGV4KSk7XHIgICAgICAgIHRoaXMuaW5kZXggPSBudWxsO1xyICAgIH1ccn1cclxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vcm91dGUvcm91dGVwb2ludC5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm91dGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5tYXAgPSBvcHRpb25zLm1hcDtcbiAgICAgICAgdGhpcy5wb2ludEEgPSBvcHRpb25zLnBvaW50QTtcbiAgICAgICAgdGhpcy5wb2ludEIgPSBvcHRpb25zLnBvaW50QjtcbiAgICAgICAgdGhpcy5fY29sbGVjdGlvbiA9IHRoaXMubWFwLmdlb09iamVjdHM7XG4gICAgICAgIHRoaXMuX3N0YXJ0RWRpdGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pc0J1dHRvbkxpc3RlbmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgbGV0IGN0eCA9IHRoaXM7XG4gICAgICAgIGxldCBjb29yZHMgPSBbXTtcblxuICAgICAgICBkZWJ1Z2dlcjtcblxuICAgICAgICBpZighdGhpcy5wb2ludHMpIHtcbiAgICAgICAgICAgIHRoaXMucG9pbnRzID0gbmV3IHltYXBzLkdlb09iamVjdENvbGxlY3Rpb24oe1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbdGhpcy5wb2ludEEsIHRoaXMucG9pbnRCXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnBvaW50cy5lYWNoKGZ1bmN0aW9uIChlbGVtLCBpKSB7XG4gICAgICAgICAgICBjb29yZHNbaV0gPSBlbGVtLmdlb21ldHJ5LmdldENvb3JkaW5hdGVzKCk7XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgeW1hcHMucm91dGUoY29vcmRzKVxuICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbihyb3V0ZSkge1xuICAgICAgICAgICAgICAgIGN0eC5yb3V0ZSA9IHJvdXRlO1xuICAgICAgICAgICAgICAgIGN0eC5fY29sbGVjdGlvbi5yZW1vdmVBbGwoKTtcbiAgICAgICAgICAgICAgICBjdHguYWRkKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3I6ICcgKyBlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG5cbiAgICBhZGQoKSB7XG4gICAgICAgIC8vIFRPRE86IGVkaXRidXR0b24g0LfQsNC00LDQstCw0YLRjCDRh9C10YDQtdC3INC60L7QvdGB0YLRgNGD0LrRgtC+0YBcblxuICAgICAgICBsZXQgZWRpdEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0b3InKTtcbiAgICAgICAgbGV0IGN0eCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5fY29sbGVjdGlvbi5hZGQodGhpcy5yb3V0ZSk7XG5cbiAgICAgICAgaWYoIXRoaXMuX2lzQnV0dG9uTGlzdGVuaW5nKSB7XG4gICAgICAgICAgICBlZGl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zdGFydEVkaXRpbmcgPSAhdGhpcy5fc3RhcnRFZGl0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm91dGUuZWRpdG9yLnN0YXJ0KHsgYWRkV2F5UG9pbnRzOiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgICAgICBlZGl0QnV0dG9uLnZhbHVlID0gJ9Ce0YLQutC70Y7Rh9C40YLRjCDRgNC10LTQsNC60YLQvtGAINC80LDRgNGI0YDRg9GC0LAnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm91dGUuZWRpdG9yLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgZWRpdEJ1dHRvbi52YWx1ZSA9ICfQktC60LvRjtGH0LjRgtGMINGA0LXQtNCw0LrRgtC+0YAg0LzQsNGA0YjRgNGD0YLQsCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9pc0J1dHRvbkxpc3RlbmluZyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnBvaW50cyA9IHRoaXMucm91dGUuZ2V0V2F5UG9pbnRzKCk7XG4gICAgICAgIHRoaXMucG9pbnRzLm9wdGlvbnMuc2V0KCdwcmVzZXQnLCAnaXNsYW5kcyNyZWRTdHJldGNoeUljb24nKTtcbiAgICAgICAgdGhpcy5wb2ludHMub3B0aW9ucy5zZXQoJ2RyYWdnYWJsZScsICd0cnVlJyk7XG4gICAgICAgIHRoaXMucG9pbnRzLmVhY2goIGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICAgIGVsZW0uZXZlbnRzLmFkZCgnZHJhZ2VuZCcsIChlKSA9PiBjdHgub25DaGFuZ2UoZSkpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIG9uQ2hhbmdlKGUpIHtcbiAgICAgICAgLy9sZXQgdGhpc1BvaW50ID0gZS5nZXQoJ3RhcmdldCcpO1xuICAgICAgICAvL2xldCBjb29yZHMgPSB0aGlzUG9pbnQuZ2VvbWV0cnkuZ2V0Q29vcmRpbmF0ZXMoKTtcbiAgICAgICAgLy90aGlzUG9pbnQuZ2VvbWV0cnkuc2V0Q29vcmRpbmF0ZXMoY29vcmRzKTtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG5cblxuXG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3JvdXRlL3JvdXRlLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==