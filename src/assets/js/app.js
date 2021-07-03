$(document).ready(function () {
	// menuManager.init();
	//initSelectCustomize.init();
	sliderManager.productFeatures();
	sliderManager.infoNumbers();
	// animationNumbers.init();
});
var menuManager = {
	init: function () {
		$(document).on('change', '.hamburger_menu_button', function () {
			$(this).prop('checked') == true ? $('#nav').addClass('show') : $('#nav').removeClass('show');
		});
	}
}
var initSelectCustomize = {
	init: function () {
		$('.select_box').select2({
			minimumResultsForSearch: Infinity,
		})
	}
};
var sliderManager = {
	productFeatures: function () {
		var swiper = new Swiper('.feature_products_listing', {
			slidesPerView: 4,
			spaceBetween: 10,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			breakpoints: {
				640: {
					slidesPerView: 1,
					spaceBetweenSlides: 50
				},
				1000: {
					slidesPerView: 2,
					spaceBetweenSlides: 50
				}
			}
		});
	},
	infoNumbers: function () {
		var swiper = new Swiper('.info_container_numbers', {
			slidesPerView: 4,
			spaceBetween: 10,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			breakpoints: {
				640: {
					slidesPerView: 1,
					spaceBetweenSlides: 50
				},
				1000: {
					slidesPerView: 2,
					spaceBetweenSlides: 50
				}
			}
		});
	}
};
var animationNumbers = {
	init: function () {
		$(window).on('scroll', function () {
			if (animationNumbers.checkVisible($('section.info_section'))) {
				animationNumbers.animationCountUp('.insurance_product_numbers', 50, 1000);
				animationNumbers.animationCountUp('.insurance_contract_numbers', 10050, 3000);
				animationNumbers.animationCountUp('.insurance_supporting_numbers', 2000200, 3000);
				$(window).off('scroll');
			}
		});
	},
	checkVisible: function (elm, eval) {
		eval = eval || "object visible";
		var viewportHeight = $(window).height(), // Viewport Height
			scrolltop = $(window).scrollTop(), // Scroll Top
			y = $(elm).offset().top,
			elementHeight = $(elm).height();

		if (eval == "object visible") return ((y < (viewportHeight + scrolltop)) && (y > (scrolltop - elementHeight)));
		if (eval == "above") return ((y < (viewportHeight + scrolltop)));
	},
	animationCountUp: function (el, maxMumber, timer) {
		$(el).prop('number', 0).animateNumber({ number: maxMumber }, timer);
	},
	commaSeparateNumber: function (val) {
		while (/(\d+)(\d{3})/.test(val.toString())) {
			val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
		}
		return val;
	}
}