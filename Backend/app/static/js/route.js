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
	    var interPoint = document.getElementsByName('ts_route_intermediate_point[' + (numOfInterPoints - 1) + ']').item(numOfInterPoints - 1);
	    var interPoints = [],
	        router = undefined;
	
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
	
	    interPoints.push(new _routepoint2.default({
	        map: myMap,
	        elem: interPoint,
	        content: 'I ' + interPoints.length
	    }));
	
	    myMap.geoObjects.events.add('add', function (e) {
	
	        var target = e.get('target');
	        var last_added = target.get(target.getLength() - 1);
	        if (!last_added.geometry) return;
	
	        if (router) {
	            router.interPoints = interPoints.filter(function (item) {
	                return item.placemark;
	            }).map(function (item) {
	                return item.placemark;
	            });
	            router.render();
	            return;
	        }
	
	        if (!startP.coords || !endP.coords) return;
	
	        router = new _route2.default({
	            map: myMap,
	            pointA: startP.placemark,
	            pointB: endP.placemark,
	            interPoints: interPoints.filter(function (item) {
	                return item.placemark;
	            }).map(function (item) {
	                return item.placemark;
	            })
	        });
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
	
	            //if(this.points && this.interPoints.length) {
	            //    let last_point = ctx.points.get(ctx.points.getLength() - 1);
	            //    this.interPoints.forEach(function(item) {
	            //       ctx.points.set(ctx.points.getLength() - 1, item);
	            //    });
	            //    ctx.points.set(ctx.points.getLength(), last_point);
	            //}
	
	            if (!this.points || this.interPoints.length) {
	                var points = [this.pointA, this.pointB];
	                points.splice.apply(points, [1, 0].concat(this.interPoints));
	                this.points = new ymaps.GeoObjectCollection({
	                    children: points
	                });
	                this.interPoints = [];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMWJmMDQwYzRiZDllMTI0ZDVhZWQiLCJ3ZWJwYWNrOi8vLy4vcm91dGUvYXBwLmpzIiwid2VicGFjazovLy8uL3JvdXRlL21hcGluaXQuanMiLCJ3ZWJwYWNrOi8vLy4vcm91dGUvcm91dGVwb2ludC5qcyIsIndlYnBhY2s6Ly8vLi9yb3V0ZS9yb3V0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQSxhQUFZLENBQUM7Ozs7Ozs7O0FBSWIsTUFBSyxDQUFDLEtBQUssbUJBQU0sQzs7Ozs7O0FDSmpCLGFBQVksQ0FBQzs7Ozs7bUJBS1csSUFBSTs7Ozs7Ozs7Ozs7O0FBQWIsVUFBUyxJQUFJLEdBQUc7O0FBSTNCLFNBQUksS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7QUFDN0IsZUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztBQUNyQixhQUFJLEVBQUUsRUFBRTtNQUNYLEVBQUU7QUFDQyw4QkFBcUIsRUFBRSxlQUFlO01BQ3pDLENBQUMsQ0FBQzs7QUFFSCxTQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQzs7QUFHekIsU0FBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzNELFNBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUMxRCxTQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUMsOEJBQThCLElBQUcsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFD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dHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgMWJmMDQwYzRiZDllMTI0ZDVhZWRcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBpbml0IGZyb20gJy4vbWFwaW5pdC5qcyc7XG5cbnltYXBzLnJlYWR5KGluaXQpO1xuXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3JvdXRlL2FwcC5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFJvdXRlUG9pbnQgZnJvbSAnLi9yb3V0ZXBvaW50LmpzJztcbmltcG9ydCBSb3V0ZXIgZnJvbSAnLi9yb3V0ZS5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGluaXQoKSB7XG5cblxuXG4gICAgbGV0IG15TWFwID0gbmV3IHltYXBzLk1hcCgnbWFwJywge1xuICAgICAgICBjZW50ZXI6IFs1OS45NSwgMzAuMl0sXG4gICAgICAgIHpvb206IDEwXG4gICAgfSwge1xuICAgICAgICBzZWFyY2hDb250cm9sUHJvdmlkZXI6ICd5YW5kZXgjc2VhcmNoJ1xuICAgIH0pO1xuXG4gICAgbGV0IG51bU9mSW50ZXJQb2ludHMgPSAxO1xuXG5cbiAgICBsZXQgc3RhcnRfZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0c19yb3V0ZV9zdGFydCcpO1xuICAgIGxldCBlbmRfZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0c19yb3V0ZV9maW5pc2gnKTtcbiAgICBsZXQgaW50ZXJQb2ludCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCd0c19yb3V0ZV9pbnRlcm1lZGlhdGVfcG9pbnRbJysgKG51bU9mSW50ZXJQb2ludHMgLSAxKSArICddJykuaXRlbShudW1PZkludGVyUG9pbnRzIC0gMSk7XG4gICAgbGV0IGludGVyUG9pbnRzID0gW10sIHJvdXRlcjtcblxuICAgIGxldCBzdGFydFAgPSBuZXcgUm91dGVQb2ludCh7XG4gICAgICAgIG1hcDogbXlNYXAsXG4gICAgICAgIGVsZW06IHN0YXJ0X2VsZW0sXG4gICAgICAgIGNvbnRlbnQ6ICdBJ1xuICAgIH0pO1xuXG4gICAgbGV0IGVuZFAgPSBuZXcgUm91dGVQb2ludCh7XG4gICAgICAgIG1hcDogbXlNYXAsXG4gICAgICAgIGVsZW06IGVuZF9lbGVtLFxuICAgICAgICBjb250ZW50OiAnQidcbiAgICB9KTtcblxuICAgIGludGVyUG9pbnRzLnB1c2gobmV3IFJvdXRlUG9pbnQoe1xuICAgICAgICBtYXA6IG15TWFwLFxuICAgICAgICBlbGVtOiBpbnRlclBvaW50LFxuICAgICAgICBjb250ZW50OiAnSSAnICsgaW50ZXJQb2ludHMubGVuZ3RoXG4gICAgfSkpO1xuXG4gICAgbXlNYXAuZ2VvT2JqZWN0cy5ldmVudHMuYWRkKCdhZGQnLCAoZSkgPT4ge1xuXG4gICAgICAgIGxldCB0YXJnZXQgPSBlLmdldCgndGFyZ2V0Jyk7XG4gICAgICAgIGxldCBsYXN0X2FkZGVkID0gdGFyZ2V0LmdldCh0YXJnZXQuZ2V0TGVuZ3RoKCkgLSAxKTtcbiAgICAgICAgaWYoIWxhc3RfYWRkZWQuZ2VvbWV0cnkpIHJldHVybjtcblxuICAgICAgICBpZihyb3V0ZXIpIHtcbiAgICAgICAgICAgIHJvdXRlci5pbnRlclBvaW50cyA9IGludGVyUG9pbnRzLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0ucGxhY2VtYXJrO1xuICAgICAgICAgICAgfSkubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5wbGFjZW1hcms7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJvdXRlci5yZW5kZXIoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCFzdGFydFAuY29vcmRzIHx8ICFlbmRQLmNvb3JkcykgcmV0dXJuO1xuXG4gICAgICAgIHJvdXRlciA9IG5ldyBSb3V0ZXIoe1xuICAgICAgICAgICAgbWFwOiBteU1hcCxcbiAgICAgICAgICAgIHBvaW50QTogc3RhcnRQLnBsYWNlbWFyayxcbiAgICAgICAgICAgIHBvaW50QjogZW5kUC5wbGFjZW1hcmssXG4gICAgICAgICAgICBpbnRlclBvaW50czogaW50ZXJQb2ludHMuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5wbGFjZW1hcms7XG4gICAgICAgICAgICB9KS5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLnBsYWNlbWFyaztcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuXG5cbiAgICB9KTtcbn1cblxuXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3JvdXRlL21hcGluaXQuanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJccmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvdXRlUG9pbnQge1xyICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcciAgICAgICAgaWYob3B0aW9ucy5tYXApIHRoaXMubWFwID0gb3B0aW9ucy5tYXA7XHIgICAgICAgIHRoaXMuX2NvbGxlY3Rpb24gPSB0aGlzLm1hcC5nZW9PYmplY3RzO1xyICAgICAgICB0aGlzLmNvbnRlbnQgPSBvcHRpb25zLmNvbnRlbnQgfHwgJ9Ci0L7Rh9C60LAnO1xyICAgICAgICBpZihvcHRpb25zLmVsZW0pIHtcciAgICAgICAgICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcciAgICAgICAgICAgIGxldCBzdWdnZXN0VmlldyA9IG5ldyB5bWFwcy5TdWdnZXN0Vmlldyh0aGlzLmVsZW0pO1xyICAgICAgICAgICAgc3VnZ2VzdFZpZXcuZXZlbnRzLmFkZCgnc2VsZWN0JywgKCkgPT4gdGhpcy5yZW5kZXIoKSk7XHIgICAgICAgIH1cciAgICB9XHJcciAgICByZW5kZXIoKSB7XHIgICAgICAgIGxldCBjdHggPSB0aGlzO1xyICAgICAgICBpZih0aGlzLmlucHV0X3ZhbHVlID09IHRoaXMuZWxlbS52YWx1ZSkgcmV0dXJuO1xyICAgICAgICB0aGlzLmlucHV0X3ZhbHVlID0gdGhpcy5lbGVtLnZhbHVlO1xyXHIgICAgICAgIHltYXBzLmdlb2NvZGUodGhpcy5pbnB1dF92YWx1ZSwge1xyICAgICAgICAgICAgcmVzdWx0czogMVxyICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcciAgICAgICAgICAgIGN0eC5jbGVhcigpO1xyICAgICAgICAgICAgY3R4LmNvb3JkcyA9IHJlcy5nZW9PYmplY3RzLmdldCgwKS5nZW9tZXRyeS5nZXRDb29yZGluYXRlcygpO1xyICAgICAgICAgICAgY3R4LnBsYWNlbWFyayA9ICBuZXcgeW1hcHMuUGxhY2VtYXJrKGN0eC5jb29yZHMsIHtcciAgICAgICAgICAgICAgICBpY29uQ29udGVudDogY3R4LmNvbnRlbnQsXHIgICAgICAgICAgICAgICAgYmFsbG9vbkNvbnRlbnQ6IGN0eC5pbnB1dF92YWx1ZVxyICAgICAgICAgICAgfSwge1xyICAgICAgICAgICAgICAgIHByZXNldDogJ2lzbGFuZHMjdmlvbGV0U3RyZXRjaHlJY29uJyxcciAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IHRydWVcciAgICAgICAgICAgIH0pO1xyICAgICAgICAgICAgY3R4LmFkZCgpO1xyXHIgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xyICAgICAgICAgICAgY29uc29sZS5sb2coJ1BvaW50IGVycm9yJyk7XHIgICAgICAgIH0pO1xyICAgIH1cclxyICAgIGFkZCgpIHtcciAgICAgICAgdGhpcy5fY29sbGVjdGlvbi5hZGQodGhpcy5wbGFjZW1hcmspO1xyICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy5fY29sbGVjdGlvbi5nZXRMZW5ndGgoKSAtIDE7XHIgICAgfVxyXHIgICAgY2xlYXIoKSB7XHIgICAgICAgIGlmKCF0aGlzLmluZGV4ICYmIHRoaXMuaW5kZXggIT0gMCkgcmV0dXJuO1xyICAgICAgICB0aGlzLl9jb2xsZWN0aW9uLnJlbW92ZSh0aGlzLl9jb2xsZWN0aW9uLmdldCh0aGlzLmluZGV4KSk7XHIgICAgICAgIHRoaXMuaW5kZXggPSBudWxsO1xyICAgIH1ccn1cclxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vcm91dGUvcm91dGVwb2ludC5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm91dGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5tYXAgPSBvcHRpb25zLm1hcDtcbiAgICAgICAgdGhpcy5wb2ludEEgPSBvcHRpb25zLnBvaW50QTtcbiAgICAgICAgdGhpcy5wb2ludEIgPSBvcHRpb25zLnBvaW50QjtcbiAgICAgICAgdGhpcy5pbnRlclBvaW50cyA9IG9wdGlvbnMuaW50ZXJQb2ludHM7XG4gICAgICAgIHRoaXMuX2NvbGxlY3Rpb24gPSB0aGlzLm1hcC5nZW9PYmplY3RzO1xuICAgICAgICB0aGlzLl9zdGFydEVkaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faXNCdXR0b25MaXN0ZW5pbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGxldCBjdHggPSB0aGlzO1xuICAgICAgICBsZXQgY29vcmRzID0gW107XG5cbiAgICAgICAgZGVidWdnZXI7XG5cbiAgICAgICAgLy9pZih0aGlzLnBvaW50cyAmJiB0aGlzLmludGVyUG9pbnRzLmxlbmd0aCkge1xuICAgICAgICAvLyAgICBsZXQgbGFzdF9wb2ludCA9IGN0eC5wb2ludHMuZ2V0KGN0eC5wb2ludHMuZ2V0TGVuZ3RoKCkgLSAxKTtcbiAgICAgICAgLy8gICAgdGhpcy5pbnRlclBvaW50cy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgLy8gICAgICAgY3R4LnBvaW50cy5zZXQoY3R4LnBvaW50cy5nZXRMZW5ndGgoKSAtIDEsIGl0ZW0pO1xuICAgICAgICAvLyAgICB9KTtcbiAgICAgICAgLy8gICAgY3R4LnBvaW50cy5zZXQoY3R4LnBvaW50cy5nZXRMZW5ndGgoKSwgbGFzdF9wb2ludCk7XG4gICAgICAgIC8vfVxuXG5cbiAgICAgICAgaWYoIXRoaXMucG9pbnRzIHx8IHRoaXMuaW50ZXJQb2ludHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBsZXQgcG9pbnRzID0gW3RoaXMucG9pbnRBLCB0aGlzLnBvaW50Ql07XG4gICAgICAgICAgICBwb2ludHMuc3BsaWNlLmFwcGx5KHBvaW50cywgWzEsIDBdLmNvbmNhdCh0aGlzLmludGVyUG9pbnRzKSk7XG4gICAgICAgICAgICB0aGlzLnBvaW50cyA9IG5ldyB5bWFwcy5HZW9PYmplY3RDb2xsZWN0aW9uKHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogcG9pbnRzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJQb2ludHMgPSBbXTtcbiAgICAgICAgfVxuXG5cblxuICAgICAgICB0aGlzLnBvaW50cy5lYWNoKGZ1bmN0aW9uIChlbGVtLCBpKSB7XG4gICAgICAgICAgICBjb29yZHNbaV0gPSBlbGVtLmdlb21ldHJ5LmdldENvb3JkaW5hdGVzKCk7XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgeW1hcHMucm91dGUoY29vcmRzKVxuICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbihyb3V0ZSkge1xuICAgICAgICAgICAgICAgIGN0eC5yb3V0ZSA9IHJvdXRlO1xuICAgICAgICAgICAgICAgIGN0eC5fY29sbGVjdGlvbi5yZW1vdmVBbGwoKTtcbiAgICAgICAgICAgICAgICBjdHguYWRkKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3I6ICcgKyBlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG5cbiAgICBhZGQoKSB7XG4gICAgICAgIC8vIFRPRE86IGVkaXRidXR0b24g0LfQsNC00LDQstCw0YLRjCDRh9C10YDQtdC3INC60L7QvdGB0YLRgNGD0LrRgtC+0YBcblxuICAgICAgICBsZXQgZWRpdEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0b3InKTtcbiAgICAgICAgbGV0IGN0eCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5fY29sbGVjdGlvbi5hZGQodGhpcy5yb3V0ZSk7XG5cbiAgICAgICAgdGhpcy5wb2ludHMgPSB0aGlzLnJvdXRlLmdldFdheVBvaW50cygpO1xuICAgICAgICB0aGlzLnBvaW50cy5vcHRpb25zLnNldCgncHJlc2V0JywgJ2lzbGFuZHMjcmVkU3RyZXRjaHlJY29uJyk7XG4gICAgICAgIHRoaXMucG9pbnRzLm9wdGlvbnMuc2V0KCdkcmFnZ2FibGUnLCAndHJ1ZScpO1xuICAgICAgICB0aGlzLnBvaW50cy5lYWNoKCBmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgICAgICBlbGVtLmV2ZW50cy5hZGQoJ2RyYWdlbmQnLCAoZSkgPT4gY3R4Lm9uQ2hhbmdlKGUpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYoIXRoaXMuX2lzQnV0dG9uTGlzdGVuaW5nKSB7XG4gICAgICAgICAgICBlZGl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zdGFydEVkaXRpbmcgPSAhdGhpcy5fc3RhcnRFZGl0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm91dGUuZWRpdG9yLnN0YXJ0KHsgYWRkV2F5UG9pbnRzOiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgICAgICBlZGl0QnV0dG9uLnZhbHVlID0gJ9Ce0YLQutC70Y7Rh9C40YLRjCDRgNC10LTQsNC60YLQvtGAINC80LDRgNGI0YDRg9GC0LAnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm91dGUuZWRpdG9yLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgZWRpdEJ1dHRvbi52YWx1ZSA9ICfQktC60LvRjtGH0LjRgtGMINGA0LXQtNCw0LrRgtC+0YAg0LzQsNGA0YjRgNGD0YLQsCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9pc0J1dHRvbkxpc3RlbmluZyA9IHRydWU7XG4gICAgICAgIH1cblxuXG5cbiAgICB9XG5cbiAgICBvbkNoYW5nZShlKSB7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuXG5cblxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9yb3V0ZS9yb3V0ZS5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=