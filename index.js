'use strict';

var express = require('express');
var path = require('path');
var api = require(path.join(__dirname, 'api'));
var app = express();

app.set('port', process.argv[2] || 8080);
app.use(api);

app.listen(app.get('port'), function() {
    console.log('Server is running on localhost:' + String(app.get('port')));
});