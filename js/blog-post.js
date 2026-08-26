(function() {
	"use strict";

	var titleElement = document.getElementById("post-title");
	var contentElement = document.getElementById("post-content");
	var dateElement = document.getElementById("post-date");
	var readingTimeElement = document.getElementById("post-reading-time");
	var tagsElement = document.getElementById("post-tags");

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

	function stripFrontMatter(markdown) {
		return markdown.replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*(?:\r?\n|$)/, "");
	}

	function readingTime(markdown) {
		var plainText = markdown
			.replace(/\x60{3}[\s\S]*?\x60{3}/g, " ")
			.replace(/\x60[^\x60]*\x60/g, " ")
			.replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
			.replace(/\[[^\]]*\]\([^)]*\)/g, " ")
			.replace(/[#>*_~\-]/g, " ");
		var words = plainText.trim().split(/\s+/).filter(Boolean).length;
		return Math.max(1, Math.ceil(words / 220));
	}

	function renderTags(tags) {
		if (!Array.isArray(tags) || !tags.length) {
			tagsElement.hidden = true;
			return;
		}
		tagsElement.innerHTML = tags.map(function(tag) {
			return "<span>" + escapeHTML(tag) + "</span>";
		}).join("");
	}

	function showError(title, message) {
		titleElement.textContent = title;
		dateElement.textContent = "";
		readingTimeElement.textContent = "";
		tagsElement.hidden = true;
		contentElement.innerHTML = '<div class="blog-empty"><p>' + escapeHTML(message) + '</p><a href="blog.html">Back to all writing</a></div>';
	}

	var slug = new URLSearchParams(window.location.search).get("post");
	if (!slug) {
		window.location.replace("blog.html");
		return;
	}

	fetch("posts/posts.json", { cache: "no-store" })
		.then(function(response) {
			if (!response.ok) throw new Error("Could not load the post index.");
			return response.json();
		})
		.then(function(posts) {
			var post = posts.find(function(item) { return item.slug === slug; });
			if (!post) {
				showError("Post not found", "That post does not exist, or it may have moved.");
				return null;
			}

			titleElement.textContent = post.title;
			document.title = post.title + " — Sam Freund";
			document.getElementById("page-description").setAttribute("content", post.excerpt);
			dateElement.textContent = formatDate(post.date);
			dateElement.setAttribute("datetime", post.date);
			renderTags(post.tags);

			return fetch("posts/" + encodeURIComponent(post.slug) + ".md", { cache: "no-store" });
		})
		.then(function(response) {
			if (!response) return null;
			if (!response.ok) throw new Error("Could not load the Markdown file.");
			return response.text();
		})
		.then(function(markdown) {
			if (markdown === null) return;
			var body = stripFrontMatter(markdown);
			readingTimeElement.textContent = readingTime(body) + " min read";

			if (!window.marked) {
				contentElement.textContent = body;
				return;
			}

			var rendered = window.marked.parse(body);
			contentElement.innerHTML = window.DOMPurify
				? window.DOMPurify.sanitize(rendered)
				: rendered;
		})
		.catch(function() {
			showError("Unable to load this post", "Please refresh the page and try again.");
		});
})();
