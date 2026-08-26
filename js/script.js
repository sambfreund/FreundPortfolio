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

	// The CSS honours prefers-reduced-motion, but these two animations are
	// script-driven and have to opt out here as well.
	var reduceMotion = window.matchMedia &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

		// Reduced motion: leave a single static highlight rather than cycling.
		if (reduceMotion) return;

		setInterval(function() {
			nextHighlight(false);
		}, 2400);
	}

	initHeroAmbient(heroTraits);

	var typedTarget = document.querySelector(".typed");

	if (typedTarget) {
		if (reduceMotion) {
			// Reduced motion: no looping typewriter, just show one trait.
			typedTarget.textContent = heroTraits[0];
		} else if (typeof Typed !== 'undefined') {
			new Typed(".typed", {
				strings: heroTraits,
				typeSpeed: 80,
				loop: true,
				startDelay: 1000,
				showCursor: false
			});
		}
	}

	if ($.fn.fancybox && $("[data-fancybox]").length) {
		$("[data-fancybox]").fancybox();
	}

	$("#navigation li a[href^='#']").click(function(e) {
			e.preventDefault();

			var targetElement = $(this).attr("href");
			if (!$(targetElement).length) return;
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
