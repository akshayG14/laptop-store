const fs = require("fs");
const http = require("http");
const url = require("url");

const json = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {
  const pathName = url.parse(req.url, true).pathname;
  const queryID = url.parse(req.url, true).query.id;

  if (pathName === "/products" || pathName === "/") {
    // product overview
    res.writeHead(200, { "Content-type": "text/html" });

    fs.readFile(`${__dirname}/templates/template-overview.html`, "utf-8", (err, data) => {
      let overviewOutput = data;

      fs.readFile(`${__dirname}/templates/template-card.html`, "utf-8", (err, data) => {
        const cardsOutput = laptopData.map((ele) => replaceTemplate(data, ele)).join("");
        overviewOutput = overviewOutput.replace("{%CARDS%}", cardsOutput);
        res.end(overviewOutput);
      });
    });
  } else if (pathName === "/laptop" && queryID < laptopData.length) {
    // laptop detail
    res.writeHead(200, { "Content-type": "text/html" });

    fs.readFile(`${__dirname}/templates/template-laptop.html`, "utf-8", (err, data) => {
      const laptop = laptopData[queryID];
      const outputHTML = replaceTemplate(data, laptop);
      res.end(outputHTML);
    });
  } else if (/\.(jpg|jpeg|png|gif)$/i.test(pathName)) {
    // Images
    fs.readFile(`${__dirname}/data/img/${pathName}`, (err, data) => {
      res.writeHead(200, { "Content-type": "image/jpg" });
      res.end(data);
    });
  } else {
    // URL not found
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("URL was not found on the server!!!");
  }
});

server.listen(1337, "127.0.0.1", () => {
  console.log("Listening for requests now");
});

function replaceTemplate(originalHTML, laptop) {
  let output = originalHTML.replace(/{%PRODUCT-NAME%}/g, laptop.productName);
  output = output.replace(/{%IMAGE%}/g, laptop.image);
  output = output.replace(/{%CPU%}/g, laptop.cpu);
  output = output.replace(/{%RAM%}/g, laptop.ram);
  output = output.replace(/{%STORAGE%}/g, laptop.storage);
  output = output.replace(/{%SCREEN%}/g, laptop.screen);
  output = output.replace(/{%PRICE%}/g, laptop.price);
  output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
  output = output.replace(/{%ID%}/g, laptop.id);

  return output;
}
