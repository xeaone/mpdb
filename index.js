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
	self._path = options.path;
	self._name = options.name || 'default';
	self._collections = options.collections || {};
};

Mpdb.prototype._queryParse = function (query) {
	for (var key in query) {
		if (query.hasOwnProperty(key)) {
			return {
				key: key.split('.'),
				value: query[key]
			};
		}
	}
};

Mpdb.prototype._collectionPath = function (name) {
	return Path.join(this._path, this._name, name, 'index.json');
};

Mpdb.prototype._collectionParse = function (name) {
	const self = this;

	var path = self._collectionPath(name);

	return Promise.resolve().then(function () {
		return Fsep.ensureFile(path, '[]');
	}).then(function () {
		return Fsep.readFile(path, 'utf8');
	}).then(function (collection) {
		return JSON.parse(collection);
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype._collectionStringify = function (name) {
	const self = this;

	var path = self._collectionPath(name);
	var collection = self._collections[name];

	return Promise.resolve().then(function () {
		return Fsep.ensureFile(path, '[]');
	}).then(function () {
		return Fsep.writeFile(path, JSON.stringify(collection, null, '\t'));
	}).then(function () {
		return collection;
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype._splice = function (name, start, end, data) {
	const self = this;

	var collection = self._collections[name];

	if (end === null || end === undefined) end = 0;
	if (start === null || start === undefined) start = collection.length;
	if (data && typeof data === 'object' && !data._id) data._id = Uuid.v1();

	return Promise.resolve().then(function () {
		if (data) collection.splice(start, end, data);
		else collection.splice(start, end); // required
	}).then(function () {
		if (self._path) return self._collectionStringify(name);
	}).then(function () {
		return collection;
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype._search = function (name, query, one) {
	const self = this;

	return new Promise(function (resolve) {
		var collection = self._collections[name];
		var result = [];
		var index = 0;

		one = one || false;

		if (Object.keys(query).length === 0) {
			result = collection;
		} else {
			query = parse(query);

			for (index; index < collection.length; index++) {
				var item = collection[index];

				if (item[query.key[0]] === query.value) {
					if (one) {
						result = item;
						break;
					} else {
						result.push(item);
					}
				}
			}
		}

		return resolve([result, index]);
	});
};

Mpdb.prototype.collection = function (name) {
	const self = this;

	return Promise.resolve().then(function () {
		if (self._path) return self._collectionParse(name);
	}).then(function (collection) {
		collection = collection ? collection : self._collections[name] || [];
		self._collections[name] = collection;
		return collection;
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
			return Promise.resolve().then(function () {
				return self._search(name, query, true);
			}).then(function (result) {
				return self._splice(name, result[1], 1);
			}).catch(function (error) {
				throw error;
			});
		})).catch(function (error) {
			throw error;
		});
	} else {
		return Promise.resolve().then(function () {
			self._collections[name] = [];
			return self._collectionStringify(name);
		}).catch(function (error) {
			throw error;
		});
	}
};

Mpdb.prototype.findOne = function (name, query) {
	const self = this;

	return Promise.resolve().then(function () {
		return self._search(name, query, true);
	}).then(function (result) {
		return result[0];
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype.insertOne = function (name, data) {
	const self = this;

	return Promise.resolve().then(function () {
		return self._splice(name, null, null, data);
	}).catch(function (error) {
		throw error;
	});
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

module.exports = function (options) {
	return new Mpdb(options || {});
};
