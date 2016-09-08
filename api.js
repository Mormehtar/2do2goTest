'use strict';
var path = require('path');
var express = require('express');
var router = express.Router();

module.exports = router;

router.use(require(path.join(__dirname, 'errorHandling')));

router.use(require(path.join(__dirname, 'requestHandler')));
