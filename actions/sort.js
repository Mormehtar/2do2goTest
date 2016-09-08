'use strict';
var _ = require('underscore');

exports.properties = {
	sortField: {
		enum: ['date', 'score'],
		required: true
	},
	sortDirection: {
		enum: ['asc', 'desc'],
		required: true
	}
};

exports.fields = {
	id: 'id',
	title: 'title',
	'utc creation date': function (obj) {
		var date = new Date();
		date.setTime(obj.created * 1000);
		return date.toISOString();
	},
	date: 'created',
	score: 'score'
};

exports.parse = function (json, params) {
	return _.sortBy(json, function (element) {
		return (params.sortDirection == "desc"? -1 : 1) * element[params.sortField];
	}).map(function (element) {
		return _.omit(element, 'date');
	});
};

exports.output = ['id', 'title', 'utc creation date', 'score'];