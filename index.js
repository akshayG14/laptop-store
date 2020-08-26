const fs = require("fs");
const http = require("http");

const jsonData = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const laptopData = JSON.parse(jsonData);

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-type": "text/html" });
  res.end("this is the response");
});

server.listen(1337, "127.0.0.1", () => {
  console.log("server live");
});