var csvStringify = require('csv-stringify');

module.exports = function (action) {
	return {
		mime: 'text/csv',
		properties: {
			delimiter: {
				type: 'string',
				required: true
			}
		},
		parse: function (json, params, callback) {
			return csvStringify(json, {columns: action.output, delimiter: params.delimiter}, callback);
		}
	}
};