var Path = require('path');
var Fs = require('fs');

module.exports.mkdirsSync = function (paths) {
	var cwd = process.cwd();
	var root = Path.parse(cwd).root;
	var cwp = null;

	paths = Path.normalize(paths);
	cwp = Path.isAbsolute(paths) ? root : cwd;
	paths = paths.split(Path.sep);

	paths = paths.filter(function (p) {
		return p && p !== '';
	});

	for (var i = 0; i < paths.length; i++) {
		cwp = Path.join(cwp, paths[i]);
		if (!Fs.existsSync(cwp)) Fs.mkdirSync(cwp);
	}
};

module.exports.MapToObject = function (map) {
	var object = {};

	for (var [key, value] of map) {
		object[key] = value;
	}

	return object;
};

module.exports.ObjectToMap = function (object) {
	var map = new Map();

	for (var key of Object.keys(object)) {
		map.set(key, object[key]);
	}

	return map;
};

module.exports.MapToJson = function (map) {
	return JSON.stringify(module.exports.MapToObject(map));
};

module.exports.JsonToMap = function (json) {
	return module.exports.ObjectToMap(JSON.parse(json));
};

// module.exports.operators = function (result, data) {
// 	for (var key in data) {
// 		if (data.hasOwnProperty(key)) {
// 			if (data[key] === undefined) {
// 				delete result[key];
// 			} else {
// 				result[key] = data[key];
// 			}
// 		}
// 	}
// 	return result;
// };

// module.exports.each = function (iterable, callback, scope) {
// 	var s = null, i = null, l = null, k = null;
//
// 	if (iterable.constructor.name === 'Number') {
// 		for (i = 0; i < iterable; i++) {
// 			s = callback.call(scope, i, iterable);
// 			if (s === 'break') break;
// 			else if (s === 'continue') continue;
// 		}
// 	} else if (iterable.constructor.name === 'Object') {
// 		for (k in iterable) {
// 			if (!iterable.hasOwnProperty(k)) continue;
// 			s = callback.call(scope, iterable[k], k, iterable);
// 			if (s === 'break') break;
// 			else if (s === 'continue') continue;
// 		}
// 	} else {
// 		for (i = 0, l = iterable.length; i < l; i++) {
// 			s = callback.call(scope, iterable[i], i, iterable);
// 			if (s === 'break') break;
// 			else if (s === 'continue') continue;
// 		}
// 	}
//
// 	return iterable;
// };
