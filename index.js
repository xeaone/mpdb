'use strict';

const EnsureFolder = require('./lib/ensure-folder');
const Uuid = require('uuid/v1');
const Cycni = require('cycni');
const Path = require('path');
const Os = require('os');

module.exports = class Mpdb {

	constructor (options) {
		options = options || {};
		this._collections = {};
		this._name = options.name || 'default';
		this._path = Path.resolve(options.path) || Path.join(Os.homedir(), '.mpdb');
	}

	async collectionLoad (name) {
		if (name in this._collections) return;

		const folderPath = Path.join(this._path, this._name, name);
		const filePath = Path.join(folderPath, 'index.json');
		const options = { path: filePath };

		await EnsureFolder(folderPath);

		this._collections[name] = new Collection(options);

		await this._collections[name].load();
	}

	async collectionSave (name) {
		await this._collections[name].save();
	}

	async collection (name) {
		await this.collectionLoad(name);
		return this._collections[name];
	}

	async findAll (name, options) {
		const collection = await this.collection(name);

		if (options === null || options === undefined) {
			return collection;
		} else {
			const result = [];

			for (let i = 0, l = collection.length; i < l; i++) {
				if (Cycni.has(collection[i], options.path, options.value)) {
					result.push(collection[i]);
				}
			}

			return result;
		}

	}

	async findOne (name, options) {
		const collection = await this.collection(name);
		const result = [];

		for (let i = 0, l = collection.length; i < l; i++) {
			if (Cycni.has(collection[i], options.path, options.value)) {
				return collection[i];
			}
		}

	}

	async removeAll (name, options) {
		const collection = await this.collection(name);
		const result = [];

		for (let i = 0, l = collection.length; i < l; i++) {
			if (Cycni.has(collection[i], options.path, options.value)) {
				result.push(collection[i]);
				Cycni.remove(collection, i);
				l = collection.length;
			}
		}

		await this.collectionSave(name, collection);

		return result;
	}

	async removeOne (name, options) {
		const collection = await this.collection(name);
		let result;

		for (let i = 0, l = collection.length; i < l; i++) {
			if (Cycni.has(collection[i], options.path, options.value)) {
				result = collection[i];
				Cycni.remove(collection, i);
				break;
			}
		}

		await this.collectionSave(name, collection);

		return result;
	}

	async updateAll (name, options) {
		const collection = await this.collection(name);
		const result = [];

		for (let i = 0, l = collection.length; i < l; i++) {
			if (Cycni.has(collection[i], options.path, options.value)) {
				options.data.id = collection[i].id;
				result.push(collection[i] = options.data);
			}
		}

		await this.collectionSave(name, collection);

		return result;
	}

	async updateOne (name, options) {
		const collection = await this.collection(name);
		let result;

		for (let i = 0, l = collection.length; i < l; i++) {
			if (Cycni.has(collection[i], options.path, options.value)) {
				options.data.id = collection[i].id;
				result = collection[i] = options.data;
				break;
			}
		}

		await this.collectionSave(name, collection);

		return result;
	}

	async insertAll (name, options) {
		const collection = await this.collection(name);

		for (let i = 0, l = options.length; i < l; i++) {
			let option = options[i];
			option.path = option.path === null || option.path === undefined ? collection.length : option.path;
			option.value = option.value === null || option.value === undefined ? {} : option.value;
			option.value.id = Uuid();
			collection.splice(option.path, 0, option.value);
		}

		await this.collectionSave(name, collection);
	}

	async insertOne (name, options) {
		const collection = await this.collection(name);

		options.path = options.path === null || options.path === undefined ? collection.length : options.path;
		options.value = options.value === null || options.value === undefined ? {} : options.value;
		options.value.id = Uuid();
		collection.splice(options.path, 0, options.value);

		await this.collectionSave(name, collection);
	}

}
