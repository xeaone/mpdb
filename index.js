const Handle = require('./lib/handle');
const Utility = require('./lib/utility');
const Path = require('path');
const Fsep = require('fsep');
const Uuid = require('uuid');
const Os = require('os');

function operators (result, data) {
	for (var key in data) {
		if (data.hasOwnProperty(key)) {
			if (data[key] === undefined) {
				delete result[key];
			} else {
				result[key] = data[key];
			}
		}
	}
	return result;
}

var Mpdb = function (options) {
	const self = this;

	self._sync = options.sync || true;
	self._name = options.name || 'default';
	self._collections = options.collections || new Map();

	self._path = options.path || Path.join(Os.homedir(), '.mpdb');
	self._path = Path.isAbsolute(self._path) ? self._path : Path.join(process.cwd(), self._path);

	self._db = Path.join(self._path, self._name);

	if (self._sync) Utility.mkdirsSync(self._db);
	else return Fsep.mkdirs(self._db);
};

Mpdb.prototype._queryParse = function (object) {
	object = object || {};

	var query = {
		records: []
	};

	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			if (key.includes('$')) {
				query[key] = object[key];
			} else {
				query.key = key;
				query.value = object[key];
			}
		}
	}

	if (!Object.keys(query).includes('$all')) {
		query.$all = false;
	}

	return query;
};

Mpdb.prototype._collectionPath = function (name) {
	const self = this;

	return Path.join(self._path, self._name, name, 'index.json');
};

Mpdb.prototype._collectionLoad = function (name) {
	const self = this;

	if (self._collections.has(name)) return Promise.resolve();

	var path = self._collectionPath(name);

	return Promise.resolve().then(function () {
		return Fsep.ensureFile(path, '[]');
	}).then(function () {
		return Fsep.readFile(path, 'utf8');
	}).then(function (data) {
		if (data.length > 2) return data;
		else return Fsep.writeFile(path, '[]');
	}).then(function (data) {
		self._collections.set(name, JSON.parse(data || '[]'));
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype._collectionSave = function (name) {
	const self = this;
	var path = null;
	var data = null;

	return Promise.resolve().then(function () {
		if (self._collections.has(name)) {
			data = self._collections.get(name);
		} else {
			data = [];
		}

		path = self._collectionPath(name);
		data = JSON.stringify(data, null, '\t');

		return Fsep.writeFile(path, data);
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype.set = function (name, query, data) {
	const self = this;

	return Promise.resolve().then(function () {
		return self._collectionLoad(name);
	}).then(function () {
		if (Object.keys(query).length === 0) {
			Handle.set(data, ['_id'], Uuid.v1());
			Handle.set(self._collections, [name], data);
		} else {
			// TODO: get update working
			query = self._queryParse(query);
			var has = Handle.has(self._collections, [name, query.key], query.value);
			if (has) Handle.set(self._collections, [name, query.key], query.value);
		}
	}).then(function () {
		return self._collectionSave(name);
	}).catch(function (error) {
		throw error;
	});
};

// Mpdb.prototype.add = function (name, data) {
// 	const self = this;
//
// 	return Promise.resolve().then(function () {
// 		return self._collectionLoad(name);
// 	}).then(function () {
// 		var collection = self._collections.get(name);
// 		Handle.set(data, ['_id'], Uuid.v1());
// 		Handle.set(self._collections, [name, collection.length], data);
// 	}).then(function () {
// 		return self._collectionSave(name);
// 	}).catch(function (error) {
// 		throw error;
// 	});
// };

Mpdb.prototype.get = function (name, query) {
	const self = this;

	return Promise.resolve().then(function () {
		return self._collectionLoad(name);
	}).then(function () {
		var collection = self._collections.get(name);

		if (Object.keys(query).length === 0) {
			return collection;
		} else {
			var items = [];

			query = self._queryParse(query);

			Utility.each(collection, function (item) {
				var has = Handle.has(item, query.key, query.value);
				if (has) items.push(item);
				if (!query.$all) return 'break';
			});

			return items;
		}
	}).catch(function (error) {
		throw error;
	});
};

// Mpdb.prototype._splice = function (name, start, end, data) {
// 	const self = this;
//
// 	var collection = self._collections.get(name);
//
// 	if (end === null || end === undefined) end = 0;
// 	if (start === null || start === undefined) start = collection.length;
// 	if (data && typeof data === 'object' && !data._id) data._id = Uuid.v1();
//
// 	return Promise.resolve().then(function () {
// 		if (data) collection.splice(start, end, data);
// 		else collection.splice(start, end); // required
// 	}).then(function () {
// 		return self._collectionSave(name);
// 	}).catch(function (error) {
// 		throw error;
// 	});
// };

// Mpdb.prototype._search = function (name, query, one) {
// 	const self = this;
//
// 	return Promise.resolve().then(function () {
// 		return self._collectionLoad(name);
// 	}).then(function () {
// 		var collection = self._collections.get(name);
// 		var result = [];
// 		var index = 0;
//
// 		one = one || false;
//
// 		if (Object.keys(query).length === 0) {
// 			result = collection;
// 		} else {
// 			query = parse(query);
//
// 			for (index; index < collection.length; index++) {
// 				var item = collection[index];
//
// 				if (item[query.key[0]] === query.value) {
// 					if (one) {
// 						result = item;
// 						break;
// 					} else {
// 						result.push(item);
// 					}
// 				}
// 			}
// 		}
//
// 		return [result, index];
// 	}).catch(function (error) {
// 		throw error;
// 	});
// };

Mpdb.prototype.findOne = function (name, query) {
	const self = this;

	return Promise.resolve().then(function () {
		return self.get(name, query);
	}).catch(function (error) {
		throw error;
	});
	// return Promise.resolve().then(function () {
	// 	return self._search(name, query, true);
	// }).then(function (result) {
	// 	return result[0];
	// }).catch(function (error) {
	// 	throw error;
	// });
};

Mpdb.prototype.insertOne = function (name, data) {
	const self = this;

	return Promise.resolve().then(function () {
		return self.add(name, data);
	}).catch(function (error) {
		throw error;
	});
	// return Promise.resolve().then(function () {
	// 	return self._splice(name, null, null, data);
	// }).catch(function (error) {
	// 	throw error;
	// });
};

Mpdb.prototype.updateOne = function (name, query, data) {
	const self = this;

	return Promise.resolve().then(function () {
		return self._search(name, query, true);
	}).then(function (result) {
		data = operators(result[0], data);
		return self._splice(name, result[1], 1, data);
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype.removeOne = function (name, query) {
	const self = this;

	return Promise.resolve().then(function () {
		return self._search(name, query, true);
	}).then(function (result) {
		return self._splice(name, result[1], 1);
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype.findAll = function (name, query) {
	const self = this;

	return Promise.resolve().then(function () {
		return self._search(name, query, false);
	}).then(function (result) {
		return result[0];
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype.removeAll = function (name, data) {
	const self = this;

	if (data) {
		return Promise.all(data.map(function (query) {
			return self.removeOne(name, query);
		}));
	} else {
		return Promise.resolve().then(function () {
			self._collections.set(name, new Map());
			return self._collectionSave(name);
		}).catch(function (error) {
			throw error;
		});
	}
};

module.exports = function (options) {
	return new Mpdb(options || {});
};
