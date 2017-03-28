const GET = 0;
const SET = 1;
const DEL = 2;
const HAS = 3;
const MOD = 4;

const BREAK = 0;

function eachMap (iterable, callback, scope) {
	var b = null, i = 0, k = iterable.keys(), l = k.length;

	for (i; i < l; i++) {
		b = callback.call(scope, iterable.get(k[i]), k[i], iterable);
		if (b === BREAK) break;
	}

	return iterable;
}

function eachArray (iterable, callback, scope) {
	var b = null, i = 0, l = iterable.length;

	for (i; i < l; i++) {
		b = callback.call(scope, iterable[i], i, iterable);
		if (b === BREAK) break;
	}

	return iterable;
}

function eachObject (iterable, callback, scope) {
	var b = null, k = null;

	for (k in iterable) {
		if (!iterable.hasOwnProperty(k)) continue;
		b = callback.call(scope, iterable[k], k, iterable);
		if (b === BREAK) break;
	}

	return iterable;
}

function each (iterable, callback, scope) {
	if (iterable.constructor.name === 'Map') {
		return eachMap(iterable, callback, scope);
	} else if (iterable.constructor.name === 'Array') {
		return eachArray(iterable, callback, scope);
	} else if (iterable.constructor.name === 'Object') {
		return eachObject(iterable, callback, scope);
	}
}

function handleMap (map, paths, value, callback, type) {
	var path = paths[0];

	if (paths.length === 1) {
		if (type === GET) {
			return map.get(path);
		} else if (type === SET) {
			map.set(path, value);
		} else if (type === DEL) {
			map.delete(path);
		} else if (type === HAS) {
			return map.get(path) === value;
		} else if (type === MOD) {
			if (map.get(path) === value) {
				return callback(map);
			}
		}
	} else if (map.has(path)) {
		return handle(map.get(path), paths.slice(1), value, type);
	}
}

function handleArray (array, paths, value, callback, type) {
	var path = paths[0];

	if (paths.length === 1) {
		if (type === GET) {
			return array[path];
		} else if (type === SET) {
			array[path] = value;
			// array[path || array.length] = value;
		} else if (type === DEL) {
			array.splice(path, 1);
		} else if (type === HAS) {
			return array[path] === value;
		} else if (type === MOD) {
			if (array[path] === value) {
				callback(array);
				console.log(array);
			}
		}
	} else if (Object.keys(array).includes(path)) {
		return handle(array[path], paths.slice(1), value, type);
	}
}

function handleObject (object, paths, value, callback, type) {
	var path = paths[0];

	if (paths.length === 1) {
		if (type === GET) {
			return object[path];
		} else if (type === SET) {
			object[path] = value;
		} else if (type === DEL) {
			delete object[path];
		} else if (type === HAS) {
			return object[path] === value;
		} else if (type === MOD) {
			if (object[path] === value) {
				return callback(object);
			}
		}
	} else if (Object.keys(object).includes(path))  {
		return handle(object[path], paths.slice(1), value, type);
	}
}

function handle (collection, paths, value, callback, type) {

	if (paths.constructor.name === 'String') {
		paths = paths.trim().replace('[', '.').replace(']', '').split('.');
	}

	if (collection === null || collection === undefined) {
		return collection;
	} else if (collection.constructor.name === 'Map') {
		return handleMap(collection, paths, value, callback, type);
	} else	if (collection.constructor.name === 'Array') {
		return handleArray(collection, paths, value, callback, type);
	} else	if (collection.constructor.name === 'Object') {
		return handleObject(collection, paths, value, callback, type);
	} else {
		if (type === HAS) {
			return false;
		}
	}
}

module.exports.get = function (collection, paths) {
	return handle(collection, paths, null, null, GET);
};

module.exports.set = function (collection, paths, value) {
	return handle(collection, paths, value, null, SET);
};

module.exports.del = function (collection, paths) {
	return handle(collection, paths, null, null, DEL);
};

module.exports.has = function (collection, paths, value) {
	return handle(collection, paths, value, null, HAS);
};

module.exports.mod = function (collection, paths, value, callback) {
	return handle(collection, paths, value, callback, MOD);
};
/*
	loops through a collection and finds a match based on the path and value
*/
module.exports.find = function (collection, paths, value, all) {
	var result = all ? [] : null;

	each(collection, function (item) {
		var has = handle(item, paths, value, null, HAS);

		if (has && all === true) {
			result.push(item);
		} else if (has && all === false) {
			result = item;
			return BREAK;
		}
	});

	return result;
};
