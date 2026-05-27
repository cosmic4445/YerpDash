const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const PLAYFAB_TITLE  = "1198A0";
const PLAYFAB_SECRET = "W1E4NNJOU7WDJP1INISB9X78RHQDRQI9B1PGMYPUD54KGZ7CQM";

const MIME = {
  ".html": "text/html",
  ".css":  "text/css",
  ".js":   "application/javascript",
};

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // PlayFab proxy
  if (req.method === "POST" && req.url.startsWith("/playfab/")) {
    const endpoint = req.url.replace("/playfab", "");
    let body = "";
    req.on("data", d => body += d);
    req.on("end", () => {
      const options = {
        hostname: `${PLAYFAB_TITLE}.playfabapi.com`,
        path: endpoint,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-SecretKey": PLAYFAB_SECRET
        }
      };
      const pfReq = https.request(options, pfRes => {
        let data = "";
        pfRes.on("data", d => data += d);
        pfRes.on("end", () => {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(data);
        });
      });
      pfReq.on("error", e => {
        res.writeHead(500);
        res.end(JSON.stringify({ error: e.message }));
      });
      pfReq.write(body);
      pfReq.end();
    });
    return;
  }

  // Serve static files
  let filePath = "." + (req.url === "/" ? "/index.html" : req.url);
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end("Not found"); return; }
    res.writeHead(200, { "Content-Type": MIME[ext] || "text/plain" });
    res.end(data);
  });
});

server.listen(8080, () => {
  console.log("Dashboard running at http://localhost:8080");
});
