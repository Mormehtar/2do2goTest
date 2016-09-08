module.exports = function (action) {
	return {
		mime: 'text/plain',
		properties: {
			table: {
				type: 'string',
				required: true
			},
			fields: {
				type: 'array',
				required: true,
				minItems: action.fields.length,
				maxItems: action.fields.length
			}
		},
		parse: function (json, params, callback) {
			var result = json.map(function (element) {
				var values = action.output.map(function (field) {
					return typeof element[field] == 'string'? `'${element[field]}'` : String(element[field]);
				}).join(',');
				return `INSERT INTO ${params.table} (${params.fields.join(',')}) VALUES (${values});`;
			}).join('\n');
			process.nextTick(callback.bind(this, null, result));
		}
	}
};