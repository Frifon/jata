			expromptum();
			
			jQuery(function($){
				$("#tel-number").mask("(999) 999-99-99"); // Маска телефона

				$('body').on('click', '.tel-number', function(){
					$(".tel-number").mask("(999) 999-99-99");
					});
				
				
				$('#vladelec').click(function() {
						$(".yurik-fizik-check").show();
						});
				$('#reklamodatel').click(function() {
						$(".yurik-fizik-check").hide();
					
						});
				
				$(document).ready( function() {
					$(".file-upload input[type=file]").change(function(){
						 var filename = $(this).val().replace(/.*\\/, "");
						 $("#filename").html(filename);
					});
				});
				
				
				$('#helper-slider').on('fotorama:show', function (e, fotorama) {
						if(fotorama.activeIndex+1 == fotorama.size) {
							$('#helper-slider-close').attr('data-dismiss', 'alert').removeAttr("disabled");
							}
					});
				
				$('#modal_how_it_work').on('fotorama:show', function (e, fotorama) {
						if(fotorama.activeIndex+1 == fotorama.size) {
							$('.close-modal--how-it-work').attr('data-dismiss', 'modal').removeAttr("disabled");
							}
					});
				
				$('select[name="ts_color"]').simplecolorpicker({
  					theme: 'glyphicons'
					});
				$('select[name="ts_color"]').simplecolorpicker('selectColor', '#dc2127');
				
				
				$('.timepicker-input-start').timepicker({
                	template: 'dropdown',
                	showInputs: false,
					showMeridian: false,
					maxHours: 24,
                	minuteStep: 15,
					showSeconds: false,
					defaultTime: '9:00'
            		});
				$('.timepicker-input-end').timepicker({
                	template: 'dropdown',
                	showInputs: false,
					showMeridian: false,
					maxHours: 24,
                	minuteStep: 15,
					showSeconds: false,
					defaultTime: '10:00'
            		});
				
				
				
				(function ($) {
				var input_class = 'input-with-x',
					input_class_x = input_class + '__x',
					input_class_x_over = input_class + '__x-over',
					input_selector = '.' + input_class,
					input_selector_x = '.' + input_class_x,
					input_selector_x_over = '.' + input_class_x_over,
					event_main = input_class + '-init',
					event_names = [event_main, 'focus drop paste keydown keypress input change'].join(' '),
					btn_width = 13,
					btn_height = 13,
					btn_margin = 7;

				function tog(v) {
					return v ? 'addClass' : 'removeClass';
				}

				$(document).on(event_names, input_selector, function () {
					$(this)[tog(this.value)](input_class_x);
				});

				$(document).on('mousemove', input_selector_x, function (e) {
					var input = $(this),
						input_width = this.offsetWidth,
						input_height = this.offsetHeight,
						input_border_bottom = parseFloat(input.css('borderBottomWidth')),
						input_border_right = parseFloat(input.css('borderRightWidth')),
						input_border_left = parseFloat(input.css('borderLeftWidth')),
						input_border_top = parseFloat(input.css('borderTopWidth')),
						input_border_hr = input_border_left + input_border_right,
						input_border_vr = input_border_top + input_border_bottom,
						client_rect = this.getBoundingClientRect(),
						input_cursor_pos_x = e.clientX - client_rect.left,
						input_cursor_pos_y = e.clientY - client_rect.top,
						is_over_cross = true;

					is_over_cross = is_over_cross && (input_cursor_pos_x >= input_width - input_border_hr - btn_margin - btn_width);
					is_over_cross = is_over_cross && (input_cursor_pos_x <= input_width - input_border_hr - btn_margin);
					is_over_cross = is_over_cross && (input_cursor_pos_y >= (input_height - input_border_vr - btn_height) / 2);
					is_over_cross = is_over_cross && (input_cursor_pos_y <= (input_height - input_border_vr - btn_height) / 2 + btn_height);

					$(this)[tog(is_over_cross)](input_class_x_over);
				});

				$(document).on('click', input_selector_x_over, function () {
					$(this).removeClass([input_class_x, input_class_x_over].join(' ')).val('').trigger('input');
				});

				$(function () {
					$(input_selector).trigger(event_main);
				});

			})(jQuery);
				
				
				
				
				
				
				
				
				
				
				var myMap;

				ymaps.ready(init);

				function init () {
					var myPlacemark;
					myMap = new ymaps.Map('map', {
						center: [59.95, 30.2],
						zoom: 10
					}, {
						searchControlProvider: 'yandex#search'
					});

					// document.getElementById('destroyButton').onclick = function () {
					// 	myMap.destroy();
					// };


					// Слушаем клик на карте
				    // myMap.events.add('click', function (e) {
				    //     var coords = e.get('coords');

				    //     // Если метка уже создана – просто передвигаем ее
				    //     if (myPlacemark) {
				    //         myPlacemark.geometry.setCoordinates(coords);
				    //     }
				    //     // Если нет – создаем.
				    //     else {
				    //         myPlacemark = createPlacemark(coords);
				    //         myMap.geoObjects.add(myPlacemark);
				    //         // Слушаем событие окончания перетаскивания на метке.
				    //         myPlacemark.events.add('dragend', function () {
				    //             getAddress(myPlacemark.geometry.getCoordinates());
				    //         });
				    //     }
				    //     getAddress(coords);
				    // });

				    // // Создание метки
				    // function createPlacemark(coords) {
				    //     return new ymaps.Placemark(coords, {
				    //         iconContent: 'поиск...'
				    //     }, {
				    //         preset: 'islands#lightBlueStretchyIcon',
				    //         draggable: true
				    //     });
				    // }

				    // // Определяем адрес по координатам (обратное геокодирование)
				    // function getAddress(coords) {
				    //     myPlacemark.properties.set('iconContent', 'поиск...');
				    //     ymaps.geocode(coords).then(function (res) {
				    //         var firstGeoObject = res.geoObjects.get(0);

				    //         myPlacemark.properties
				    //             .set({
				    //                 iconContent: firstGeoObject.properties.get('name'),
				    //                 balloonContent: firstGeoObject.properties.get('text')
				    //             });
				    //     });
				    // }

				    var start_coord;
				    var end_coord;
				    var temp_points = [];
				    var temp_query = [];
				    for (var i = 0; i < 10; i++) {
				    	temp_points[i] = 0;
				    	temp_query[i] = '';
				    }
				    var start_input, end_input;
				    var myCollection = new ymaps.GeoObjectCollection();
					function updateMap() {
						myCollection.removeAll();
			        	var startP, endP, line_coords = [];
			        	if (start_coord) {
				        	startP = new ymaps.Placemark(start_coord, {
								iconContent: 'A',
								balloonContent: start_input
							}, {
								preset: 'islands#violetStretchyIcon'
							});
							line_coords.push(start_coord);
							myCollection.add(startP);
				        }
				        
						for (var i = 1; i <= temp_points.length; i++) {
							if (!temp_points[i - 1]) {
								continue;
							}
							var P = new ymaps.Placemark(temp_points[i - 1][0], {
								iconContent: 'П' + i.toString(),
								balloonContent: temp_points[i - 1][1]
							}, {
								preset: 'islands#violetStretchyIcon'
							});
							line_coords.push(temp_points[i - 1][0]);
							myCollection.add(P);
						}

						if (end_coord) {
							endP = new ymaps.Placemark(end_coord, {
								iconContent: 'B',
								balloonContent: end_input
							}, {
								preset: 'islands#violetStretchyIcon'
							});
							line_coords.push(end_coord);
							myCollection.add(endP);
						}

						var myPolyline = new ymaps.GeoObject({
						    geometry: {
						        type: "LineString",
						        coordinates: line_coords
						    }
						});

						myCollection.add(myPolyline);
			            myMap.geoObjects.add(myCollection);
						myMap.setBounds(myMap.geoObjects.getBounds(), {checkZoomRange:true}).then(function(){ if(myMap.getZoom() > 10) myMap.setZoom(10);});
					}
					var last_start = '';
					var last_end = '';
					var last_i = -1;
					setInterval(function() {
					    start_input = document.getElementById('ts_route_start').value;
					    end_input = document.getElementById('ts_route_finish').value;
					    var i = 0, need = 0, fill = 0;
					    console.log(temp_points);
					    console.log(temp_query);
						while (document.getElementsByName('ts_route_intermediate_point[' + i.toString() + ']')[0]) {
							if (document.getElementsByName('ts_route_intermediate_point[' + i.toString() + ']')[0].value) {
								fill = 1;
							}
							i++;
						}
						if (fill) {
							if (i < last_i) {
								console.log(i, temp_query.length);
								need = 1;
								for (var j = 0; j < temp_points.length; j++) {
									temp_points[j] = 0;
								}
								for (var j = 0; j < temp_query.length; j++) {
									temp_query[j] = 0;
								}
							} else if (i > temp_points.length) {
								need = 1;
							} else {
								for (var j = 0; j < i; j++) {
									if (document.getElementsByName('ts_route_intermediate_point[' + j.toString() + ']')[0].value !== temp_query[j]) {
										need = 1;
									}
								}
							}
						}
						last_i = i;
						console.log(need, fill);
						if (start_input == last_start && end_input == last_end && !need)
							return;
						last_start = start_input;
						last_end = end_input;
						if (need) {
							for (var j = 0; j < i; j++) {
								var text = document.getElementsByName('ts_route_intermediate_point[' + j.toString() + ']')[0].value;
								if (temp_query[j] == text)
									continue;
								var jj = j;
								console.log(text);
								temp_points[j] = 0;
								temp_query[j] = text;
								console.log('temp input changed to: ', text);
						    	ymaps.geocode(text, {
							        results: 1
							    }).then(function (res) {
						            var firstGeoObject = res.geoObjects.get(0),
						                coords = firstGeoObject.geometry.getCoordinates();
						        	console.log('put', text, 'to', jj);
						        	temp_points[jj] = [coords, text];
						            updateMap();
						        });
							}
						}
						console.log('start input changed to: ', start_input);
					    ymaps.geocode(start_input, {
					        results: 1
					    }).then(function (res) {
				            var firstGeoObject = res.geoObjects.get(0),
				                coords = firstGeoObject.geometry.getCoordinates();
				        	start_coord = coords;
				            updateMap();
				        });

				        console.log('end input changed to: ', end_input);
					    ymaps.geocode(end_input, {
					        results: 1
					    }).then(function (res) {
					    	var firstGeoObject = res.geoObjects.get(0),
				                coords = firstGeoObject.geometry.getCoordinates();
				        	end_coord = coords;
				            updateMap();
				        });
					}, 1000);
				}
				
				
				
				
			
				
				$('.date-select').daterangepicker({
					"singleDatePicker": true,
					"showDropdowns": true,
					"autoApply": true,
					"linkedCalendars": false,
					"drops": "up",
					"locale": {
						"format": "DD-MM-YYYY",
						"separator": " ; ",
						"applyLabel": "Apply",
						"cancelLabel": "Cancel",
						"fromLabel": "From",
						"toLabel": "To",
						"customRangeLabel": "Custom",
						"daysOfWeek": ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"],
						"monthNames": ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
						"firstDay": 1
					}
				});
				
				$('.date-select-person').daterangepicker({
					"singleDatePicker": true,
					"minDate": moment().subtract('years', 60),
					"maxDate": moment().subtract('years', 18),
					"startDate": "01/01/1980",
					"showDropdowns": true,
					"autoApply": true,
					"linkedCalendars": false,
					"drops": "up",
					"locale": {
						"format": "DD-MM-YYYY",
						"separator": " ; ",
						"applyLabel": "Apply",
						"cancelLabel": "Cancel",
						"fromLabel": "From",
						"toLabel": "To",
						"customRangeLabel": "Custom",
						"daysOfWeek": ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"],
						"monthNames": ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
						"firstDay": 1
					}
				});
				
				
				
				
			});