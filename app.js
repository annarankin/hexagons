var express = require('express');
var port = process.env.PORT || 3000
var app = express().use(express.static('public')).listen(port, function() {
  console.log("Alive on " + port)
})