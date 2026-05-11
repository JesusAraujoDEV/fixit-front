/**
 * Production server for Dokploy / Docker deployments.
 * Serves the TanStack Start SSR app using the Cloudflare Worker output
 * adapted to run on Node.js via miniflare-like fetch handling.
 *
 * Reads PORT from environment variable (defaults to 3000).
 */

import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PORT = parseInt(process.env.PORT || "3000", 10);

const CLIENT_DIR = join(__dirname, "dist", "client");

// MIME types for static files
const MIME_TYPES = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json",
};

// Try to serve static file from dist/client
function tryServeStatic(pathname) {
  const filePath = join(CLIENT_DIR, pathname);
  if (existsSync(filePath)) {
    try {
      const content = readFileSync(filePath);
      const ext = extname(filePath);
      return { content, mime: MIME_TYPES[ext] || "application/octet-stream" };
    } catch {
      return null;
    }
  }
  return null;
}

// Import the SSR worker
let workerModule;
try {
  const serverEntryPath = join(__dirname, "dist", "server", "index.js");
  const serverEntryUrl = new URL(`file://${serverEntryPath}`).href;
  workerModule = await import(serverEntryUrl);
} catch (e) {
  console.error("Failed to load SSR server entry:", e.message);
  console.log("Falling back to static-only mode.");
  workerModule = null;
}

const handler = workerModule?.default || workerModule;

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // Try static files first (assets)
  if (pathname.startsWith("/assets/") || pathname === "/favicon.ico" || pathname === "/.assetsignore") {
    const staticFile = tryServeStatic(pathname);
    if (staticFile) {
      const cacheControl = pathname.startsWith("/assets/")
        ? "public, max-age=31536000, immutable"
        : "public, max-age=3600";
      res.writeHead(200, {
        "Content-Type": staticFile.mime,
        "Cache-Control": cacheControl,
      });
      res.end(staticFile.content);
      return;
    }
  }

  // SSR: forward to the Worker handler
  if (handler && typeof handler.fetch === "function") {
    try {
      // Build a Request object
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
      }

      let body = undefined;
      if (req.method !== "GET" && req.method !== "HEAD") {
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        body = Buffer.concat(chunks);
      }

      const request = new Request(url.toString(), {
        method: req.method,
        headers,
        body,
      });

      const response = await handler.fetch(request, {}, { waitUntil: () => {} });

      // Write response
      const responseHeaders = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      res.writeHead(response.status, responseHeaders);
      const responseBody = await response.arrayBuffer();
      res.end(Buffer.from(responseBody));
    } catch (error) {
      console.error("SSR Error:", error);
      res.writeHead(500, { "Content-Type": "text/html" });
      res.end("<h1>500 Internal Server Error</h1>");
    }
  } else {
    // Fallback: serve index.html for SPA routing
    const indexFile = tryServeStatic("/index.html");
    if (indexFile) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(indexFile.content);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 FixIt server running on http://0.0.0.0:${PORT}`);
});
