var _ = require('underscore');

exports.properties = {};

exports.fields = {
	domain: 'domain',
	score: 'score'
};

exports.parse = function (json) {
	var results = json.reduce(function (obj, element) {
		if (!obj[element.domain]) {
			obj[element.domain] = {
				'articles count': 0,
				'score sum': 0
			}
		}
		++obj[element.domain]['articles count'];
		obj[element.domain]['score sum'] += element.score;
		return obj;
	}, {});

	return _.sortBy(Object.keys(results).map(function (domain) {
		return {
			domain: domain,
			'articles count': results[domain]['articles count'],
			'score sum': results[domain]['score sum']
		};
	}), function (element) {
		return -element['score sum'];
	});
};

exports.output = ['domain', 'articles count', 'score sum'];