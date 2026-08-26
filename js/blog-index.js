(function() {
	"use strict";

	function escapeHTML(value) {
		return String(value)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}

	function formatDate(value) {
		var date = new Date(value + "T00:00:00");
		if (Number.isNaN(date.getTime())) return value;
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric"
		});
	}

	function renderTags(tags) {
		if (!Array.isArray(tags) || !tags.length) return "";
		return '<div class="blog-tag-list">' + tags.map(function(tag) {
			return "<span>" + escapeHTML(tag) + "</span>";
		}).join("") + "</div>";
	}

	function renderPosts(posts) {
		var container = document.getElementById("blog-list");
		var sortedPosts = Array.isArray(posts) ? posts.slice() : [];

		sortedPosts.sort(function(a, b) {
			return new Date(b.date) - new Date(a.date);
		});

		if (!sortedPosts.length) {
			container.innerHTML = '<div class="blog-empty"><h3>No posts yet.</h3><p>Something is probably being thought through.</p></div>';
			return;
		}

		container.innerHTML = sortedPosts.map(function(post) {
			var href = "blog-post.html?post=" + encodeURIComponent(post.slug);
			return '<article class="blog-list-item">' +
				'<a href="' + href + '">' +
					'<div class="blog-list-meta"><time datetime="' + escapeHTML(post.date) + '">' + formatDate(post.date) + '</time></div>' +
					'<h3>' + escapeHTML(post.title) + '</h3>' +
					'<p>' + escapeHTML(post.excerpt) + '</p>' +
					renderTags(post.tags) +
					'<span class="blog-read-link">Read article <span aria-hidden="true">→</span></span>' +
				'</a>' +
			'</article>';
		}).join("");
	}

	fetch("posts/posts.json", { cache: "no-store" })
		.then(function(response) {
			if (!response.ok) throw new Error("Could not load posts.");
			return response.json();
		})
		.then(renderPosts)
		.catch(function() {
			document.getElementById("blog-list").innerHTML =
				'<div class="blog-empty"><h3>The posts could not be loaded.</h3><p>Please refresh the page and try again.</p></div>';
		});
})();
