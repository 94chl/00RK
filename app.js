var express = require("express");
var fs = require("fs");
var http = require("http");

var app = express();

app.use(express.static(__dirname));

app.use("/", function (request, response) {
  fs.readFile(__dirname + "/index.html", function (error, data) {
    response.setHeader("Content-Type", "text/html");
    response.send(data.toString());
  });
});

