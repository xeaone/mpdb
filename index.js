var Utility = require('./lib/utility');
var Cycni = require('cycni');
var Path = require('path');
var Fsep = require('fsep');
var Uuid = require('uuid');
var Os = require('os');

var Mpdb = function (options) {
	var self = this;

	self._collections = {};
	self._sync = options.sync || true;
	self._name = options.name || 'default';

	self._path = options.path || Path.join(Os.homedir(), '.mpdb');
	self._path = Path.isAbsolute(self._path) ? self._path : Path.join(process.cwd(), self._path);

	self._db = Path.join(self._path, self._name);

	if (self._sync) Utility.mkdirsSync(self._db);
	else return Fsep.mkdirs(self._db);
};

Mpdb.prototype.collectionPath = function (name) {
	return Path.join(this._path, this._name, name, 'index.json');
};

Mpdb.prototype.collectionLoad = function (name) {
	var self = this;

	if (name in self._collections) {
		return Promise.resolve().then(function () {
			return self._collections[name];
		}).catch(function (error) {
			throw error;
		});
	} else {
		var path = self.collectionPath(name);

		return Promise.resolve().then(function () {
			return Fsep.ensureFile(path, '[]');
		}).then(function () {
			return Fsep.readFile(path, 'utf8');
		}).then(function (data) {
			if (data.length > 2) return data;
			else return Fsep.writeFile(path, '[]');
		}).then(function (data) {
			data = JSON.parse(data);
			return self._collections[name] = data;
		}).catch(function (error) {
			throw error;
		});
	}
};

Mpdb.prototype.collectionSave = function (name, collections) {
	var self = this, path, data;

	return Promise.resolve().then(function () {
		path = self.collectionPath(name);
		data = JSON.stringify(collections, null, '\t');

		return Fsep.writeFile(path, data);
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype.collection = function (name) {
	var self = this;

	return Promise.resolve().then(function () {
		return self._collections[name];
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype.findAll = function (name, options) {
	var self = this;

	return Promise.resolve().then(function () {
		return self.collectionLoad(name);
	}).then(function (collections) {
		var results = [], collection;

		for (var i = 0, l = collections.length; i < l; i++) {
			collection = collections[i];
			if (Cycni.has(collection, options.path, options.value)) {
				results.push(collection);
			}
		}

		return results;
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype.findOne = function (name, options) {
	var self = this, collection;

	return Promise.resolve().then(function () {
		return self.collectionLoad(name);
	}).then(function (collections) {

		for (var i = 0, l = collections.length; i < l; i++) {
			collection = collections[i];
			if (Cycni.has(collection, options.path, options.value)) {
				return collection;
			}
		}

	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype.removeAll = function (name, options) {
	var self = this, collection;

	return Promise.resolve().then(function () {
		return self.collectionLoad(name);
	}).then(function (collections) {

		for (var i = 0, l = collections.length; i < l; i++) {
			collection = collections[i];
			if (Cycni.has(collection, options.path, options.value)) {
				Cycni.remove(collections, i);
				l = collections.length;
			}
		}

		return self.collectionSave(name, collections);
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype.removeOne = function (name, options) {
	var self = this, result;

	return Promise.resolve().then(function () {
		return self.collectionLoad(name);
	}).then(function (collections) {

		for (var i = 0, l = collections.length; i < l; i++) {
			if (Cycni.has(collections[i], options.path, options.value)) {
				result = collections[i];
				Cycni.remove(collections, i);
				break;
			}
		}

		return self.collectionSave(name, collections);
	}).then(function () {
		return result;
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype.updateAll = function (name, options) {
	var self = this, collection;

	return Promise.resolve().then(function () {
		return self.collectionLoad(name);
	}).then(function (collections) {

		for (var i = 0, l = collections.length; i < l; i++) {
			collection = collections[i];
			if (Cycni.has(collections[i], options.path, options.value)) {
				Cycni.set(collection, options.data.path, options.data.value);
			}
		}

		return self.collectionSave(name, collections);
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype.updateOne = function (name, options) {
	var self = this, collection;

	return Promise.resolve().then(function () {
		return self.collectionLoad(name);
	}).then(function (collections) {

		for (var i = 0, l = collections.length; i < l; i++) {
			collection = collections[i];
			if (Cycni.has(collections[i], options.path, options.value)) {
				Cycni.set(collection, options.data.path, options.data.value);
				break;
			}
		}

		return self.collectionSave(name, collections);
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype.insertAll = function (name, options) {
	var self = this, option;

	return Promise.resolve().then(function () {
		return self.collectionLoad(name);
	}).then(function (collections) {

		for (var i = 0, l = options.length; i < l; i++) {
			option = options[i];
			option.path = option.path === null || option.path === undefined ? collections.length : option.path;
			option.value = option.value === null || option.value === undefined ? {} : option.value;
			option.value.id = Uuid.v1();
			collections.splice(option.path, 0, option.value);
		}

		return self.collectionSave(name, collections);
	}).catch(function (error) {
		throw error;
	});
};

Mpdb.prototype.insertOne = function (name, options) {
	var self = this;

	return Promise.resolve().then(function () {
		return self.collectionLoad(name);
	}).then(function (collections) {

		options.path = options.path === null || options.path === undefined ? collections.length : options.path;
		options.value = options.value === null || options.value === undefined ? {} : options.value;
		options.value.id = Uuid.v1();
		collections.splice(options.path, 0, options.value);

		return self.collectionSave(name, collections);
	}).catch(function (error) {
		throw error;
	});
};

module.exports = function (options) {
	return new Mpdb(options || {});
};
