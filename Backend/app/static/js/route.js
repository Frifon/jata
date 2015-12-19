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
	
	    var numOfInterPoints = 1;
	
	    var start_elem = document.getElementById('ts_route_start');
	    var end_elem = document.getElementById('ts_route_finish');
	    var initPoint = document.getElementsByName('ts_route_intermediate_point[' + (numOfInterPoints - 1) + ']').item(numOfInterPoints - 1);
	    var isRouterInitialized = false;
	    var initPointsArr = [];
	
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
	
	    initPointsArr.push(new _routepoint2.default({
	        map: myMap,
	        elem: initPoint,
	        content: 'I ' + initPointsArr.length
	    }));
	
	    myMap.geoObjects.events.add('add', function (e) {
	        console.log('added');
	        if (isRouterInitialized) return;
	        var target = e.get('target');
	        var last_added = target.get(target.getLength() - 1);
	        if (!last_added.geometry) return;
	
	        if (!startP.coords || !endP.coords) return;
	
	        console.log('lets route');
	
	        var router = new _route2.default({
	            map: myMap,
	            pointA: startP.placemark,
	            pointB: endP.placemark,
	            interPoints: initPointsArr.map(function (item) {
	                return item.placemark || 1;
	            })
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
	        this.interPoints = options.interPoints;
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
	                var points = [this.pointA, this.pointB];
	                points.splice.apply(points, [1, 0].concat(this.interPoints));
	                this.points = new ymaps.GeoObjectCollection({
	                    children: points
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
	
	            this.points = this.route.getWayPoints();
	            this.points.options.set('preset', 'islands#redStretchyIcon');
	            this.points.options.set('draggable', 'true');
	            this.points.each(function (elem) {
	                elem.events.add('dragend', function (e) {
	                    return ctx.onChange(e);
	                });
	            });
	
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
	        }
	    }, {
	        key: 'onChange',
	        value: function onChange(e) {
	            this.render();
	        }
	    }]);
	
	    return Router;
	})();
	
	exports.default = Router;

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYzZhZGNlMjlhZGMwMDZlYmVhN2UiLCJ3ZWJwYWNrOi8vLy4vcm91dGUvYXBwLmpzIiwid2VicGFjazovLy8uL3JvdXRlL21hcGluaXQuanMiLCJ3ZWJwYWNrOi8vLy4vcm91dGUvcm91dGVwb2ludC5qcyIsIndlYnBhY2s6Ly8vLi9yb3V0ZS9yb3V0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQSxhQUFZLENBQUM7Ozs7Ozs7O0FBSWIsTUFBSyxDQUFDLEtBQUssbUJBQU0sQzs7Ozs7O0FDSmpCLGFBQVksQ0FBQzs7Ozs7bUJBS1csSUFBSTs7Ozs7Ozs7Ozs7O0FBQWIsVUFBUyxJQUFJLEdBQUc7O0FBSTNCLFNBQUksS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7QUFDN0IsZUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztBQUNyQixhQUFJLEVBQUUsRUFBRTtNQUNYLEVBQUU7QUFDQyw4QkFBcUIsRUFBRSxlQUFlO01BQ3pDLENBQUMsQ0FBQzs7QUFFSCxTQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQzs7QUFHekIsU0FBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzNELFNBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUMxRCxTQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUMsOEJBQThCLElBQUcsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFD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QixxQkFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFVBQUMsQ0FBQzs0QkFBSyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztrQkFBQSxDQUFDLENBQUM7Y0FDdEQsQ0FBQyxDQUFDOztBQUVILGlCQUFHLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFO0FBQ3pCLDJCQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQU07QUFDdkMseUJBQUksTUFBSyxhQUFhLEdBQUcsQ0FBQyxNQUFLLGFBQWEsRUFBRTtBQUMxQywrQkFBSyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2hELG1DQUFVLENBQUMsS0FBSyxHQUFHLDZCQUE2QixDQUFDO3NCQUNwRCxNQUFNO0FBQ0gsK0JBQUssS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN6QixtQ0FBVSxDQUFDLEtBQUssR0FBRyw0QkFBNEIsQ0FBQztzQkFDbkQ7a0JBQ0osQ0FBQyxDQUFDO0FBQ0gscUJBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7Y0FDbEM7VUFJSjs7O2tDQUVRLENBQUMsRUFBRTtBQUNSLGlCQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7VUFDakI7OztZQS9FZ0IsTUFBTTs7O21CQUFOLE1BQU0sQyIsImZpbGUiOiJyb3V0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgYzZhZGNlMjlhZGMwMDZlYmVhN2VcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBpbml0IGZyb20gJy4vbWFwaW5pdC5qcyc7XG5cbnltYXBzLnJlYWR5KGluaXQpO1xuXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3JvdXRlL2FwcC5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFJvdXRlUG9pbnQgZnJvbSAnLi9yb3V0ZXBvaW50LmpzJztcbmltcG9ydCBSb3V0ZXIgZnJvbSAnLi9yb3V0ZS5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGluaXQoKSB7XG5cblxuXG4gICAgbGV0IG15TWFwID0gbmV3IHltYXBzLk1hcCgnbWFwJywge1xuICAgICAgICBjZW50ZXI6IFs1OS45NSwgMzAuMl0sXG4gICAgICAgIHpvb206IDEwXG4gICAgfSwge1xuICAgICAgICBzZWFyY2hDb250cm9sUHJvdmlkZXI6ICd5YW5kZXgjc2VhcmNoJ1xuICAgIH0pO1xuXG4gICAgbGV0IG51bU9mSW50ZXJQb2ludHMgPSAxO1xuXG5cbiAgICBsZXQgc3RhcnRfZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0c19yb3V0ZV9zdGFydCcpO1xuICAgIGxldCBlbmRfZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0c19yb3V0ZV9maW5pc2gnKTtcbiAgICBsZXQgaW5pdFBvaW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3RzX3JvdXRlX2ludGVybWVkaWF0ZV9wb2ludFsnKyAobnVtT2ZJbnRlclBvaW50cyAtIDEpICsgJ10nKS5pdGVtKG51bU9mSW50ZXJQb2ludHMgLSAxKTtcbiAgICBsZXQgaXNSb3V0ZXJJbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIGxldCBpbml0UG9pbnRzQXJyID0gW107XG5cbiAgICBsZXQgc3RhcnRQID0gbmV3IFJvdXRlUG9pbnQoe1xuICAgICAgICBtYXA6IG15TWFwLFxuICAgICAgICBlbGVtOiBzdGFydF9lbGVtLFxuICAgICAgICBjb250ZW50OiAnQSdcbiAgICB9KTtcblxuICAgIGxldCBlbmRQID0gbmV3IFJvdXRlUG9pbnQoe1xuICAgICAgICBtYXA6IG15TWFwLFxuICAgICAgICBlbGVtOiBlbmRfZWxlbSxcbiAgICAgICAgY29udGVudDogJ0InXG4gICAgfSk7XG5cbiAgICBpbml0UG9pbnRzQXJyLnB1c2gobmV3IFJvdXRlUG9pbnQoe1xuICAgICAgICBtYXA6IG15TWFwLFxuICAgICAgICBlbGVtOiBpbml0UG9pbnQsXG4gICAgICAgIGNvbnRlbnQ6ICdJICcgKyBpbml0UG9pbnRzQXJyLmxlbmd0aFxuICAgIH0pKTtcblxuICAgIG15TWFwLmdlb09iamVjdHMuZXZlbnRzLmFkZCgnYWRkJywgKGUpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2FkZGVkJyk7XG4gICAgICAgIGlmKGlzUm91dGVySW5pdGlhbGl6ZWQpIHJldHVybjtcbiAgICAgICAgbGV0IHRhcmdldCA9IGUuZ2V0KCd0YXJnZXQnKTtcbiAgICAgICAgbGV0IGxhc3RfYWRkZWQgPSB0YXJnZXQuZ2V0KHRhcmdldC5nZXRMZW5ndGgoKSAtIDEpO1xuICAgICAgICBpZighbGFzdF9hZGRlZC5nZW9tZXRyeSkgcmV0dXJuO1xuXG4gICAgICAgIGlmKCFzdGFydFAuY29vcmRzIHx8ICFlbmRQLmNvb3JkcykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCdsZXRzIHJvdXRlJyk7XG5cbiAgICAgICAgbGV0IHJvdXRlciA9IG5ldyBSb3V0ZXIoe1xuICAgICAgICAgICAgbWFwOiBteU1hcCxcbiAgICAgICAgICAgIHBvaW50QTogc3RhcnRQLnBsYWNlbWFyayxcbiAgICAgICAgICAgIHBvaW50QjogZW5kUC5wbGFjZW1hcmssXG4gICAgICAgICAgICBpbnRlclBvaW50czogaW5pdFBvaW50c0Fyci5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLnBsYWNlbWFyayB8fCAxO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXNSb3V0ZXJJbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICB9KTtcbn1cblxuXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3JvdXRlL21hcGluaXQuanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJccmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvdXRlUG9pbnQge1xyICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcciAgICAgICAgaWYob3B0aW9ucy5tYXApIHRoaXMubWFwID0gb3B0aW9ucy5tYXA7XHIgICAgICAgIHRoaXMuX2NvbGxlY3Rpb24gPSB0aGlzLm1hcC5nZW9PYmplY3RzO1xyICAgICAgICB0aGlzLmNvbnRlbnQgPSBvcHRpb25zLmNvbnRlbnQgfHwgJ9Ci0L7Rh9C60LAnO1xyICAgICAgICBpZihvcHRpb25zLmVsZW0pIHtcciAgICAgICAgICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcciAgICAgICAgICAgIGxldCBzdWdnZXN0VmlldyA9IG5ldyB5bWFwcy5TdWdnZXN0Vmlldyh0aGlzLmVsZW0pO1xyICAgICAgICAgICAgc3VnZ2VzdFZpZXcuZXZlbnRzLmFkZCgnc2VsZWN0JywgKCkgPT4gdGhpcy5yZW5kZXIoKSk7XHIgICAgICAgIH1cciAgICB9XHJcciAgICByZW5kZXIoKSB7XHIgICAgICAgIGxldCBjdHggPSB0aGlzO1xyICAgICAgICBpZih0aGlzLmlucHV0X3ZhbHVlID09IHRoaXMuZWxlbS52YWx1ZSkgcmV0dXJuO1xyICAgICAgICB0aGlzLmlucHV0X3ZhbHVlID0gdGhpcy5lbGVtLnZhbHVlO1xyXHIgICAgICAgIHltYXBzLmdlb2NvZGUodGhpcy5pbnB1dF92YWx1ZSwge1xyICAgICAgICAgICAgcmVzdWx0czogMVxyICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcciAgICAgICAgICAgIGN0eC5jbGVhcigpO1xyICAgICAgICAgICAgY3R4LmNvb3JkcyA9IHJlcy5nZW9PYmplY3RzLmdldCgwKS5nZW9tZXRyeS5nZXRDb29yZGluYXRlcygpO1xyICAgICAgICAgICAgY3R4LnBsYWNlbWFyayA9ICBuZXcgeW1hcHMuUGxhY2VtYXJrKGN0eC5jb29yZHMsIHtcciAgICAgICAgICAgICAgICBpY29uQ29udGVudDogY3R4LmNvbnRlbnQsXHIgICAgICAgICAgICAgICAgYmFsbG9vbkNvbnRlbnQ6IGN0eC5pbnB1dF92YWx1ZVxyICAgICAgICAgICAgfSwge1xyICAgICAgICAgICAgICAgIHByZXNldDogJ2lzbGFuZHMjdmlvbGV0U3RyZXRjaHlJY29uJyxcciAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IHRydWVcciAgICAgICAgICAgIH0pO1xyICAgICAgICAgICAgY3R4LmFkZCgpO1xyXHIgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xyICAgICAgICAgICAgY29uc29sZS5sb2coJ1BvaW50IGVycm9yJyk7XHIgICAgICAgIH0pO1xyICAgIH1cclxyICAgIGFkZCgpIHtcciAgICAgICAgdGhpcy5fY29sbGVjdGlvbi5hZGQodGhpcy5wbGFjZW1hcmspO1xyICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy5fY29sbGVjdGlvbi5nZXRMZW5ndGgoKSAtIDE7XHIgICAgfVxyXHIgICAgY2xlYXIoKSB7XHIgICAgICAgIGlmKCF0aGlzLmluZGV4ICYmIHRoaXMuaW5kZXggIT0gMCkgcmV0dXJuO1xyICAgICAgICB0aGlzLl9jb2xsZWN0aW9uLnJlbW92ZSh0aGlzLl9jb2xsZWN0aW9uLmdldCh0aGlzLmluZGV4KSk7XHIgICAgICAgIHRoaXMuaW5kZXggPSBudWxsO1xyICAgIH1ccn1cclxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vcm91dGUvcm91dGVwb2ludC5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm91dGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5tYXAgPSBvcHRpb25zLm1hcDtcbiAgICAgICAgdGhpcy5wb2ludEEgPSBvcHRpb25zLnBvaW50QTtcbiAgICAgICAgdGhpcy5wb2ludEIgPSBvcHRpb25zLnBvaW50QjtcbiAgICAgICAgdGhpcy5pbnRlclBvaW50cyA9IG9wdGlvbnMuaW50ZXJQb2ludHM7XG4gICAgICAgIHRoaXMuX2NvbGxlY3Rpb24gPSB0aGlzLm1hcC5nZW9PYmplY3RzO1xuICAgICAgICB0aGlzLl9zdGFydEVkaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faXNCdXR0b25MaXN0ZW5pbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGxldCBjdHggPSB0aGlzO1xuICAgICAgICBsZXQgY29vcmRzID0gW107XG5cbiAgICAgICAgZGVidWdnZXI7XG5cbiAgICAgICAgaWYoIXRoaXMucG9pbnRzKSB7XG4gICAgICAgICAgICBsZXQgcG9pbnRzID0gW3RoaXMucG9pbnRBLCB0aGlzLnBvaW50Ql07XG4gICAgICAgICAgICBwb2ludHMuc3BsaWNlLmFwcGx5KHBvaW50cywgWzEsIDBdLmNvbmNhdCh0aGlzLmludGVyUG9pbnRzKSk7XG4gICAgICAgICAgICB0aGlzLnBvaW50cyA9IG5ldyB5bWFwcy5HZW9PYmplY3RDb2xsZWN0aW9uKHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogcG9pbnRzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucG9pbnRzLmVhY2goZnVuY3Rpb24gKGVsZW0sIGkpIHtcbiAgICAgICAgICAgIGNvb3Jkc1tpXSA9IGVsZW0uZ2VvbWV0cnkuZ2V0Q29vcmRpbmF0ZXMoKTtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICB5bWFwcy5yb3V0ZShjb29yZHMpXG4gICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uKHJvdXRlKSB7XG4gICAgICAgICAgICAgICAgY3R4LnJvdXRlID0gcm91dGU7XG4gICAgICAgICAgICAgICAgY3R4Ll9jb2xsZWN0aW9uLnJlbW92ZUFsbCgpO1xuICAgICAgICAgICAgICAgIGN0eC5hZGQoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjogJyArIGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cblxuICAgIGFkZCgpIHtcbiAgICAgICAgLy8gVE9ETzogZWRpdGJ1dHRvbiDQt9Cw0LTQsNCy0LDRgtGMINGH0LXRgNC10Lcg0LrQvtC90YHRgtGA0YPQutGC0L7RgFxuXG4gICAgICAgIGxldCBlZGl0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VkaXRvcicpO1xuICAgICAgICBsZXQgY3R4ID0gdGhpcztcblxuICAgICAgICB0aGlzLl9jb2xsZWN0aW9uLmFkZCh0aGlzLnJvdXRlKTtcblxuICAgICAgICB0aGlzLnBvaW50cyA9IHRoaXMucm91dGUuZ2V0V2F5UG9pbnRzKCk7XG4gICAgICAgIHRoaXMucG9pbnRzLm9wdGlvbnMuc2V0KCdwcmVzZXQnLCAnaXNsYW5kcyNyZWRTdHJldGNoeUljb24nKTtcbiAgICAgICAgdGhpcy5wb2ludHMub3B0aW9ucy5zZXQoJ2RyYWdnYWJsZScsICd0cnVlJyk7XG4gICAgICAgIHRoaXMucG9pbnRzLmVhY2goIGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICAgIGVsZW0uZXZlbnRzLmFkZCgnZHJhZ2VuZCcsIChlKSA9PiBjdHgub25DaGFuZ2UoZSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZighdGhpcy5faXNCdXR0b25MaXN0ZW5pbmcpIHtcbiAgICAgICAgICAgIGVkaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3N0YXJ0RWRpdGluZyA9ICF0aGlzLl9zdGFydEVkaXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3V0ZS5lZGl0b3Iuc3RhcnQoeyBhZGRXYXlQb2ludHM6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgICAgIGVkaXRCdXR0b24udmFsdWUgPSAn0J7RgtC60LvRjtGH0LjRgtGMINGA0LXQtNCw0LrRgtC+0YAg0LzQsNGA0YjRgNGD0YLQsCc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3V0ZS5lZGl0b3Iuc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICBlZGl0QnV0dG9uLnZhbHVlID0gJ9CS0LrQu9GO0YfQuNGC0Ywg0YDQtdC00LDQutGC0L7RgCDQvNCw0YDRiNGA0YPRgtCwJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2lzQnV0dG9uTGlzdGVuaW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuICAgIG9uQ2hhbmdlKGUpIHtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG5cblxuXG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3JvdXRlL3JvdXRlLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==