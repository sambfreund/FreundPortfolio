$(window).on("load", function() {
	$(".loader .inner").fadeOut(500, function() {
			$(".loader").fadeOut(750);
		});

	if ($.fn.isotope && $(".items").length) {
		$(".items").isotope({
			filter:'*',
			animationOptions: {
				duration: 1500,
				easing: 'linear',
				queue: false
			}
		});
	}
});

$(document).ready(function() {
	var heroTraits = [
		"Father.",
		"Senior Quality Engineer.",
		"Designer.",
		"Husband.",
		"Developer.",
		"Life Long Learner.",
		"Problem Solver.",
		"Dog Dad.",
		"Nature Lover.",
		"Book Worm.",
		"Disc Golfer.",
		"Gamer.",
		"Husker Fan.",
		"Writer."
	];

	function initHeroAmbient(words) {
		var ambient = document.querySelector(".hero-ambient");
		if (!ambient || !words || !words.length) return;

		var layout = [
			[8, 16], [24, 9], [40, 18], [56, 10], [72, 17], [86, 12],
			[14, 34], [30, 40], [46, 33], [62, 41], [78, 35], [90, 43],
			[10, 57], [28, 63], [44, 56], [60, 64], [76, 59], [89, 66]
		];
		var variants = ["drift-a", "drift-b", "drift-c"];
		var ambientWords = words.concat(words.slice(0, 4));

		ambient.innerHTML = "";
		ambientWords.forEach(function(label, i) {
			var word = document.createElement("span");
			var pos = layout[i % layout.length];
			word.className = "ambient-word " + variants[i % variants.length];
			word.textContent = label.replace(/\.$/, "");
			word.style.left = pos[0] + "%";
			word.style.top = pos[1] + "%";
			word.style.animationDelay = (i * -2.3) + "s";
			word.style.fontSize = (0.72 + (i % 4) * 0.07) + "rem";
			ambient.appendChild(word);
		});

		// One highlighted ambient word that starts with "Father" and cycles through all traits.
		var highlight = document.createElement("span");
		highlight.className = "ambient-word ambient-highlight";
		ambient.appendChild(highlight);

		var highlightWordIndex = 0; // starts with Father.
		var lastPosIndex = -1;

		function nextHighlight(firstRun) {
			if (!firstRun) {
				highlight.classList.remove("is-visible");
			}

			setTimeout(function() {
				var posIndex = Math.floor(Math.random() * layout.length);
				if (layout.length > 1 && posIndex === lastPosIndex) {
					posIndex = (posIndex + 1) % layout.length;
				}
				lastPosIndex = posIndex;

				var pos = layout[posIndex];
				highlight.textContent = words[highlightWordIndex].replace(/\.$/, "");
				highlight.style.left = pos[0] + "%";
				highlight.style.top = pos[1] + "%";
				highlight.classList.add("is-visible");

				highlightWordIndex = (highlightWordIndex + 1) % words.length;
			}, firstRun ? 0 : 220);
		}

		nextHighlight(true);
		setInterval(function() {
			nextHighlight(false);
		}, 2400);
	}

	initHeroAmbient(heroTraits);

	if (typeof Typed !== 'undefined' && document.querySelector(".typed")) {
		var typed = new Typed(".typed", {
			strings: heroTraits,
			typeSpeed: 80,
			loop: true,
			startDelay: 1000,
			showCursor: false
		});
	}

	if ($.fn.fancybox && $("[data-fancybox]").length) {
		$("[data-fancybox]").fancybox();
	}

	$("#filters a").click(function() {
		if (!$.fn.isotope || !$(".items").length) {
			return false;
		}

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

	$("#navigation li a[href^='#']").click(function(e) {
			e.preventDefault();

			var targetElement = $(this).attr("href");
			if (!$(targetElement).length) return;
			var targetPostion = $(targetElement).offset().top;
			$("html, body").animate({ scrollTop: targetPostion - 80 }, "slow");
		});

		// Portfolio reveal + subtle tilt motion
		var cardItems = document.querySelectorAll(".items li");
		if (cardItems.length) {
			document.body.classList.add("portfolio-motion");

			cardItems.forEach(function(item, index) {
				var delay = (index % 3) * 70;
				item.style.setProperty("--reveal-delay", delay + "ms");
			});

			if ("IntersectionObserver" in window) {
				var revealObserver = new IntersectionObserver(function(entries, observer) {
					entries.forEach(function(entry) {
						if (!entry.isIntersecting) return;
						entry.target.classList.add("card-visible");
						observer.unobserve(entry.target);
					});
				}, { threshold: 0.15, rootMargin: "0px 0px -30px 0px" });

				cardItems.forEach(function(item) {
					revealObserver.observe(item);
				});
			} else {
				cardItems.forEach(function(item) {
					item.classList.add("card-visible");
				});
			}

			var canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches
				&& !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

			if (canTilt) {
				document.querySelectorAll(".portfolio-card").forEach(function(card) {
					card.addEventListener("mousemove", function(e) {
						var rect = card.getBoundingClientRect();
						var x = (e.clientX - rect.left) / rect.width;
						var y = (e.clientY - rect.top) / rect.height;
						var rotateY = (x - 0.5) * 6;
						var rotateX = (0.5 - y) * 6;
						card.style.setProperty("--tilt-x", rotateX.toFixed(2) + "deg");
						card.style.setProperty("--tilt-y", rotateY.toFixed(2) + "deg");
					});

					card.addEventListener("mouseleave", function() {
						card.style.setProperty("--tilt-x", "0deg");
						card.style.setProperty("--tilt-y", "0deg");
					});
				});
			}
		}

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
