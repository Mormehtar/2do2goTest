"use strict";
var _ = require("underscore");

module.exports = function (elements) {

	var index = {};
	var parents = [];

	_.sortBy(elements, 'id').forEach(function (element) {
		var parent = index[element.parentId];
		if (parent) {
			if (!parent.children) {
				parent.children = [];
			}
			parent.children.push(element);
		} else {
			parents.push(element);
		}
		index[element.id] = element;
	});

	return parents;
};