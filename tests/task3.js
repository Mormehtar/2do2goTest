'use strict';
var path = require('path');
var assert = require('chai').assert;
var parse = require(path.join(__dirname, '..', 'task3'));

describe('task3', function () {
	it('should work with one element', function () {
		var result = parse([{id: 1, parentId: 0}]);
		assert.deepEqual(result, [{id: 1, parentId: 0}]);
	});

	it('should build tree', function () {
		var result = parse([
			{id: 3, parentId: 1},
			{id: 1, parentId: 0},
			{id: 2, parentId: 1}
		]);
		assert.deepEqual(result, [
			{
				id: 1,
				parentId: 0,
				children: [
					{id: 2, parentId: 1},
					{id: 3, parentId: 1}
				]
			}
		]);
	});

	it('should build two trees', function () {
		var result = parse([
			{id: 3, parentId: 1},
			{id: 1, parentId: 0},
			{id: 2, parentId: 1},
			{id: 4, parentId: 0},
			{id: 5, parentId: 4},
			{id: 6, parentId: 5}
		]);
		assert.deepEqual(result, [
			{
				id: 1,
				parentId: 0,
				children: [
					{id: 2, parentId: 1},
					{id: 3, parentId: 1}
				]
			},
			{
				id: 4,
				parentId: 0,
				children: [
					{
						id: 5,
						parentId: 4,
						children: [
							{
								id: 6,
								parentId: 5
							}
						]
					}
				]
			}
		]);
	})
});