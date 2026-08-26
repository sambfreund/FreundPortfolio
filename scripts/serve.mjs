import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 8080);
const contentTypes = {
	".css": "text/css; charset=utf-8",
	".html": "text/html; charset=utf-8",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".js": "text/javascript; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".md": "text/markdown; charset=utf-8",
	".png": "image/png",
	".svg": "image/svg+xml"
};

const server = http.createServer(async (request, response) => {
	try {
		const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
		const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
		let filePath = path.resolve(root, relativePath);

		if (!filePath.startsWith(root + path.sep) && filePath !== path.join(root, "index.html")) {
			response.writeHead(403).end("Forbidden");
			return;
		}

		if ((await stat(filePath)).isDirectory()) {
			filePath = path.join(filePath, "index.html");
		}

		const body = await readFile(filePath);
		response.writeHead(200, {
			"Content-Type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
			"Cache-Control": "no-store"
		});
		response.end(body);
	} catch {
		response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
		response.end("Not found");
	}
});

server.listen(port, "127.0.0.1", () => {
	console.log("Portfolio preview: http://127.0.0.1:" + port);
	console.log("Blog: http://127.0.0.1:" + port + "/blog.html");
	console.log("Press Ctrl+C to stop.");
});
