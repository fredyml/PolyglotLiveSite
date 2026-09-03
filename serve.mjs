import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputDirectory = path.resolve(currentDirectory, "dist");
const port = Number(process.env.PORT || 8080);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function resolveRequestedFile(requestUrl) {
  const url = new URL(requestUrl || "/", "http://localhost");
  const pathname = decodeURIComponent(url.pathname);
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const requestedFile = path.resolve(outputDirectory, relativePath);

  if (requestedFile !== outputDirectory && !requestedFile.startsWith(`${outputDirectory}${path.sep}`)) {
    return null;
  }

  return requestedFile;
}

const server = createServer(async (request, response) => {
  const requestedFile = resolveRequestedFile(request.url);
  if (!requestedFile) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  try {
    const fileInfo = await stat(requestedFile);
    if (!fileInfo.isFile()) throw new Error("Not a file");

    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(requestedFile)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    createReadStream(requestedFile).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(existsSync(outputDirectory) ? "Not found" : "Run npm run build first.");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Polyglot Live site available at http://127.0.0.1:${port}`);
});
