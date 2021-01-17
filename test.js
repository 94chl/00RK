var express = require("express");
var fs = require("fs");
var http = require("http");

var app = express();
var server = http.createServer(app);

app.use(express.static(__dirname));

app.use("/", function (request, response) {
  fs.readFile(__dirname + "/index.html", function (error, data) {
    response.setHeader("Content-Type", "text/html");
    response.send(data.toString());
  });
});

server.listen(52273, function () {
  console.log("server running at http://127.0.0.1:52273");
});
