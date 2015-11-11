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