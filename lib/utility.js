const Path = require('path');
const Fs = require('fs');

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

module.exports.each = function (iterable, callback, scope) {
	var statment = null, i = null, l = null, k = null;

	if (iterable.constructor.name === 'Number') {
		for (i = 0; i < iterable; i++) {
			statment = callback.call(scope, i, iterable);
			if (statment === 'break') break;
			else if (statment === 'continue') continue;
		}
	} else if (iterable.constructor.name === 'Object') {
		for (k in iterable) {
			if (!iterable.hasOwnProperty(k)) continue;
			statment = callback.call(scope, iterable[k], k, iterable);
			if (statment === 'break') break;
			else if (statment === 'continue') continue;
		}
	} else {
		for (i = 0, l = iterable.length; i < l; i++) {
			statment = callback.call(scope, iterable[i], i, iterable);
			if (statment === 'break') break;
			else if (statment === 'continue') continue;
		}
	}

	return iterable;
};
