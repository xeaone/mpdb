const Utility = require('./lib/utility');
const Cycni = require('cycni');
const Path = require('path');
const Fsep = require('fsep');
const Uuid = require('uuid');
const Os = require('os');

var ALL = 2;
var ONE = 3;
var BREAK = 4;
var CONTINUE = 5;

const Mpdb = function (options) {
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

Mpdb.prototype._collectionPath = function (name) {
	const self = this;

	return Path.join(self._path, self._name, name, 'index.json');
};

Mpdb.prototype._collectionLoad = function (name) {
	const self = this;

	// TODO maybe do nothing if db is in memory

	var path = self._collectionPath(name);

	return Promise.resolve().then(function () {
		return Fsep.ensureFile(path, '[]');
	}).then(function () {
		return Fsep.readFile(path, 'utf8');
	}).then(function (data) {
		if (data.length > 2) return data;
		else return Fsep.writeFile(path, '[]');
	}).then(function (data) {
		data = JSON.parse(data);
		self._collections.set(name, data);
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype._collectionSave = function (name) {
	var self = this, path, data;

	return Promise.resolve().then(function () {
		data = self._collections.get(name);

		path = self._collectionPath(name);
		data = JSON.stringify(data, null, '\t');

		return Fsep.writeFile(path, data);
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype.collection = function (name) {
	var self = this;

	return Promise.resolve().then(function () {
		return self._collections.get(name);
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype.each = function (name, callback) {
	var self = this;

	return Promise.resolve().then(function () {
		return self._collectionLoad(name);
	}).then(function () {
		var collections = self._collections.get(name);
		var results = [], data, collection;

		for (var i = 0; i < collections.length; i++) {
			collection = collections[i];
			data = callback(collection, i, collections);

			if (data && data.cmd === BREAK) break;
			if (data && data.cmd === CONTINUE) continue;
			if (data && data.cmd === ONE) return data.result;
			if (data && data.cmd === ALL) results.push(data.result);
		}

		if (data && data.cmd === ALL) return results;
		else self._collections.set(name, collections);

	}).then(function (result) {
		if (result) return result;
		else return self._collectionSave(name);
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype.findAll = function (name, options) {
	return this.each(name, function (collection) {
		if (Cycni.has(collection, options.path, options.value)) {
			return {
				cmd: ALL,
				result: collection
			};
		}
	});
};

Mpdb.prototype.findOne = function (name, options) {
	return this.each(name, function (collection) {
		if (Cycni.has(collection, options.path, options.value)) {
			return {
				cmd: ONE,
				result: collection
			};
		}
	});
};

Mpdb.prototype.removeAll = function (name, options) {
	return this.each(name, function (collection, index, collections) {
		if (Cycni.has(collection, options.path, options.value)) {
			return {
				cmd: CONTINUE,
				result: collections.splice(index, 1)
			};
		}
	});
};

Mpdb.prototype.removeOne = function (name, options) {
	return this.each(name, function (collection, index, collections) {
		if (Cycni.has(collection, options.path, options.value)) {
			return {
				cmd: BREAK,
				result: collections.splice(index, 1)
			};
		}
	});
};



// Mpdb.prototype.insert = function (name, options) {
// 	return this.prepare(function (collection) {
//
// 		options.paths.push(collection.length.toString());
// 		options.data._id = Uuid.v1();
// 		Cycni.set(collection, options.path, options.data);
//
// 	});
// };
// Mpdb.prototype.update = function (name, options) {
// 	return this.prepare(name, function (collection) {
//
// 		Cycni.traverse(collection, options.path, function (c, k) {
// 			Object.keys(options.data).forEach(function (key) {
// 				Cycni.set(c[k], key, options.data[key]);
// 			});
// 		});
//
// 	});
// };



module.exports = function (options) {
	return new Mpdb(options || {});
};
