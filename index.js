'use strict';

const Utility = require('./lib/utility');
const Uuid = require('uuid/v1');
const Cycni = require('cycni');
const Path = require('path');
const Fsep = require('fsep');
const Util = require('util');
const Fs = require('fs');
const Os = require('os');

const ReadFile = Util.promisify(Fs.readFile);
const WriteFile = Util.promisify(Fs.writeFile);

module.exports = class Mpdb {

	constructor (options) {

		options = options || {};

		self._sync = options.sync || false;
		self._name = options.name || 'default';
		self._collections = options.collections || {};

		self._path = Path.resolve(options.path) || Path.join(Os.homedir(), '.mpdb');
		// self._path = Path.isAbsolute(self._path) ? self._path : Path.join(process.cwd(), self._path);

		self._db = Path.join(self._path, self._name);

		// if (self._sync) Utility.mkdirsSync(self._db);
		// else return Fsep.mkdirs(self._db);
	}

	async collectionPath (name) {
		return Path.join(this._path, this._name, name, 'index.json');
	}

	async collectionLoad (name) {

		if (!(name in this._collections)) {
			let path = await this.collectionPath(name);

			await Fsep.ensureFile(path, '[]');
			let data = await ReadFile(path, 'utf8');

			if (data.length < 2) {
				data = '[]';
				await WriteFile(path, data);
			}

			data = JSON.parse(data);

			this._collections[name] = data;
		}

		return this._collections[name];
	}

	async collectionSave (name, collections) {

		if (collections === null || collections === undefined) {
			collections = this._collections[name];
		}

		let path = await this.collectionPath(name);
		let data = JSON.stringify(collections, null, '\t');

		await WriteFile(path, data);
	}

	async collection (name) {
		return this._collections[name];
	}

	async findAll (name, options) {
		const collections = await this.collectionLoad(name);

		if (options === null || options === undefined) {
			return collections;
		} else {

			let i = 0;
			let result = [];
			let l = collections.length;

			for (i; i < l; i++) {
				let collection = collections[i];

				if (Cycni.has(collection, options.path, options.value)) {
					result.push(collection);
				}

			}

			return result;
		}

	}

	async findOne (name, options) {
		const collections = await this.collectionLoad(name);

		let i = 0;
		let result = [];
		let l = collections.length;

		for (i; i < l; i++) {
			let collection = collections[i];

			if (Cycni.has(collection, options.path, options.value)) {
				return collection;
			}

		}

	}

	async removeAll (name, options) {
		const collections = await this.collectionLoad(name);

		let i = 0;
		let result = [];
		let l = collections.length;

		for (i; i < l; i++) {
			if (Cycni.has(collections[i], options.path, options.value)) {
				result.push(collections[i]);
				Cycni.remove(collections, i);
				l = collections.length;
			}
		}

		await this.collectionSave(name, collections);

		return result;
	}

	async removeOne (name, options) {
		const collections = await this.collectionLoad(name);

		let i = 0;
		let result;
		let l = collections.length;

		for (i; i < l; i++) {
			if (Cycni.has(collections[i], options.path, options.value)) {
				result = collections[i];
				Cycni.remove(collections, i);
				break;
			}
		}

		await this.collectionSave(name, collections);

		return result;
	}

	async updateAll (name, options) {
		const collections = await this.collectionLoad(name);

		let result = [];
		let i = 0;
		let l = collections.length;

		for (i; i < l; i++) {
			if (Cycni.has(collections[i], options.path, options.value)) {
				options.data.id = collections[i].id;
				result.push(collections[i] = options.data);
			}
		}

		await this.collectionSave(name, collections);

		return result;
	}

	async updateOne (name, options) {
		const collections = await this.collectionLoad(name);

		let result;

		for (let i = 0, l = collections.length; i < l; i++) {
			if (Cycni.has(collections[i], options.path, options.value)) {
				options.data.id = collections[i].id;
				result = collections[i] = options.data;
				break;
			}
		}

		await this.collectionSave(name, collections);

		return result;
	}

	async insertAll (name, options) {
		const collections = await this.collectionLoad(name);

		for (let i = 0, l = options.length; i < l; i++) {
			let option = options[i];
			option.path = option.path === null || option.path === undefined ? collections.length : option.path;
			option.value = option.value === null || option.value === undefined ? {} : option.value;
			option.value.id = Uuid();
			collections.splice(option.path, 0, option.value);
		}

		return await this.collectionSave(name, collections);
	}

	async insertOne (name, options) {
		const collections = await this.collectionLoad(name);

		options.path = options.path === null || options.path === undefined ? collections.length : options.path;
		options.value = options.value === null || options.value === undefined ? {} : options.value;
		options.value.id = Uuid();
		collections.splice(options.path, 0, options.value);

		return await this.collectionSave(name, collections);
	}

}
