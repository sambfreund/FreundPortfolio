$(window).on("load", function() {
	$(".loader .inner").fadeOut(500, function() {
			$(".loader").fadeOut(750);
		});

			$(".items").isotope({
			filter:'*',
			animationOptions: {
				duration: 1500,
				easing: 'linear',
				queue: false
			}
		});
});

$(document).ready(function() {

 $('#slides').superslides({
 	animation: 'fade',
 	play: 5000
 });

	var typed = new Typed(".typed", {
 		strings: ["Father.", "Quality Assurance Professional.", "Designer.", "Husband.", "Developer.", "Life Long Learner."],
 		typeSpeed: 80,
 		loop: true,
 		startDelay: 1000,
 		showCursor: false
 	});

	$('.owl-carousel').owlCarousel({
	    loop:true,
	    items: 4,
	    responsive:{
	        0:{
	            items:1
	        },
	        480:{
	            items:2
	        },
	        768:{
	            items:3
	        },
	        938:{
	        	items:4
	        }
	    }
	});


		var skillsTopOffSet = $(".skillsSection").offset().top;
		var statsTopOffSet = $(".statsSection").offset().top;
		var countUpFinished = false;

		$(window).scroll(function() {

			if(window.pageYOffset > skillsTopOffSet - $(window).height() + 200) {

				$('.chart').easyPieChart({
		    		easing: 'easeInOut',
		    		barColor: '#FFF',
		    		trackColor: false,
		    		scaleColor: false,
		    		lineWidth: 4,
		    		size: 152,
		    		onStep: function(from, to, percent) {
		    			$(this.el).find('.percent').text(Math.round(percent));
		    		}
				});

			}


			if(!countUpFinished && window.pageYOffset > statsTopOffSet - $(window).height() + 200) {
				$(".counter").each(function() {
					var element = $(this);
					var endVal = parseInt(element.text());

					element.countup(endVal);
				})

					countUpFinished = true;
			}

		});

		$("[data-fancybox]").fancybox();

		$("#filters a").click(function() {
			$("#filters .current").removeClass("current");
			$(this).addClass("current");

			var selector = $(this).attr("data-filter");

			$(".items").isotope({
			filter: selector,
			animationOptions: {
				duration: 1500,
				easing: 'linear',
				queue: false
			}
		});

			return false;
	});

		$("#navigation li a").click(function(e) {
			e.preventDefault();

			var targetElement = $(this).attr("href");
			var targetPostion = $(targetElement).offset().top;
			$("html, body").animate({ scrollTop: targetPostion - 80 }, "slow");
		});

		const nav = $("#navigation");
		const navTop = nav.offset().top;

		$(window).on("scroll", stickyNavigation);

		function stickyNavigation() {


			var body = $("body");

			if($(window).scrollTop() >= navTop) {
				body.css("padding-top", nav.outerHeight() + "px");
				body.addClass("fixedNav");
			}
			else {
				body.css("padding-top", 0);
				body.removeClass("fixedNav");
			}

		}
});
