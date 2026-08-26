# Sam Freund Portfolio

A static personal portfolio and Markdown-powered blog.

## Add a blog post

From PowerShell, run:

```powershell
.\scripts\new-post.ps1
```

The script asks for a title, excerpt, and optional comma-separated tags. It then:

1. Creates a dated Markdown post in `posts/`.
2. Generates a URL-friendly slug from the title.
3. Rebuilds `posts/posts.json` automatically.

Open the new Markdown file, replace `Start writing here.`, and write with normal Markdown. There is no need to edit HTML or JSON by hand.

You can also provide everything in one command:

```powershell
.\scripts\new-post.ps1 -Title "What I Learned" -Excerpt "A short summary for the blog index." -Tags "Quality Engineering, Life"
```

If you later change a post's title, date, excerpt, or tags, rebuild the index with:

```powershell
.\scripts\build-posts.ps1
```

To preview the site locally, serve the project directory over HTTP rather than opening the HTML as a `file://` URL:

```text
node scripts/serve.mjs
```

Then open `http://127.0.0.1:8080/blog.html`. Press `Ctrl+C` in the terminal to stop the preview server.
