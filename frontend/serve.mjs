import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = normalize(fileURLToPath(new URL("./out/", import.meta.url)));
const port = Number(process.env.PORT ?? 4173);

const types: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", "http://localhost");
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith("/")) {
      pathname += "index.html";
    }
    const candidate = normalize(join(root, pathname));
    if (!candidate.startsWith(root)) {
      res.writeHead(403);
      res.end("forbidden");
      return;
    }
    let filePath = candidate;
    try {
      const info = await stat(filePath);
      if (info.isDirectory()) {
        filePath = join(filePath, "index.html");
      }
    } catch {
      if (!extname(filePath)) {
        filePath = `${filePath}.html`;
      }
    }
    const body = await readFile(filePath);
    res.writeHead(200, {
      "content-type": types[extname(filePath).toLowerCase()] ?? "application/octet-stream",
      "cache-control": "no-cache",
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("not found");
  }
});

server.listen(port, () => {
  console.log(`cogit viewer: http://localhost:${port}/`);
});
