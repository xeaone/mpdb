const Path = require('path');
const Fsep = require('fsep');
const Uuid = require('uuid');

function parse (query) {
	for (var key in query) {
		if (query.hasOwnProperty(key)) {
			return { key: key.split('.'), value: query[key] };
		}
	}
}

// function search (object, keys, value, one, modifier, callback, root) {
// 	var firstKey = keys[0];
// 	var key = null;
// 	root = root || object;
//
// 	for (key in object) {
// 		if (!object.hasOwnProperty(key)) continue;
// 		if (key !== firstKey) continue;
//
// 		if (keys.length === 1) {
// 			if (value === object[key]) {
// 				modifier(root, key, value, object);
// 				if (one) break;
// 			}
// 		} else {
// 			keys.shift();
// 			return search(object[key], keys, value, one, modifier, callback, root);
// 		}
//
// 	}
//
// 	if (keys.length === 1) return callback(root);
// }

// function search (object, keys, value, one, items) {
// 	var firstKey = keys[0];
// 	var item = null;
// 	var key = null;
//
// 	items = items || [];
//
// 	for (key in object) {
// 		if (!object.hasOwnProperty(key)) continue;
// 		if (key !== firstKey) continue;
//
// 		item = object[key];
//
// 		if (keys.length === 1) {
// 			if (value === item) {
// 				if (one) return item;
// 				else items.push(item);
// 			}
// 		} else {
// 			keys.shift();
// 			return search(item, keys, value, one, items);
// 		}
//
// 	}
//
// 	if (keys.length === 1) return items;
// }

var Mpdb = function (options) {
	const self = this;
	self._collections = {};
	self._path = options.path;
	self.name = options.name;
};

Mpdb.prototype._collectionPath = function path (name) {
	const self = this;
	return Path.join(self._path, name, 'index.json');
};

Mpdb.prototype._splice = function (name, start, end, data) {
	const self = this;

	var collection = self._collections[name];
	var path = self._collectionPath(name);

	name = name || 'default';
	start = start || collection.length;
	end = end || 0;
	data = data || {};

	return Promise.resolve().then(function () {
		collection.splice(start, end, data);
		if (self._path) return Fsep.outputFile(path, JSON.stringify(collection, null, '\t'));
	}).then(function () {
		return collection[start];
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype._search = function (name, query, one) {
	const self = this;

	var collection = self._collections[name];
	var result = null;
	
	name = name || 'default';
	one = one || false;

	return Promise.resolve().then(function () {

		if (Object.keys(query).length === 0) {
			result = collection;
		} else {
			result = [];
			query = parse(query);

			for (var i = 0; i < collection.length; i++) {
				var item = collection[i];

				if (item[query.key] === query.value) {
					if (one) {
						result = item;
						break;
					} else {
						result.push(item);
					}
				}
			}
		}

		return result;
	});
};

// Mpdb.prototype._search = function (name, query, one) {
// 	const self = this;
// 	var result = null;
// 	var collection = self._collections[name];
//
// 	if (Object.keys(query).length === 0) {
// 		result = collection;
// 	} else {
// 		result = [];
// 		query = parse(query);
//
// 		search(collection, query.key, query.value, one,
// 			function (item) {
// 				result.push(item);
// 			},
// 			function () {
//
// 			}
// 		);
// 	}
//
// 	return Promise.resolve().then(function () {
// 		return result;
// 	});
// };

Mpdb.prototype.collection = function (name) {
	const self = this;

	var path = self._collectionPath(name);
	var data = { _id: Uuid.v1(), _name: name };

	return Promise.resolve().then(function () {
		if (self._path) return Fsep.ensureFile(path, data);
	}).then(function () {
		if (self._path) return Fsep.readFile(path);
	}).then(function (collection) {
		collection = collection ? JSON.parse(collection) : data;
		return self._splice(collection, null, null);
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype.findAll = function (query, callback) {
	const self = this;

	self._search(query, false, function (error, items) {
		if (error) return callback(error);
		return callback(error, items);
	});
};

Mpdb.prototype.findOne = function (query, callback) {
	const self = this;

	self._search(query, true, function (error, item) {
		if (error) return callback(error);
		return callback(error, item);
	});
};

Mpdb.prototype.insertOne = function (data, callback) {
	const self = this;

	self._splice(data, null, null, function (error, item) {
		return callback(error, item);
	});
};

Mpdb.prototype.updateOne = function (query, data, callback) {
	const self = this;

	self._search(query, true, function (error, item, index) {
		if (error) return callback(error);

		self._splice(data, index, 1, function (error, item) {
			return callback(error, item);
		});
	});
};

Mpdb.prototype.removeOne = function (query, callback) {
	const self = this;

	self._search(query, true, function (error, item, index) {
		if (error) return callback(error);

		self._splice(null, index, 1, function (error) {
			return callback(error);
		});
	});
};

module.exports = function (options) {
	return new Mpdb(options || {});
};
