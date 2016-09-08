'use strict';
var path = require('path');
var twostep = require('twostep');
var _ = require('underscore');
var conform = require('conform');
var express = require('express');
var router = express.Router();
var request = require('request');
var Readable = require('stream').Readable;
var actions = require(path.join(__dirname, 'actions'));
var formats = require(path.join(__dirname, 'formats'));

module.exports = router;

router.get('/:action', handle);

const COMMON_OPTIONS = {
	castSource: true,
	exitOnFirstError: true
};

const BASE_SCHEMA = {};

const BASE_PROPERTIES = {
	url: {
		type: 'string',
		required: true
	}
};

function handle (req, res, next) {
	var action = actions[req.params.action];
	if (!action) {
		return next();
	}
	if (!formats[req.query.format]) {
		return res.sendError(new res.APIError(400, `Format ${req.query.format} is not supported.`));
	}
	var format = formats[req.query.format](action);
	var inputData = cleanParams(req.query, format, action);

    twostep.Steppy(
        function () {
            request(inputData.url, this.slot());
        },
	    function (err, response) {
		    if (response.statusCode != 200) {
			    throw new res.APIError(response.statusCode, response.body);
		    }
		    this.pass(JSON.parse(response.body));
	    },
        function (err, jsonData) {
	        format.parse(
				action.parse(
					cleanJson(jsonData, action),
					inputData
				),
				inputData,
				this.slot()
			);
        },
	    function (err, result) {

            res.statusCode = 200;
            res.setHeader('Content-type', format.mime);
            res.setHeader('Content-disposition', `attachment; filename=result.${inputData.format}`);

            var s = new Readable();
            s.pipe(res);
            s.push(result);
            s.push(null);

        },
        function (err) {
            res.sendError(err);
        }
    );

	function cleanParams(input, format, action) {
		var schema = Object.assign({}, BASE_SCHEMA);
		schema.properties = Object.assign({}, BASE_PROPERTIES, format.properties, action.properties);
		var valid = conform.validate(input, schema, COMMON_OPTIONS);
		if (!valid.valid) {
			let error = valid.errors[0];
			throw new res.APIError(400, `${error.property} ${error.message}`);
		}

		return input;
	}

	function cleanJson (json, action) {
		if (!json || !json.data || !json.data.children || !Array.isArray(json.data.children)) {
			throw new res.APIError(400, "Input JSON of wrong format!");
		}

		var fields = Object.keys(action.fields);

		return json.data.children.map(function (element) {
			if (!element || !element.data) {
				throw new res.APIError(400, "Input JSON of wrong format!");
			}

			var result = fields.reduce(function (obj, field) {
				if (typeof action.fields[field] == 'function') {
					obj[field] = action.fields[field](element.data);
				} else {
					obj[field] = element.data[action.fields[field]];
				}
				return obj;
			}, {});

			return result;
		})
	}
}
