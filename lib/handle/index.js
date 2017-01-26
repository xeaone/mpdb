const GET = 0;
const SET = 1;
const DEL = 2;
const HAS = 3;

function handleMap (map, paths, value, type) {
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
		}
	} else if (map.has(path)) {
		return handle(map.get(path), paths.slice(1), value, type);
	}
}

function handleArray (array, paths, value, type) {
	var path = paths[0];

	if (paths.length === 1) {
		if (type === GET) {
			return array[path];
		} else if (type === SET) {
			array[path || array.length] = value;
		} else if (type === DEL) {
			array.splice(path, 1);
		} else if (type === HAS) {
			return array[path] === value;
		}
	} else if (Object.keys(array).includes(path)) {
		return handle(array[path], paths.slice(1), value, type);
	}
}

function handleObject (object, paths, value, type) {
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
		}
	} else if (Object.keys(object).includes(path))  {
		return handle(object[path], paths.slice(1), value, type);
	}
}

function handle (item, paths, value, type) {
	if (typeof paths === 'string') {
		paths = paths.replace('[', '.');
		paths = paths.replace(']', '.');
		paths = paths.split('.');
	}

	if (item === null || item === undefined) {
		return item;
	} else if (item.constructor.name === 'Map') {
		return handleMap(item, paths, value, type);
	} else	if (item.constructor.name === 'Array') {
		return handleArray(item, paths, value, type);
	} else	if (item.constructor.name === 'Object') {
		return handleObject(item, paths, value, type);
	} else {
		if (type === HAS) {
			return false;
		}
	}
}

module.exports.get = function (item, paths) {
	return handle(item, paths, null, GET);
};

module.exports.set = function (item, paths, value) {
	return handle(item, paths, value, SET);
};

module.exports.del = function (item, paths) {
	return handle(item, paths, null, DEL);
};

module.exports.has = function (item, paths, value) {
	return handle(item, paths, value, HAS);
};
