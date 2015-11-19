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
					myMap = new ymaps.Map('map', {
						center: [59.95, 30.2],
						zoom: 10
					}, {
						searchControlProvider: 'yandex#search'
					});

					document.getElementById('destroyButton').onclick = function () {
						myMap.destroy();
					};

				}
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				$('.date-select').pickmeup_twitter_bootstrap({
    				format		: 'd-m-Y',
					position	: 'top',
					prev		: '',
					next		: '',
					separator	: ';',
					locale		: {
									days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
									daysShort: ["Вск", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Суб"],
									daysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
									months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
									monthsShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"]
									}
					});
				
				
				
				
			});